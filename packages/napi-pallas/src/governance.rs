use crate::certs::{anchor_to_napi, credential_to_napi, Anchor, Credential};
use crate::RewardWithdrawal;
use pallas::ledger::traverse::MultiEraProposal;
use pallas_primitives::conway;
use pallas_primitives::UnitInterval as PallasUnitInterval;

#[derive(Default)]
#[napi(object)]
pub struct GovActionId {
  pub transaction_id: String,
  pub action_index: u32,
}

#[derive(Default)]
#[napi(object)]
pub struct UnitInterval {
  pub numerator: i64,
  pub denominator: i64,
}

#[derive(Default)]
#[napi(object)]
pub struct CommitteeMember {
  pub credential: Credential,
  pub epoch: i64,
}

#[napi(discriminant = "kind")]
pub enum Voter {
  ConstitutionalCommitteeKey { hash: String },
  ConstitutionalCommitteeScript { hash: String },
  DRepKey { hash: String },
  DRepScript { hash: String },
  StakePoolKey { hash: String },
}

#[napi(object)]
pub struct VotingProcedureEntry {
  pub voter: Voter,
  pub gov_action_id: GovActionId,
  #[napi(ts_type = "'No' | 'Yes' | 'Abstain'")]
  pub vote: String,
  pub anchor: Option<Anchor>,
}

#[derive(Default)]
#[napi(object)]
pub struct ProtocolParamUpdate {
  pub minfee_a: Option<i64>,
  pub minfee_b: Option<i64>,
  pub max_block_body_size: Option<i64>,
  pub max_transaction_size: Option<i64>,
  pub max_block_header_size: Option<i64>,
  pub key_deposit: Option<i64>,
  pub pool_deposit: Option<i64>,
  pub maximum_epoch: Option<i64>,
  pub desired_number_of_stake_pools: Option<i64>,
  pub pool_pledge_influence_numerator: Option<i64>,
  pub pool_pledge_influence_denominator: Option<i64>,
  pub expansion_rate_numerator: Option<i64>,
  pub expansion_rate_denominator: Option<i64>,
  pub treasury_growth_rate_numerator: Option<i64>,
  pub treasury_growth_rate_denominator: Option<i64>,
  pub min_pool_cost: Option<i64>,
  pub ada_per_utxo_byte: Option<i64>,
  pub cost_models_json: Option<String>,
  pub execution_costs_mem_numerator: Option<i64>,
  pub execution_costs_mem_denominator: Option<i64>,
  pub execution_costs_step_numerator: Option<i64>,
  pub execution_costs_step_denominator: Option<i64>,
  pub max_tx_ex_units_mem: Option<i64>,
  pub max_tx_ex_units_steps: Option<i64>,
  pub max_block_ex_units_mem: Option<i64>,
  pub max_block_ex_units_steps: Option<i64>,
  pub max_value_size: Option<i64>,
  pub collateral_percentage: Option<i64>,
  pub max_collateral_inputs: Option<i64>,
  pub pool_voting_thresholds: Option<Vec<UnitInterval>>,
  pub drep_voting_thresholds: Option<Vec<UnitInterval>>,
  pub min_committee_size: Option<i64>,
  pub committee_term_limit: Option<i64>,
  pub governance_action_validity_period: Option<i64>,
  pub governance_action_deposit: Option<i64>,
  pub drep_deposit: Option<i64>,
  pub drep_inactivity_period: Option<i64>,
  pub minfee_refscript_cost_per_byte_numerator: Option<i64>,
  pub minfee_refscript_cost_per_byte_denominator: Option<i64>,
}

#[napi(discriminant = "kind")]
pub enum GovAction {
  ParameterChange {
    prev_gov_action_id: Option<GovActionId>,
    protocol_param_update: ProtocolParamUpdate,
    policy_hash: Option<String>,
  },
  HardForkInitiation {
    prev_gov_action_id: Option<GovActionId>,
    major_version: i64,
    minor_version: i64,
  },
  TreasuryWithdrawals {
    withdrawals: Vec<RewardWithdrawal>,
    policy_hash: Option<String>,
  },
  NoConfidence {
    prev_gov_action_id: Option<GovActionId>,
  },
  UpdateCommittee {
    prev_gov_action_id: Option<GovActionId>,
    removed_members: Vec<Credential>,
    added_members: Vec<CommitteeMember>,
    quorum: UnitInterval,
  },
  NewConstitution {
    prev_gov_action_id: Option<GovActionId>,
    constitution_anchor: Anchor,
    guardrail_script: Option<String>,
  },
  Information,
}

#[napi(object)]
pub struct ProposalProcedure {
  pub deposit: i64,
  pub reward_account: String,
  pub gov_action: GovAction,
  pub anchor: Anchor,
}

