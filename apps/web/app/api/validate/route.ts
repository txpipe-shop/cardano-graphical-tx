import { cborParse, validateCborTx, type Utxo } from "@laceanatomy/napi-pallas";
import { cardano, query, UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  getApiKey,
  NETWORK_ID,
  NETWORK_MAGIC,
  validateTxSchema,
  type Network,
} from "~/app/_utils";
import { getNetworkConfigServer } from "~/server/api/server-network-config";

function floatToRational(value: number) {
  if (value === 0) return { numerator: 0, denominator: 1 };
  const str = value.toString();
  const parts = str.split(".");
  if (parts.length === 1) return { numerator: value, denominator: 1 };
  const denominator = Math.pow(10, parts[1]!.length);
  const numerator = Math.round(value * denominator);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(numerator, denominator);
  return { numerator: numerator / d, denominator: denominator / d };
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
    ? { "api-key": config.dolosUtxorpcApiKey }
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

type UtxoResolutionError = {
  txHash: string;
  index: number;
  reason: string;
};

function uint8ToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

function bigIntToNumber(bi: cardano.BigInt | undefined): number {
  if (bi?.bigInt?.case !== "int") return 0;
  return Number(bi.bigInt.value);
}

async function resolveUtxos(
  inputHashes: { txHash: string; index: number }[],
  client: UtxoRpcClient,
): Promise<{ resolved: Utxo[]; errors: UtxoResolutionError[] }> {
  const keys = inputHashes.map(
    ({ txHash, index }) =>
      new query.TxoRef({ hash: Buffer.from(txHash, "hex"), index }),
  );

  const response = await client.query.readUtxos({ keys });
  const resolved: Utxo[] = [];
  const errors: UtxoResolutionError[] = [];

  for (let i = 0; i < inputHashes.length; i++) {
    const input = inputHashes[i]!;
    const item = response.items[i];

    if (!item || item.parsedState.case !== "cardano") {
      errors.push({
        txHash: input.txHash,
        index: input.index,
        reason: "UTxO not found via UTxORPC",
      });
      continue;
    }

    const output = item.parsedState.value;
    const assets = (output.assets ?? []).flatMap((ma) =>
      ma.assets.map((a) => ({
        policyId: uint8ToHex(ma.policyId),
        assetsPolicy: [
          {
            assetName: uint8ToHex(a.name),
            amount: bigIntToNumber(
              a.quantity?.case === "outputCoin" ? a.quantity.value : undefined,
            ),
          },
        ],
      })),
    );

    resolved.push({
      txHash: input.txHash,
      index: input.index,
      bytes: uint8ToHex(item.nativeBytes),
      address: uint8ToHex(output.address),
      lovelace: bigIntToNumber(output.coin),
      datum:
        output.datum && output.datum.originalCbor.length > 0
          ? {
              hash: uint8ToHex(output.datum.hash),
              bytes: uint8ToHex(output.datum.originalCbor),
              json: "",
            }
          : undefined,
      assets,
      scriptRef:
        output.script?.script.case && output.script.script.case !== "native"
          ? uint8ToHex(output.script.script.value as Uint8Array)
          : undefined,
    });
  }

  return { resolved, errors };
}

async function fetchProtocolParams(network: Network, apiKey: string) {
  const base = `https://cardano-${network}.blockfrost.io/api/v0`;
  const [genesis, epochParams] = await Promise.all([
    blockfrostFetch(`${base}/genesis`, apiKey),
    blockfrostFetch(`${base}/epochs/latest/parameters`, apiKey),
  ]);

  const costModelsPL = epochParams.cost_models as Record<
    string,
    Record<string, number>
  >;
  const plutusV1 = costModelsPL?.PlutusV1
    ? Object.values(costModelsPL.PlutusV1)
    : null;
  const plutusV2 = costModelsPL?.PlutusV2
    ? Object.values(costModelsPL.PlutusV2)
    : null;
  const plutusV3 = costModelsPL?.PlutusV3
    ? Object.values(costModelsPL.PlutusV3)
    : null;

  const poolVoting = epochParams.pool_voting_thresholds;
  const drepVoting = epochParams.drep_voting_thresholds;

  return {
    systemStart: genesis.system_start ?? 0,
    epochLength: genesis.epoch_length ?? 0,
    slotLength: genesis.slot_length ?? 0,
    minfeeA: epochParams.min_fee_a ?? 0,
    minfeeB: epochParams.min_fee_b ?? 0,
    maxBlockBodySize: genesis.max_block_body_size ?? 0,
    maxTransactionSize: epochParams.max_tx_size ?? 0,
    maxBlockHeaderSize: genesis.max_block_header_size ?? 0,
    keyDeposit: Number(epochParams.key_deposit ?? 0),
    poolDeposit: Number(epochParams.pool_deposit ?? 0),
    desiredNumberOfStakePools: epochParams.n_opt ?? 0,
    protocolVersion: [
      epochParams.protocol_major ?? 0,
      epochParams.protocol_minor ?? 0,
    ],
    minPoolCost: Number(epochParams.min_pool_cost ?? 0),
    adaPerUtxoByte: Number(epochParams.coins_per_utxo_size ?? 0),
    costModelsForScriptLanguages: {
      plutusV1: plutusV1 ?? undefined,
      plutusV2: plutusV2 ?? undefined,
      plutusV3: plutusV3 ?? undefined,
    },
    executionCosts: {
      memPrice: floatToRational(epochParams.price_mem ?? 0),
      stepPrice: floatToRational(epochParams.price_step ?? 0),
    },
    maxTxExUnits: {
      mem: Number(epochParams.max_tx_ex_mem ?? 0),
      steps: Number(epochParams.max_tx_ex_steps ?? 0),
    },
    maxBlockExUnits: {
      mem: Number(epochParams.max_block_ex_mem ?? 0),
      steps: Number(epochParams.max_block_ex_steps ?? 0),
    },
    maxValueSize: Number(epochParams.max_val_size ?? 0),
    collateralPercentage: epochParams.collateral_percent ?? 0,
    maxCollateralInputs: epochParams.max_collateral_inputs ?? 0,
    expansionRate: floatToRational(
      epochParams.monetary_expand_rate ?? genesis.monetary_expand_rate ?? 0,
    ),
    treasuryGrowthRate: floatToRational(
      epochParams.treasury_expand_rate ?? genesis.treasury_expand_rate ?? 0,
    ),
    maximumEpoch: 999999999,
    poolPledgeInfluence: floatToRational(
      epochParams.pool_pledge_influence ?? genesis.pool_pledge_influence ?? 0,
    ),
    decentralizationConstant: floatToRational(
      epochParams.decentralisation_param ?? 0,
    ),
    extraEntropy:
      epochParams.extra_entropy != null
        ? { variant: 1, hash: epochParams.extra_entropy }
        : undefined,
    ...(poolVoting
      ? {
          poolVotingThresholds: {
            motionNoConfidence: floatToRational(
              poolVoting.motion_no_confidence,
            ),
            committeeNormal: floatToRational(poolVoting.committee_normal),
            committeeNoConfidence: floatToRational(
              poolVoting.committee_no_confidence,
            ),
            hardForkInitiation: floatToRational(
              poolVoting.hard_fork_initiation,
            ),
            securityVotingThreshold: floatToRational(
              poolVoting.security_relevant_param_voting_threshold ?? 0,
            ),
          },
        }
      : {
          poolVotingThresholds: {
            motionNoConfidence: { numerator: 51, denominator: 100 },
            committeeNormal: { numerator: 51, denominator: 100 },
            committeeNoConfidence: { numerator: 51, denominator: 100 },
            hardForkInitiation: { numerator: 51, denominator: 100 },
            securityVotingThreshold: { numerator: 51, denominator: 100 },
          },
        }),
    ...(drepVoting
      ? {
          drepVotingThresholds: {
            motionNoConfidence: floatToRational(
              drepVoting.motion_no_confidence,
            ),
            committeeNormal: floatToRational(drepVoting.committee_normal),
            committeeNoConfidence: floatToRational(
              drepVoting.committee_no_confidence,
            ),
            updateConstitution: floatToRational(
              drepVoting.update_to_constitution,
            ),
            hardForkInitiation: floatToRational(
              drepVoting.hard_fork_initiation,
            ),
            ppNetworkGroup: floatToRational(drepVoting.pp_network_group),
            ppEconomicGroup: floatToRational(drepVoting.pp_economic_group),
            ppTechnicalGroup: floatToRational(drepVoting.pp_technical_group),
            ppGovernanceGroup: floatToRational(drepVoting.pp_governance_group),
            treasuryWithdrawal: floatToRational(drepVoting.treasury_withdrawal),
          },
        }
      : {
          drepVotingThresholds: {
            motionNoConfidence: { numerator: 51, denominator: 100 },
            committeeNormal: { numerator: 51, denominator: 100 },
            committeeNoConfidence: { numerator: 51, denominator: 100 },
            updateConstitution: { numerator: 51, denominator: 100 },
            hardForkInitiation: { numerator: 51, denominator: 100 },
            ppNetworkGroup: { numerator: 51, denominator: 100 },
            ppEconomicGroup: { numerator: 51, denominator: 100 },
            ppTechnicalGroup: { numerator: 51, denominator: 100 },
            ppGovernanceGroup: { numerator: 75, denominator: 100 },
            treasuryWithdrawal: { numerator: 51, denominator: 100 },
          },
        }),
    ...(epochParams.min_committee_size != null
      ? { minCommitteeSize: epochParams.min_committee_size }
      : { minCommitteeSize: 0 }),
    ...(epochParams.committee_term_limit != null
      ? { committeeTermLimit: epochParams.committee_term_limit }
      : { committeeTermLimit: 0 }),
    ...(epochParams.governance_action_validity_period != null
      ? {
          governanceActionValidityPeriod:
            epochParams.governance_action_validity_period,
        }
      : { governanceActionValidityPeriod: 0 }),
    ...(epochParams.governance_action_deposit != null
      ? {
          governanceActionDeposit: Number(
            epochParams.governance_action_deposit,
          ),
        }
      : { governanceActionDeposit: 0 }),
    ...(epochParams.drep_deposit != null
      ? { drepDeposit: Number(epochParams.drep_deposit) }
      : { drepDeposit: 0 }),
    ...(epochParams.drep_inactivity_period != null
      ? { drepInactivityPeriod: epochParams.drep_inactivity_period }
      : { drepInactivityPeriod: 0 }),
    ...(epochParams.minfee_refscript_cost_per_byte != null
      ? {
          minfeeRefscriptCostPerByte: floatToRational(
            epochParams.minfee_refscript_cost_per_byte,
          ),
        }
      : {
          minfeeRefscriptCostPerByte: { numerator: 0, denominator: 1 },
        }),
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
    const { resolved: resolvedUtxos, errors: utxoErrors } = await resolveUtxos(
      allInputHashes,
      utxoClient,
    );

    const pparams = await fetchProtocolParams(network, apiKey);
    const pparamsJson = JSON.stringify(pparams);
    const networkId = NETWORK_ID[network];
    const networkMagic = NETWORK_MAGIC[network];

    const nowSec = Date.now() / 1000;
    const currentSlot = Math.max(
      0,
      Math.floor((nowSec - pparams.systemStart) / pparams.slotLength),
    );
    const slot = providedSlot ?? currentSlot;

    const result = validateCborTx(
      cbor,
      resolvedUtxos,
      pparamsJson,
      slot,
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
  } catch (err: any) {
    console.error("Validation error:", err);
    if (err?.issues) {
      return new Response(
        JSON.stringify({ error: err.issues.map((i: any) => i.message) }),
        {
          status: StatusCodes.BAD_REQUEST,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    return new Response(
      JSON.stringify({
        error: err?.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
