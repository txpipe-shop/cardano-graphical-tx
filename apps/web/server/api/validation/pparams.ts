import { toBigInt } from "@laceanatomy/cardano-provider-u5c/mappers";
import { type NapiPParams } from "@laceanatomy/napi-pallas";
import { SENTINEL_MAXIMUM_EPOCH } from "@laceanatomy/types/cardano";
import { type UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { ValidationSetupError } from "./errors";

type BigIntField = { bigInt?: { value?: Uint8Array | bigint } };
type Rational = { numerator?: number; denominator?: number };

function required<T>(field: string, value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new ValidationSetupError(
      `Failed to load protocol params: missing ${field}`,
    );
  }
  return value;
}

function requiredNumber(
  field: string,
  value: number | bigint | null | undefined,
): number {
  const numeric = Number(required(field, value));
  if (!Number.isFinite(numeric)) {
    throw new ValidationSetupError(
      `Failed to load protocol params: invalid ${field}`,
    );
  }
  return numeric;
}

function requiredBigInt(
  field: string,
  value: BigIntField | null | undefined,
): bigint {
  const bigIntValue = required(`${field}.bigInt.value`, value?.bigInt?.value);
  return toBigInt(bigIntValue);
}

function requiredRational(field: string, value: Rational | null | undefined) {
  const rational = required(field, value);
  return {
    numerator: BigInt(requiredNumber(`${field}.numerator`, rational.numerator)),
    denominator: BigInt(
      requiredNumber(`${field}.denominator`, rational.denominator),
    ),
  };
}

function threshold(
  field: string,
  values: Rational[],
  index: number,
): { numerator: bigint; denominator: bigint } {
  return requiredRational(`${field}[${index}]`, values[index]);
}