pub(crate) fn voter_to_napi(voter: &conway::Voter) -> Voter {
  match voter {
    conway::Voter::ConstitutionalCommitteeKey(hash) => Voter::ConstitutionalCommitteeKey {
      hash: hash.to_string(),
    },
    conway::Voter::ConstitutionalCommitteeScript(hash) => Voter::ConstitutionalCommitteeScript {
      hash: hash.to_string(),
    },
    conway::Voter::DRepKey(hash) => Voter::DRepKey {
      hash: hash.to_string(),
    },
    conway::Voter::DRepScript(hash) => Voter::DRepScript {
      hash: hash.to_string(),
    },
    conway::Voter::StakePoolKey(hash) => Voter::StakePoolKey {
      hash: hash.to_string(),
    },
  }
}

pub(crate) fn gov_action_id_to_napi(id: &conway::GovActionId) -> GovActionId {
  GovActionId {
    transaction_id: id.transaction_id.to_string(),
    action_index: id.action_index,
  }
}

fn unit_interval_to_napi(ui: &PallasUnitInterval) -> UnitInterval {
  UnitInterval {
    numerator: ui.numerator as i64,
    denominator: ui.denominator as i64,
  }
}

fn protocol_param_update_to_napi(ppu: &conway::ProtocolParamUpdate) -> ProtocolParamUpdate {
  ProtocolParamUpdate {
    minfee_a: ppu.minfee_a.map(|v| v as i64),
    minfee_b: ppu.minfee_b.map(|v| v as i64),
    max_block_body_size: ppu.max_block_body_size.map(|v| v as i64),
    max_transaction_size: ppu.max_transaction_size.map(|v| v as i64),
    max_block_header_size: ppu.max_block_header_size.map(|v| v as i64),
    key_deposit: ppu.key_deposit.map(|v| v as i64),
    pool_deposit: ppu.pool_deposit.map(|v| v as i64),
    maximum_epoch: ppu.maximum_epoch.map(|v| v as i64),
    desired_number_of_stake_pools: ppu.desired_number_of_stake_pools.map(|v| v as i64),
    pool_pledge_influence_numerator: ppu
      .pool_pledge_influence
      .as_ref()
      .map(|r| r.numerator as i64),
    pool_pledge_influence_denominator: ppu
      .pool_pledge_influence
      .as_ref()
      .map(|r| r.denominator as i64),
    expansion_rate_numerator: ppu.expansion_rate.as_ref().map(|u| u.numerator as i64),
    expansion_rate_denominator: ppu.expansion_rate.as_ref().map(|u| u.denominator as i64),
    treasury_growth_rate_numerator: ppu
      .treasury_growth_rate
      .as_ref()
      .map(|u| u.numerator as i64),
    treasury_growth_rate_denominator: ppu
      .treasury_growth_rate
      .as_ref()
      .map(|u| u.denominator as i64),
    min_pool_cost: ppu.min_pool_cost.map(|v| v as i64),
    ada_per_utxo_byte: ppu.ada_per_utxo_byte.map(|v| v as i64),
    cost_models_json: ppu
      .cost_models_for_script_languages
      .as_ref()
      .map(|cm| serde_json::to_string(cm).unwrap_or_default()),
    execution_costs_mem_numerator: ppu
      .execution_costs
      .as_ref()
      .map(|ep| ep.mem_price.numerator as i64),
    execution_costs_mem_denominator: ppu
      .execution_costs
      .as_ref()
      .map(|ep| ep.mem_price.denominator as i64),
    execution_costs_step_numerator: ppu
      .execution_costs
      .as_ref()
      .map(|ep| ep.step_price.numerator as i64),
    execution_costs_step_denominator: ppu
      .execution_costs
      .as_ref()
      .map(|ep| ep.step_price.denominator as i64),
    max_tx_ex_units_mem: ppu.max_tx_ex_units.as_ref().map(|eu| eu.mem as i64),
    max_tx_ex_units_steps: ppu.max_tx_ex_units.as_ref().map(|eu| eu.steps as i64),
    max_block_ex_units_mem: ppu.max_block_ex_units.as_ref().map(|eu| eu.mem as i64),
    max_block_ex_units_steps: ppu.max_block_ex_units.as_ref().map(|eu| eu.steps as i64),
    max_value_size: ppu.max_value_size.map(|v| v as i64),
    collateral_percentage: ppu.collateral_percentage.map(|v| v as i64),
    max_collateral_inputs: ppu.max_collateral_inputs.map(|v| v as i64),
    pool_voting_thresholds: ppu.pool_voting_thresholds.as_ref().map(|t| {
      vec![
        unit_interval_to_napi(&t.motion_no_confidence),
        unit_interval_to_napi(&t.committee_normal),
        unit_interval_to_napi(&t.committee_no_confidence),
        unit_interval_to_napi(&t.hard_fork_initiation),
        unit_interval_to_napi(&t.security_voting_threshold),
      ]
    }),
    drep_voting_thresholds: ppu.drep_voting_thresholds.as_ref().map(|t| {
      vec![
        unit_interval_to_napi(&t.motion_no_confidence),
        unit_interval_to_napi(&t.committee_normal),
        unit_interval_to_napi(&t.committee_no_confidence),
        unit_interval_to_napi(&t.update_constitution),
        unit_interval_to_napi(&t.hard_fork_initiation),
        unit_interval_to_napi(&t.pp_network_group),
        unit_interval_to_napi(&t.pp_economic_group),
        unit_interval_to_napi(&t.pp_technical_group),
        unit_interval_to_napi(&t.pp_governance_group),
        unit_interval_to_napi(&t.treasury_withdrawal),
      ]
    }),
    min_committee_size: ppu.min_committee_size.map(|v| v as i64),
    committee_term_limit: ppu.committee_term_limit.map(|v| v as i64),
    governance_action_validity_period: ppu.governance_action_validity_period.map(|v| v as i64),
    governance_action_deposit: ppu.governance_action_deposit.map(|v| v as i64),
    drep_deposit: ppu.drep_deposit.map(|v| v as i64),
    drep_inactivity_period: ppu.drep_inactivity_period.map(|v| v as i64),
    minfee_refscript_cost_per_byte_numerator: ppu
      .minfee_refscript_cost_per_byte
      .as_ref()
      .map(|u| u.numerator as i64),
    minfee_refscript_cost_per_byte_denominator: ppu
      .minfee_refscript_cost_per_byte
      .as_ref()
      .map(|u| u.denominator as i64),
  }
}

