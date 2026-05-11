import type {
  Assets,
  Certificate,
  Collateral,
  Metadata,
  ProposalProcedure,
  Utxo,
  RewardWithdrawal as Withdrawal,
  VotingProcedureEntry,
  Witnesses,
} from "@laceanatomy/napi-pallas";

export interface ITransaction {
  era: string;
  txHash: string;
  fee: number;
  scriptsSuccessful: boolean;
  inputs: Utxo[];
  referenceInputs: Utxo[];
  outputs: Utxo[];
  mints: Assets[];
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight?: number;
  blockAbsoluteSlot?: number;
  validityStart?: number;
  ttl?: number;
  metadata?: Metadata[];
  withdrawals?: Withdrawal[];
  certificates?: Certificate[];
  collateral?: Collateral;
  witnesses?: Witnesses;
  size: number;
  cbor?: string;
  scriptDataHash?: string;
  requiredSigners: string[];
  networkId?: number;
  votingProcedures: VotingProcedureEntry[];
  proposalProcedures: ProposalProcedure[];
  treasuryValue?: number;
  donation?: number;
}
