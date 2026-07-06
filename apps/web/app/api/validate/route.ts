import {
  cborParse,
  validateCborTx,
  type NapiPParams,
} from "@laceanatomy/napi-pallas";
import { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import {
  currentSlot,
  getApiKey,
  NETWORK_ID,
  NETWORK_MAGIC,
  SENTINEL_MAXIMUM_EPOCH,
  validateTxSchema,
  type Network,
} from "~/app/_utils";
import { resolveInputs } from "~/server/api/resolve-utxos";
import { getNetworkConfigServer } from "~/server/api/server-network-config";

function floatToRational(value: number) {
  if (value === 0) return { numerator: 0n, denominator: 1n };
  const str = value.toString();
  const parts = str.split(".");
  if (parts.length === 1) return { numerator: BigInt(value), denominator: 1n };
  const denominator = Math.pow(10, parts[1]!.length);
  const numerator = Math.round(value * denominator);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(numerator, denominator);
  return {
    numerator: BigInt(Math.round(numerator / d)),
    denominator: BigInt(Math.round(denominator / d)),
  };
}

function requireField<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing pparams field: ${field}`);
  }
  return value;
}

function requireNum(obj: Record<string, unknown>, field: string): number {
  const value = requireField(obj[field], field);
  if (typeof value === "string") return Number(value);
  if (typeof value !== "number") {
    throw new Error(
      `Expected number for pparams field ${field}, got ${typeof value}`,
    );
  }
  return value;
}

async function blockfrostFetch(url: string, apiKey: string) {
  const res = await fetch(url, { headers: { project_id: apiKey } });
  if (!res.ok) throw new Error(`Blockfrost ${res.status}: ${res.statusText}`);
  return res.json();
}

function getUtxoRpcClient(network: Network): UtxoRpcClient | null {
  const config = getNetworkConfigServer(network);
  if (!config.dolosUtxorpcUrl) return null;
  const headers = config.dolosUtxorpcApiKey
    ? { "dmtr-api-key": config.dolosUtxorpcApiKey }
    : undefined;
  return new UtxoRpcClient({
    transport: createGrpcTransport({
      httpVersion: "2",
      baseUrl: config.dolosUtxorpcUrl,
      interceptors: headers
        ? [
            (next) => async (req) => {
              for (const [key, value] of Object.entries(headers)) {
                req.header.set(key, value);
              }
              return next(req);
            },
          ]
        : [],
    }),
  });
}

async function fetchProtocolParams(
  network: Network,
  apiKey: string,
): Promise<NapiPParams> {
  const base = `https://cardano-${network}.blockfrost.io/api/v0`;
  const [genesisRaw, epochParamsRaw] = await Promise.all([
    blockfrostFetch(`${base}/genesis`, apiKey),
    blockfrostFetch(`${base}/epochs/latest/parameters`, apiKey),
  ]);
  const genesis = genesisRaw as Record<string, unknown>;
  const epochParams = epochParamsRaw as Record<string, unknown>;

  const costModelsPL = epochParams.cost_models as
    | Record<string, Record<string, number>>
    | undefined;
  const plutusV1 = costModelsPL?.PlutusV1
    ? Object.values(costModelsPL.PlutusV1)
    : undefined;
  const plutusV2 = costModelsPL?.PlutusV2
    ? Object.values(costModelsPL.PlutusV2)
    : undefined;
  const plutusV3 = costModelsPL?.PlutusV3
    ? Object.values(costModelsPL.PlutusV3)
    : undefined;

  return {
    systemStart: requireNum(genesis, "system_start"),
    epochLength: BigInt(requireNum(genesis, "epoch_length")),
    slotLength: BigInt(requireNum(genesis, "slot_length")),
    minfeeA: requireNum(epochParams, "min_fee_a"),
    minfeeB: requireNum(epochParams, "min_fee_b"),
    maxBlockBodySize: requireNum(epochParams, "max_block_size"),
    maxTransactionSize: requireNum(epochParams, "max_tx_size"),
    maxBlockHeaderSize: requireNum(epochParams, "max_block_header_size"),
    keyDeposit: BigInt(Math.round(requireNum(epochParams, "key_deposit"))),
    poolDeposit: BigInt(Math.round(requireNum(epochParams, "pool_deposit"))),
    desiredNumberOfStakePools: requireNum(epochParams, "n_opt"),
    protocolVersion: [
      BigInt(requireNum(epochParams, "protocol_major_ver")),
      BigInt(requireNum(epochParams, "protocol_minor_ver")),
    ],
    minPoolCost: BigInt(Math.round(requireNum(epochParams, "min_pool_cost"))),
    adaPerUtxoByte: BigInt(
      Math.round(requireNum(epochParams, "coins_per_utxo_size")),
    ),
    costModelsForScriptLanguages: {
      plutusV1,
      plutusV2,
      plutusV3,
    },
    executionCosts: {
      memPrice: floatToRational(requireNum(epochParams, "price_mem")),
      stepPrice: floatToRational(requireNum(epochParams, "price_step")),
    },
    maxTxExUnits: {
      mem: BigInt(Math.round(requireNum(epochParams, "max_tx_ex_mem"))),
      steps: BigInt(Math.round(requireNum(epochParams, "max_tx_ex_steps"))),
    },
    maxBlockExUnits: {
      mem: BigInt(Math.round(requireNum(epochParams, "max_block_ex_mem"))),
      steps: BigInt(Math.round(requireNum(epochParams, "max_block_ex_steps"))),
    },
    maxValueSize: requireNum(epochParams, "max_val_size"),
    collateralPercentage: requireNum(epochParams, "collateral_percent"),
    maxCollateralInputs: requireNum(epochParams, "max_collateral_inputs"),
    expansionRate: floatToRational(requireNum(epochParams, "rho")),
    treasuryGrowthRate: floatToRational(requireNum(epochParams, "tau")),
    maximumEpoch: SENTINEL_MAXIMUM_EPOCH,
    poolPledgeInfluence: floatToRational(requireNum(epochParams, "a0")),
    decentralizationConstant: floatToRational(
      requireNum(epochParams, "decentralisation_param"),
    ),
    extraEntropy:
      epochParams.extra_entropy != null
        ? { variant: 1, hash: epochParams.extra_entropy as string }
        : undefined,
    poolVotingThresholds: {
      motionNoConfidence: floatToRational(
        requireNum(epochParams, "pvt_motion_no_confidence"),
      ),
      committeeNormal: floatToRational(
        requireNum(epochParams, "pvt_committee_normal"),
      ),
      committeeNoConfidence: floatToRational(
        requireNum(epochParams, "pvt_committee_no_confidence"),
      ),
      hardForkInitiation: floatToRational(
        requireNum(epochParams, "pvt_hard_fork_initiation"),
      ),
      securityVotingThreshold: floatToRational(
        requireNum(epochParams, "pvt_p_p_security_group"),
      ),
    },
    drepVotingThresholds: {
      motionNoConfidence: floatToRational(
        requireNum(epochParams, "dvt_motion_no_confidence"),
      ),
      committeeNormal: floatToRational(
        requireNum(epochParams, "dvt_committee_normal"),
      ),
      committeeNoConfidence: floatToRational(
        requireNum(epochParams, "dvt_committee_no_confidence"),
      ),
      updateConstitution: floatToRational(
        requireNum(epochParams, "dvt_update_to_constitution"),
      ),
      hardForkInitiation: floatToRational(
        requireNum(epochParams, "dvt_hard_fork_initiation"),
      ),
      ppNetworkGroup: floatToRational(
        requireNum(epochParams, "dvt_p_p_network_group"),
      ),
      ppEconomicGroup: floatToRational(
        requireNum(epochParams, "dvt_p_p_economic_group"),
      ),
      ppTechnicalGroup: floatToRational(
        requireNum(epochParams, "dvt_p_p_technical_group"),
      ),
      ppGovernanceGroup: floatToRational(
        requireNum(epochParams, "dvt_p_p_gov_group"),
      ),
      treasuryWithdrawal: floatToRational(
        requireNum(epochParams, "dvt_treasury_withdrawal"),
      ),
    },
    minCommitteeSize: BigInt(requireNum(epochParams, "committee_min_size")),
    committeeTermLimit: BigInt(
      requireNum(epochParams, "committee_max_term_length"),
    ),
    governanceActionValidityPeriod: BigInt(
      requireNum(epochParams, "gov_action_lifetime"),
    ),
    governanceActionDeposit: BigInt(
      Math.round(requireNum(epochParams, "gov_action_deposit")),
    ),
    drepDeposit: BigInt(Math.round(requireNum(epochParams, "drep_deposit"))),
    drepInactivityPeriod: 0n,
    minfeeRefscriptCostPerByte: floatToRational(
      requireNum(epochParams, "min_fee_ref_script_cost_per_byte"),
    ),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { network, cbor, slot: providedSlot } = validateTxSchema.parse(body);

    const apiKey = getApiKey(network);
    if (network !== "devnet" && !apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (network === "devnet") {
      return Response.json({
        era: "unknown",
        checks: [
          {
            rule: "unsupported",
            passed: false,
            error: "Devnet validation not available",
          },
        ],
        valid: false,
      });
    }

    const parsed = cborParse(cbor);
    if (parsed.error || !parsed.cborRes) {
      return Response.json({
        era: "unknown",
        checks: [
          {
            rule: "decode",
            passed: false,
            error: parsed.error || "Failed to parse CBOR",
          },
        ],
        valid: false,
      });
    }

    const tx = parsed.cborRes;

    const allInputHashes = [
      ...tx.inputs.map((i) => ({ txHash: i.txHash, index: i.index })),
      ...(tx.referenceInputs ?? []).map((i) => ({
        txHash: i.txHash,
        index: i.index,
      })),
      ...(tx.collateral?.inputs ?? []).map((i) => ({
        txHash: i.txHash,
        index: i.index,
      })),
    ];

    const utxoClient = getUtxoRpcClient(network);
    if (!utxoClient) {
      return new Response(
        JSON.stringify({
          error: "UTxORPC endpoint not configured for this network",
        }),
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const { resolved: resolvedUtxos, errors: utxoErrors } = await resolveInputs(
      allInputHashes,
      utxoClient,
    );

    const pparams = await fetchProtocolParams(network, apiKey);
    const networkId = NETWORK_ID[network];
    const networkMagic = NETWORK_MAGIC[network];

    const slot = providedSlot ?? currentSlot(network);

    console.dir(pparams, { depth: null });

    const result = validateCborTx(
      cbor,
      resolvedUtxos,
      pparams,
      BigInt(slot),
      networkId!,
      networkMagic!,
    );

    for (const err of utxoErrors) {
      result.checks.unshift({
        rule: "utxo_resolution",
        passed: false,
        error: `${err.txHash}#${err.index}: ${err.reason}`,
      });
    }

    if (utxoErrors.length > 0) {
      result.valid = false;
    }

    return Response.json(result);
  } catch (err) {
    console.error("Validation error:", err);
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify({ error: err.issues.map((i) => i.message) }),
        {
          status: StatusCodes.BAD_REQUEST,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return new Response(
      JSON.stringify({
        error:
          err instanceof Error
            ? err.message
            : ReasonPhrases.INTERNAL_SERVER_ERROR,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
