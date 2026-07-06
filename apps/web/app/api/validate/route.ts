import { cborParse, validateCborTx, type NapiPParams } from "@laceanatomy/napi-pallas";
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
import { getNetworkConfigServer } from "~/server/api/server-network-config";
import { resolveInputs } from "~/server/api/resolve-utxos";

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

  const poolVoting = requireField<Record<string, number>>(
    epochParams.pool_voting_thresholds as Record<string, number> | undefined,
    "pool_voting_thresholds",
  );
  const drepVoting = requireField<Record<string, number>>(
    epochParams.drep_voting_thresholds as Record<string, number> | undefined,
    "drep_voting_thresholds",
  );

  return {
    systemStart: requireField(genesis.system_start, "system_start") as number,
    epochLength: BigInt(
      requireField(genesis.epoch_length, "epoch_length") as number,
    ),
    slotLength: BigInt(
      requireField(genesis.slot_length, "slot_length") as number,
    ),
    minfeeA: requireField(epochParams.min_fee_a, "min_fee_a") as number,
    minfeeB: requireField(epochParams.min_fee_b, "min_fee_b") as number,
    maxBlockBodySize: requireField(
      genesis.max_block_body_size,
      "max_block_body_size",
    ) as number,
    maxTransactionSize: requireField(
      epochParams.max_tx_size,
      "max_tx_size",
    ) as number,
    maxBlockHeaderSize: requireField(
      genesis.max_block_header_size,
      "max_block_header_size",
    ) as number,
    keyDeposit: BigInt(
      Math.round(
        requireField(epochParams.key_deposit, "key_deposit") as number,
      ),
    ),
    poolDeposit: BigInt(
      Math.round(
        requireField(epochParams.pool_deposit, "pool_deposit") as number,
      ),
    ),
    desiredNumberOfStakePools: requireField(
      epochParams.n_opt,
      "n_opt",
    ) as number,
    protocolVersion: [
      BigInt(
        requireField(epochParams.protocol_major, "protocol_major") as number,
      ),
      BigInt(
        requireField(epochParams.protocol_minor, "protocol_minor") as number,
      ),
    ],
    minPoolCost: BigInt(
      Math.round(
        requireField(epochParams.min_pool_cost, "min_pool_cost") as number,
      ),
    ),
    adaPerUtxoByte: BigInt(
      Math.round(
        requireField(epochParams.coins_per_utxo_size, "coins_per_utxo_size") as number,
      ),
    ),
    costModelsForScriptLanguages: {
      plutusV1,
      plutusV2,
      plutusV3,
    },
    executionCosts: {
      memPrice: floatToRational(
        requireField(epochParams.price_mem, "price_mem") as number,
      ),
      stepPrice: floatToRational(
        requireField(epochParams.price_step, "price_step") as number,
      ),
    },
    maxTxExUnits: {
      mem: BigInt(
        Math.round(
          requireField(epochParams.max_tx_ex_mem, "max_tx_ex_mem") as number,
        ),
      ),
      steps: BigInt(
        Math.round(
          requireField(epochParams.max_tx_ex_steps, "max_tx_ex_steps") as number,
        ),
      ),
    },
    maxBlockExUnits: {
      mem: BigInt(
        Math.round(
          requireField(epochParams.max_block_ex_mem, "max_block_ex_mem") as number,
        ),
      ),
      steps: BigInt(
        Math.round(
          requireField(epochParams.max_block_ex_steps, "max_block_ex_steps") as number,
        ),
      ),
    },
    maxValueSize: requireField(epochParams.max_val_size, "max_val_size") as number,
    collateralPercentage: requireField(
      epochParams.collateral_percent,
      "collateral_percent",
    ) as number,
    maxCollateralInputs: requireField(
      epochParams.max_collateral_inputs,
      "max_collateral_inputs",
    ) as number,
    expansionRate: floatToRational(
      requireField(epochParams.monetary_expand_rate, "monetary_expand_rate") as number,
    ),
    treasuryGrowthRate: floatToRational(
      requireField(epochParams.treasury_expand_rate, "treasury_expand_rate") as number,
    ),
    maximumEpoch: SENTINEL_MAXIMUM_EPOCH,
    poolPledgeInfluence: floatToRational(
      requireField(
        epochParams.pool_pledge_influence,
        "pool_pledge_influence",
      ) as number,
    ),
    decentralizationConstant: floatToRational(
      requireField(
        epochParams.decentralisation_param,
        "decentralisation_param",
      ) as number,
    ),
    extraEntropy:
      epochParams.extra_entropy != null
        ? { variant: 1, hash: epochParams.extra_entropy as string }
        : undefined,
    poolVotingThresholds: {
      motionNoConfidence: floatToRational(
        requireField(poolVoting.motion_no_confidence, "motion_no_confidence"),
      ),
      committeeNormal: floatToRational(
        requireField(poolVoting.committee_normal, "committee_normal"),
      ),
      committeeNoConfidence: floatToRational(
        requireField(
          poolVoting.committee_no_confidence,
          "committee_no_confidence",
        ),
      ),
      hardForkInitiation: floatToRational(
        requireField(poolVoting.hard_fork_initiation, "hard_fork_initiation"),
      ),
      securityVotingThreshold: floatToRational(
        requireField(
          poolVoting.security_relevant_param_voting_threshold,
          "security_relevant_param_voting_threshold",
        ),
      ),
    },
    drepVotingThresholds: {
      motionNoConfidence: floatToRational(
        requireField(drepVoting.motion_no_confidence, "motion_no_confidence"),
      ),
      committeeNormal: floatToRational(
        requireField(drepVoting.committee_normal, "committee_normal"),
      ),
      committeeNoConfidence: floatToRational(
        requireField(
          drepVoting.committee_no_confidence,
          "committee_no_confidence",
        ),
      ),
      updateConstitution: floatToRational(
        requireField(
          drepVoting.update_to_constitution,
          "update_to_constitution",
        ),
      ),
      hardForkInitiation: floatToRational(
        requireField(drepVoting.hard_fork_initiation, "hard_fork_initiation"),
      ),
      ppNetworkGroup: floatToRational(
        requireField(drepVoting.pp_network_group, "pp_network_group"),
      ),
      ppEconomicGroup: floatToRational(
        requireField(drepVoting.pp_economic_group, "pp_economic_group"),
      ),
      ppTechnicalGroup: floatToRational(
        requireField(drepVoting.pp_technical_group, "pp_technical_group"),
      ),
      ppGovernanceGroup: floatToRational(
        requireField(drepVoting.pp_governance_group, "pp_governance_group"),
      ),
      treasuryWithdrawal: floatToRational(
        requireField(drepVoting.treasury_withdrawal, "treasury_withdrawal"),
      ),
    },
    minCommitteeSize: BigInt(
      requireField(epochParams.min_committee_size, "min_committee_size") as number,
    ),
    committeeTermLimit: BigInt(
      requireField(epochParams.committee_term_limit, "committee_term_limit") as number,
    ),
    governanceActionValidityPeriod: BigInt(
      requireField(
        epochParams.governance_action_validity_period,
        "governance_action_validity_period",
      ) as number,
    ),
    governanceActionDeposit: BigInt(
      Math.round(
        requireField(
          epochParams.governance_action_deposit,
          "governance_action_deposit",
        ) as number,
      ),
    ),
    drepDeposit: BigInt(
      Math.round(
        requireField(epochParams.drep_deposit, "drep_deposit") as number,
      ),
    ),
    drepInactivityPeriod: BigInt(
      requireField(
        epochParams.drep_inactivity_period,
        "drep_inactivity_period",
      ) as number,
    ),
    minfeeRefscriptCostPerByte: floatToRational(
      requireField(
        epochParams.minfee_refscript_cost_per_byte,
        "minfee_refscript_cost_per_byte",
      ) as number,
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
    const { resolved: resolvedUtxos, errors: utxoErrors } =
      await resolveInputs(allInputHashes, utxoClient);

    const pparams = await fetchProtocolParams(network, apiKey);
    const networkId = NETWORK_ID[network];
    const networkMagic = NETWORK_MAGIC[network];

    const slot = providedSlot ?? currentSlot(network);

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
          err instanceof Error ? err.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