export async function fetchCurrentPParamsFromUtxorpc(
  client: UtxoRpcClient,
): Promise<NapiPParams> {
  const [paramsRes, genesisRes] = await Promise.all([
    client.query.readParams({}),
    client.query.readGenesis({}),
  ]);

  const params = paramsRes.values;
  if (!params || params.params.case !== "cardano") {
    throw new ValidationSetupError(
      `ReadParams returned unexpected chain: ${params?.params.case ?? "none"}`,
    );
  }

  const genesisConfig = genesisRes.config;
  if (genesisConfig.case !== "cardano") {
    throw new ValidationSetupError("ReadGenesis returned unexpected chain");
  }

  const p = params.params.value;
  const g = genesisConfig.value;
  const costModels = p.costModels;
  const poolThresholds = p.poolVotingThresholds?.thresholds ?? [];
  const drepThresholds = p.drepVotingThresholds?.thresholds ?? [];

  return {
    systemStart: Math.floor(
      new Date(required("genesis.systemStart", g.systemStart)).getTime() / 1000,
    ),
    epochLength: BigInt(requiredNumber("genesis.epochLength", g.epochLength)),
    slotLength: BigInt(requiredNumber("genesis.slotLength", g.slotLength)),
    minfeeA: requiredNumber(
      "minFeeCoefficient",
      requiredBigInt("minFeeCoefficient", p.minFeeCoefficient),
    ),
    minfeeB: requiredNumber(
      "minFeeConstant",
      requiredBigInt("minFeeConstant", p.minFeeConstant),
    ),
    maxBlockBodySize: requiredNumber("maxBlockBodySize", p.maxBlockBodySize),
    maxTransactionSize: requiredNumber("maxTxSize", p.maxTxSize),
    maxBlockHeaderSize: requiredNumber(
      "maxBlockHeaderSize",
      p.maxBlockHeaderSize,
    ),
    keyDeposit: requiredBigInt("stakeKeyDeposit", p.stakeKeyDeposit),
    poolDeposit: requiredBigInt("poolDeposit", p.poolDeposit),
    desiredNumberOfStakePools: requiredNumber(
      "desiredNumberOfPools",
      p.desiredNumberOfPools,
    ),
    protocolVersion: [
      BigInt(requiredNumber("protocolVersion.major", p.protocolVersion?.major)),
      BigInt(requiredNumber("protocolVersion.minor", p.protocolVersion?.minor)),
    ],
    minPoolCost: requiredBigInt("minPoolCost", p.minPoolCost),
    adaPerUtxoByte: requiredBigInt("coinsPerUtxoByte", p.coinsPerUtxoByte),
    costModelsForScriptLanguages: {
      plutusV1: costModels?.plutusV1?.values.map(Number),
      plutusV2: costModels?.plutusV2?.values.map(Number),
      plutusV3: costModels?.plutusV3?.values.map(Number),
    },
    executionCosts: {
      memPrice: requiredRational("prices.memory", p.prices?.memory),
      stepPrice: requiredRational("prices.steps", p.prices?.steps),
    },
    maxTxExUnits: {
      mem: required(
        "maxExecutionUnitsPerTransaction.memory",
        p.maxExecutionUnitsPerTransaction?.memory,
      ),
      steps: required(
        "maxExecutionUnitsPerTransaction.steps",
        p.maxExecutionUnitsPerTransaction?.steps,
      ),
    },
    maxBlockExUnits: {
      mem: required(
        "maxExecutionUnitsPerBlock.memory",
        p.maxExecutionUnitsPerBlock?.memory,
      ),
      steps: required(
        "maxExecutionUnitsPerBlock.steps",
        p.maxExecutionUnitsPerBlock?.steps,
      ),
    },
    maxValueSize: requiredNumber("maxValueSize", p.maxValueSize),
    collateralPercentage: requiredNumber(
      "collateralPercentage",
      p.collateralPercentage,
    ),
    maxCollateralInputs: requiredNumber(
      "maxCollateralInputs",
      p.maxCollateralInputs,
    ),
    expansionRate: requiredRational("monetaryExpansion", p.monetaryExpansion),
    treasuryGrowthRate: requiredRational(
      "treasuryExpansion",
      p.treasuryExpansion,
    ),
    maximumEpoch: SENTINEL_MAXIMUM_EPOCH,
    poolPledgeInfluence: requiredRational("poolInfluence", p.poolInfluence),
    decentralizationConstant: { numerator: 0n, denominator: 1n },
    extraEntropy: undefined,
    poolVotingThresholds: {
      motionNoConfidence: threshold("poolVotingThresholds", poolThresholds, 0),
      committeeNormal: threshold("poolVotingThresholds", poolThresholds, 1),
      committeeNoConfidence: threshold(
        "poolVotingThresholds",
        poolThresholds,
        2,
      ),
      hardForkInitiation: threshold("poolVotingThresholds", poolThresholds, 3),
      securityVotingThreshold: threshold(
        "poolVotingThresholds",
        poolThresholds,
        4,
      ),
    },
    drepVotingThresholds: {
      motionNoConfidence: threshold("drepVotingThresholds", drepThresholds, 0),
      committeeNormal: threshold("drepVotingThresholds", drepThresholds, 1),
      committeeNoConfidence: threshold(
        "drepVotingThresholds",
        drepThresholds,
        2,
      ),
      updateConstitution: threshold("drepVotingThresholds", drepThresholds, 3),
      hardForkInitiation: threshold("drepVotingThresholds", drepThresholds, 4),
      ppNetworkGroup: threshold("drepVotingThresholds", drepThresholds, 5),
      ppEconomicGroup: threshold("drepVotingThresholds", drepThresholds, 6),
      ppTechnicalGroup: threshold("drepVotingThresholds", drepThresholds, 7),
      ppGovernanceGroup: threshold("drepVotingThresholds", drepThresholds, 8),
      treasuryWithdrawal: threshold("drepVotingThresholds", drepThresholds, 9),
    },
    minCommitteeSize: BigInt(
      requiredNumber("minCommitteeSize", p.minCommitteeSize),
    ),
    committeeTermLimit: required("committeeTermLimit", p.committeeTermLimit),
    governanceActionValidityPeriod: required(
      "governanceActionValidityPeriod",
      p.governanceActionValidityPeriod,
    ),
    governanceActionDeposit: requiredBigInt(
      "governanceActionDeposit",
      p.governanceActionDeposit,
    ),
    drepDeposit: requiredBigInt("drepDeposit", p.drepDeposit),
    drepInactivityPeriod: required(
      "drepInactivityPeriod",
      p.drepInactivityPeriod,
    ),
    minfeeRefscriptCostPerByte: requiredRational(
      "minFeeScriptRefCostPerByte",
      p.minFeeScriptRefCostPerByte,
    ),
  };
}