pub(crate) fn gov_action_to_napi(ga: &conway::GovAction) -> GovAction {
  match ga {
    conway::GovAction::ParameterChange(prev_id, ppu, policy_hash) => GovAction::ParameterChange {
      prev_gov_action_id: prev_id.as_ref().map(gov_action_id_to_napi),
      protocol_param_update: protocol_param_update_to_napi(ppu),
      policy_hash: policy_hash.as_ref().map(|h| h.to_string()),
    },
    conway::GovAction::HardForkInitiation(prev_id, (major, minor)) => {
      GovAction::HardForkInitiation {
        prev_gov_action_id: prev_id.as_ref().map(gov_action_id_to_napi),
        major_version: *major as i64,
        minor_version: *minor as i64,
      }
    }
    conway::GovAction::TreasuryWithdrawals(withdrawals, policy_hash) => {
      GovAction::TreasuryWithdrawals {
        withdrawals: withdrawals
          .iter()
          .map(|(addr, amount)| RewardWithdrawal {
            reward_account: addr.to_string(),
            amount: *amount as i64,
          })
          .collect(),
        policy_hash: policy_hash.as_ref().map(|h| h.to_string()),
      }
    }
    conway::GovAction::NoConfidence(prev_id) => GovAction::NoConfidence {
      prev_gov_action_id: prev_id.as_ref().map(gov_action_id_to_napi),
    },
    conway::GovAction::UpdateCommittee(prev_id, removed, added, quorum) => {
      GovAction::UpdateCommittee {
        prev_gov_action_id: prev_id.as_ref().map(gov_action_id_to_napi),
        removed_members: removed.iter().map(credential_to_napi).collect(),
        added_members: added
          .iter()
          .map(|(cred, epoch)| CommitteeMember {
            credential: credential_to_napi(cred),
            epoch: *epoch as i64,
          })
          .collect(),
        quorum: unit_interval_to_napi(quorum),
      }
    }
    conway::GovAction::NewConstitution(prev_id, constitution) => GovAction::NewConstitution {
      prev_gov_action_id: prev_id.as_ref().map(gov_action_id_to_napi),
      constitution_anchor: anchor_to_napi(&constitution.anchor),
      guardrail_script: constitution
        .guardrail_script
        .as_ref()
        .map(|h| h.to_string()),
    },
    conway::GovAction::Information => GovAction::Information,
  }
}

pub(crate) fn proposal_procedure_to_napi(p: &MultiEraProposal<'_>) -> ProposalProcedure {
  match p {
    MultiEraProposal::Conway(proc) => ProposalProcedure {
      deposit: proc.deposit as i64,
      reward_account: proc.reward_account.to_string(),
      gov_action: gov_action_to_napi(&proc.gov_action),
      anchor: anchor_to_napi(&proc.anchor),
    },
    _ => ProposalProcedure {
      deposit: 0,
      reward_account: "".to_string(),
      gov_action: GovAction::Information,
      anchor: Anchor {
        url: "".to_string(),
        hash: "".to_string(),
      },
    },
  }
}

pub(crate) fn voting_procedures_to_napi(
  vp: &conway::VotingProcedures,
) -> Vec<VotingProcedureEntry> {
  vp.iter()
    .flat_map(|(voter, actions)| {
      actions
        .iter()
        .map(move |(gov_action_id, procedure)| VotingProcedureEntry {
          voter: voter_to_napi(voter),
          gov_action_id: gov_action_id_to_napi(gov_action_id),
          vote: match procedure.vote {
            conway::Vote::No => "No".to_string(),
            conway::Vote::Yes => "Yes".to_string(),
            conway::Vote::Abstain => "Abstain".to_string(),
          },
          anchor: procedure.anchor.as_ref().map(anchor_to_napi),
        })
    })
    .collect()
}
