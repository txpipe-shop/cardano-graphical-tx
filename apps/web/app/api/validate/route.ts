import {
  cborParse,
  validateCborTx,
  type NapiPParams,
} from "@laceanatomy/napi-pallas";
import {
  currentSlot,
  NETWORK_ID,
  NETWORK_MAGIC,
  SENTINEL_MAXIMUM_EPOCH,
  type Network,
} from "@laceanatomy/types/cardano";
import { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { validateTxSchema } from "~/app/_utils";
import { resolveInputs } from "~/server/api/resolve-utxos";
import { getNetworkConfigServer } from "~/server/api/server-network-config";

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

interface Rational {
  numerator: number;
  denominator: number;
}

function toUnitInterval(r: Rational): { numerator: bigint; denominator: bigint } {
  return { numerator: BigInt(r.numerator), denominator: BigInt(r.denominator) };
}

function extractBigInt(field: { bigInt?: { case?: unknown; value?: unknown } } | undefined): bigint {
  if (!field?.bigInt || field.bigInt.case !== "int") return 0n;
  const value = field.bigInt.value;
  if (typeof value === "bigint") return value;
  return 0n;
}

async function fetchPParamsFromUtxorpc(client: UtxoRpcClient): Promise<NapiPParams> {
  const [paramsRes, genesisRes] = await Promise.all([
    client.query.readParams({}),
    client.query.readGenesis({}),
  ]);

  const params = paramsRes.values;
  if (!params || params.params.case !== "cardano") {
    throw new Error(
      `ReadParams returned unexpected chain: ${params?.params.case ?? "none"}`,
    );
  }
  const p = params.params.value;

  const genesisConfig = genesisRes.config;
  if (genesisConfig.case !== "cardano") {
    throw new Error("ReadGenesis returned unexpected chain");
  }
  const g = genesisConfig.value;

  const costModels = p.costModels;
  const plutusV1 = costModels?.plutusV1?.values.map(Number);
  const plutusV2 = costModels?.plutusV2?.values.map(Number);
  const plutusV3 = costModels?.plutusV3?.values.map(Number);

  const poolT = p.poolVotingThresholds?.thresholds ?? [];
  const drepT = p.drepVotingThresholds?.thresholds ?? [];

  return {
    systemStart: Math.floor(new Date(g.systemStart).getTime() / 1000),
    epochLength: BigInt(g.epochLength),
    slotLength: BigInt(g.slotLength),
    minfeeA: Number(extractBigInt(p.minFeeCoefficient)),
    minfeeB: Number(extractBigInt(p.minFeeConstant)),
    maxBlockBodySize: Number(p.maxBlockBodySize),
    maxTransactionSize: Number(p.maxTxSize),
    maxBlockHeaderSize: Number(p.maxBlockHeaderSize),
    keyDeposit: extractBigInt(p.stakeKeyDeposit),
    poolDeposit: extractBigInt(p.poolDeposit),
    desiredNumberOfStakePools: Number(p.desiredNumberOfPools),
    protocolVersion: [
      BigInt(p.protocolVersion?.major ?? 0),
      BigInt(p.protocolVersion?.minor ?? 0),
    ],
    minPoolCost: extractBigInt(p.minPoolCost),
    adaPerUtxoByte: extractBigInt(p.coinsPerUtxoByte),
    costModelsForScriptLanguages: { plutusV1, plutusV2, plutusV3 },
    executionCosts: {
      memPrice: toUnitInterval(p.prices?.memory ?? { numerator: 0, denominator: 1 }),
      stepPrice: toUnitInterval(p.prices?.steps ?? { numerator: 0, denominator: 1 }),
    },
    maxTxExUnits: {
      mem: p.maxExecutionUnitsPerTransaction?.memory ?? 0n,
      steps: p.maxExecutionUnitsPerTransaction?.steps ?? 0n,
    },
    maxBlockExUnits: {
      mem: p.maxExecutionUnitsPerBlock?.memory ?? 0n,
      steps: p.maxExecutionUnitsPerBlock?.steps ?? 0n,
    },
    maxValueSize: Number(p.maxValueSize),
    collateralPercentage: Number(p.collateralPercentage),
    maxCollateralInputs: Number(p.maxCollateralInputs),
    expansionRate: toUnitInterval(
      p.monetaryExpansion ?? { numerator: 0, denominator: 1 },
    ),
    treasuryGrowthRate: toUnitInterval(
      p.treasuryExpansion ?? { numerator: 0, denominator: 1 },
    ),
    maximumEpoch: SENTINEL_MAXIMUM_EPOCH,
    poolPledgeInfluence: toUnitInterval(
      p.poolInfluence ?? { numerator: 0, denominator: 1 },
    ),
    decentralizationConstant: { numerator: 0n, denominator: 1n },
    extraEntropy: undefined,
    poolVotingThresholds: {
      motionNoConfidence: toUnitInterval(poolT[0] ?? { numerator: 0, denominator: 1 }),
      committeeNormal: toUnitInterval(poolT[1] ?? { numerator: 0, denominator: 1 }),
      committeeNoConfidence: toUnitInterval(poolT[2] ?? { numerator: 0, denominator: 1 }),
      hardForkInitiation: toUnitInterval(poolT[3] ?? { numerator: 0, denominator: 1 }),
      securityVotingThreshold: toUnitInterval(poolT[4] ?? { numerator: 0, denominator: 1 }),
    },
    drepVotingThresholds: {
      motionNoConfidence: toUnitInterval(drepT[0] ?? { numerator: 0, denominator: 1 }),
      committeeNormal: toUnitInterval(drepT[1] ?? { numerator: 0, denominator: 1 }),
      committeeNoConfidence: toUnitInterval(drepT[2] ?? { numerator: 0, denominator: 1 }),
      updateConstitution: toUnitInterval(drepT[3] ?? { numerator: 0, denominator: 1 }),
      hardForkInitiation: toUnitInterval(drepT[4] ?? { numerator: 0, denominator: 1 }),
      ppNetworkGroup: toUnitInterval(drepT[5] ?? { numerator: 0, denominator: 1 }),
      ppEconomicGroup: toUnitInterval(drepT[6] ?? { numerator: 0, denominator: 1 }),
      ppTechnicalGroup: toUnitInterval(drepT[7] ?? { numerator: 0, denominator: 1 }),
      ppGovernanceGroup: toUnitInterval(drepT[8] ?? { numerator: 0, denominator: 1 }),
      treasuryWithdrawal: toUnitInterval(drepT[9] ?? { numerator: 0, denominator: 1 }),
    },
    minCommitteeSize: BigInt(p.minCommitteeSize),
    committeeTermLimit: p.committeeTermLimit,
    governanceActionValidityPeriod: p.governanceActionValidityPeriod,
    governanceActionDeposit: extractBigInt(p.governanceActionDeposit),
    drepDeposit: extractBigInt(p.drepDeposit),
    drepInactivityPeriod: p.drepInactivityPeriod,
    minfeeRefscriptCostPerByte: toUnitInterval(
      p.minFeeScriptRefCostPerByte ?? { numerator: 0, denominator: 1 },
    ),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { network, cbor, slot: providedSlot } = validateTxSchema.parse(body);

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

    const pparams = await fetchPParamsFromUtxorpc(utxoClient);
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
