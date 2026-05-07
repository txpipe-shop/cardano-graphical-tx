use pallas::ledger::traverse::MultiEraCert;
use pallas_primitives::{
  alonzo, conway, Relay as PallasRelay, StakeCredential as PallasStakeCredential,
};

// --- Helper types ---

#[derive(Default)]
#[napi(object)]
pub struct Credential {
  #[napi(ts_type = "'Key' | 'Script'")]
  pub credential_type: String,
  pub hash: String,
}

#[derive(Default)]
#[napi(object)]
pub struct DRep {
  #[napi(ts_type = "'Key' | 'Script' | 'Abstain' | 'NoConfidence'")]
  pub drep_type: String,
  pub hash: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct Anchor {
  pub url: String,
  pub hash: String,
}

#[derive(Default)]
#[napi(object)]
pub struct Relay {
  #[napi(ts_type = "'SingleHostAddr' | 'SingleHostName' | 'MultiHostName'")]
  pub relay_type: String,
  pub port: Option<i64>,
  pub ipv4: Option<String>,
  pub ipv6: Option<String>,
  pub dns_name: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct PoolParams {
  pub operator: String,
  pub vrf_keyhash: String,
  pub pledge: i64,
  pub cost: i64,
  pub margin_numerator: i64,
  pub margin_denominator: i64,
  pub reward_account: String,
  pub pool_owners: Vec<String>,
  pub relays: Vec<Relay>,
  pub pool_metadata_url: Option<String>,
  pub pool_metadata_hash: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct MirTarget {
  pub credential: Credential,
  pub amount: i64,
}

// --- Main certificate enum ---

#[napi(discriminant = "kind")]
pub enum Certificate {
  NotApplicable,
  StakeRegistration {
    stake_credential: Credential,
  },
  StakeDeregistration {
    stake_credential: Credential,
  },
  StakeDelegation {
    stake_credential: Credential,
    pool_keyhash: String,
  },
  PoolRegistration {
    pool_params: PoolParams,
  },
  PoolRetirement {
    pool_keyhash: String,
    epoch: i64,
  },
  Reg {
    stake_credential: Credential,
    coin: i64,
  },
  UnReg {
    stake_credential: Credential,
    coin: i64,
  },
  VoteDeleg {
    stake_credential: Credential,
    drep: DRep,
  },
  StakeVoteDeleg {
    stake_credential: Credential,
    pool_keyhash: String,
    drep: DRep,
  },
  StakeRegDeleg {
    stake_credential: Credential,
    pool_keyhash: String,
    coin: i64,
  },
  VoteRegDeleg {
    stake_credential: Credential,
    drep: DRep,
    coin: i64,
  },
  StakeVoteRegDeleg {
    stake_credential: Credential,
    pool_keyhash: String,
    drep: DRep,
    coin: i64,
  },
  AuthCommitteeHot {
    committee_cold_credential: Credential,
    committee_hot_credential: Credential,
  },
  ResignCommitteeCold {
    committee_cold_credential: Credential,
    anchor: Option<Anchor>,
  },
  RegDRepCert {
    drep_credential: Credential,
    coin: i64,
    anchor: Option<Anchor>,
  },
  UnRegDRepCert {
    drep_credential: Credential,
    coin: i64,
  },
  UpdateDRepCert {
    drep_credential: Credential,
    anchor: Option<Anchor>,
  },
  GenesisKeyDelegation {
    genesishash: String,
    genesis_delegate_hash: String,
    vrf_keyhash: String,
  },
  MoveInstantaneousRewardsCert {
    #[napi(ts_type = "'Reserves' | 'Treasury'")]
    source: String,
    stake_credentials: Option<Vec<MirTarget>>,
    other_accounting_pot: Option<i64>,
  },
}

// --- Conversion helpers ---

fn credential_to_napi(cred: &PallasStakeCredential) -> Credential {
  match cred {
    PallasStakeCredential::AddrKeyhash(hash) => Credential {
      credential_type: "Key".to_string(),
      hash: hash.to_string(),
    },
    PallasStakeCredential::ScriptHash(hash) => Credential {
      credential_type: "Script".to_string(),
      hash: hash.to_string(),
    },
  }
}

fn drep_to_napi(drep: &conway::DRep) -> DRep {
  match drep {
    conway::DRep::Key(hash) => DRep {
      drep_type: "Key".to_string(),
      hash: Some(hash.to_string()),
    },
    conway::DRep::Script(hash) => DRep {
      drep_type: "Script".to_string(),
      hash: Some(hash.to_string()),
    },
    conway::DRep::Abstain => DRep {
      drep_type: "Abstain".to_string(),
      hash: None,
    },
    conway::DRep::NoConfidence => DRep {
      drep_type: "NoConfidence".to_string(),
      hash: None,
    },
  }
}

fn anchor_to_napi(anchor: &conway::Anchor) -> Anchor {
  Anchor {
    url: anchor.url.clone(),
    hash: anchor.content_hash.to_string(),
  }
}

fn relay_to_napi(relay: &PallasRelay) -> Relay {
  match relay {
    PallasRelay::SingleHostAddr(port, ipv4, ipv6) => Relay {
      relay_type: "SingleHostAddr".to_string(),
      port: port.map(|p| p as i64),
      ipv4: ipv4.as_ref().map(|b| hex::encode(b.as_slice())),
      ipv6: ipv6.as_ref().map(|b| hex::encode(b.as_slice())),
      dns_name: None,
    },
    PallasRelay::SingleHostName(port, dns) => Relay {
      relay_type: "SingleHostName".to_string(),
      port: port.map(|p| p as i64),
      ipv4: None,
      ipv6: None,
      dns_name: Some(dns.clone()),
    },
    PallasRelay::MultiHostName(dns) => Relay {
      relay_type: "MultiHostName".to_string(),
      port: None,
      ipv4: None,
      ipv6: None,
      dns_name: Some(dns.clone()),
    },
  }
}

fn pool_params_to_napi(
  operator: &pallas_primitives::PoolKeyhash,
  vrf_keyhash: &pallas_primitives::VrfKeyhash,
  pledge: u64,
  cost: u64,
  margin: &pallas_primitives::UnitInterval,
  reward_account: &pallas_primitives::RewardAccount,
  pool_owners: &[pallas_primitives::AddrKeyhash],
  relays: &[PallasRelay],
  pool_metadata: &Option<pallas_primitives::PoolMetadata>,
) -> PoolParams {
  PoolParams {
    operator: operator.to_string(),
    vrf_keyhash: vrf_keyhash.to_string(),
    pledge: pledge as i64,
    cost: cost as i64,
    margin_numerator: margin.numerator as i64,
    margin_denominator: margin.denominator as i64,
    reward_account: hex::encode(reward_account.as_slice()),
    pool_owners: pool_owners.iter().map(|h| h.to_string()).collect(),
    relays: relays.iter().map(relay_to_napi).collect(),
    pool_metadata_url: pool_metadata.as_ref().map(|m| m.url.clone()),
    pool_metadata_hash: pool_metadata.as_ref().map(|m| m.hash.to_string()),
  }
}

// --- Main conversion function ---

pub(crate) fn get_certificates(tx: &pallas::ledger::traverse::MultiEraTx<'_>) -> Vec<Certificate> {
  tx.certs()
    .iter()
    .map(|cert| match cert {
      MultiEraCert::NotApplicable => Certificate::NotApplicable,
      MultiEraCert::AlonzoCompatible(cow) => alonzo_cert_to_napi(cow),
      MultiEraCert::Conway(cow) => conway_cert_to_napi(cow),
      other => panic!("Unsupported MultiEraCert variant: {:?}", other),
    })
    .collect()
}

fn alonzo_cert_to_napi(cert: &std::borrow::Cow<'_, alonzo::Certificate>) -> Certificate {
  match cert.as_ref() {
    alonzo::Certificate::StakeRegistration(cred) => Certificate::StakeRegistration {
      stake_credential: credential_to_napi(cred),
    },
    alonzo::Certificate::StakeDeregistration(cred) => Certificate::StakeDeregistration {
      stake_credential: credential_to_napi(cred),
    },
    alonzo::Certificate::StakeDelegation(cred, pool) => Certificate::StakeDelegation {
      stake_credential: credential_to_napi(cred),
      pool_keyhash: pool.to_string(),
    },
    alonzo::Certificate::PoolRegistration {
      operator,
      vrf_keyhash,
      pledge,
      cost,
      margin,
      reward_account,
      pool_owners,
      relays,
      pool_metadata,
    } => Certificate::PoolRegistration {
      pool_params: pool_params_to_napi(
        operator,
        vrf_keyhash,
        *pledge,
        *cost,
        margin,
        reward_account,
        pool_owners,
        relays,
        pool_metadata,
      ),
    },
    alonzo::Certificate::PoolRetirement(pool, epoch) => Certificate::PoolRetirement {
      pool_keyhash: pool.to_string(),
      epoch: *epoch as i64,
    },
    alonzo::Certificate::GenesisKeyDelegation(genesishash, genesis_delegate_hash, vrf_keyhash) => {
      Certificate::GenesisKeyDelegation {
        genesishash: genesishash.to_string(),
        genesis_delegate_hash: genesis_delegate_hash.to_string(),
        vrf_keyhash: vrf_keyhash.to_string(),
      }
    }
    alonzo::Certificate::MoveInstantaneousRewardsCert(mir) => {
      let source = match mir.source {
        alonzo::InstantaneousRewardSource::Reserves => "Reserves".to_string(),
        alonzo::InstantaneousRewardSource::Treasury => "Treasury".to_string(),
      };
      let (stake_credentials, other_accounting_pot) = match &mir.target {
        alonzo::InstantaneousRewardTarget::StakeCredentials(map) => {
          let targets = map
            .iter()
            .map(|(cred, amount)| MirTarget {
              credential: credential_to_napi(cred),
              amount: *amount as i64,
            })
            .collect();
          (Some(targets), None)
        }
        alonzo::InstantaneousRewardTarget::OtherAccountingPot(coin) => (None, Some(*coin as i64)),
      };
      Certificate::MoveInstantaneousRewardsCert {
        source,
        stake_credentials,
        other_accounting_pot,
      }
    }
  }
}

fn conway_cert_to_napi(cert: &std::borrow::Cow<'_, conway::Certificate>) -> Certificate {
  match cert.as_ref() {
    conway::Certificate::StakeRegistration(cred) => Certificate::StakeRegistration {
      stake_credential: credential_to_napi(cred),
    },
    conway::Certificate::StakeDeregistration(cred) => Certificate::StakeDeregistration {
      stake_credential: credential_to_napi(cred),
    },
    conway::Certificate::StakeDelegation(cred, pool) => Certificate::StakeDelegation {
      stake_credential: credential_to_napi(cred),
      pool_keyhash: pool.to_string(),
    },
    conway::Certificate::PoolRegistration {
      operator,
      vrf_keyhash,
      pledge,
      cost,
      margin,
      reward_account,
      pool_owners,
      relays,
      pool_metadata,
    } => Certificate::PoolRegistration {
      pool_params: pool_params_to_napi(
        operator,
        vrf_keyhash,
        *pledge,
        *cost,
        margin,
        reward_account,
        pool_owners.as_ref(),
        relays,
        pool_metadata,
      ),
    },
    conway::Certificate::PoolRetirement(pool, epoch) => Certificate::PoolRetirement {
      pool_keyhash: pool.to_string(),
      epoch: *epoch as i64,
    },
    conway::Certificate::Reg(cred, coin) => Certificate::Reg {
      stake_credential: credential_to_napi(cred),
      coin: *coin as i64,
    },
    conway::Certificate::UnReg(cred, coin) => Certificate::UnReg {
      stake_credential: credential_to_napi(cred),
      coin: *coin as i64,
    },
    conway::Certificate::VoteDeleg(cred, drep) => Certificate::VoteDeleg {
      stake_credential: credential_to_napi(cred),
      drep: drep_to_napi(drep),
    },
    conway::Certificate::StakeVoteDeleg(cred, pool, drep) => Certificate::StakeVoteDeleg {
      stake_credential: credential_to_napi(cred),
      pool_keyhash: pool.to_string(),
      drep: drep_to_napi(drep),
    },
    conway::Certificate::StakeRegDeleg(cred, pool, coin) => Certificate::StakeRegDeleg {
      stake_credential: credential_to_napi(cred),
      pool_keyhash: pool.to_string(),
      coin: *coin as i64,
    },
    conway::Certificate::VoteRegDeleg(cred, drep, coin) => Certificate::VoteRegDeleg {
      stake_credential: credential_to_napi(cred),
      drep: drep_to_napi(drep),
      coin: *coin as i64,
    },
    conway::Certificate::StakeVoteRegDeleg(cred, pool, drep, coin) => {
      Certificate::StakeVoteRegDeleg {
        stake_credential: credential_to_napi(cred),
        pool_keyhash: pool.to_string(),
        drep: drep_to_napi(drep),
        coin: *coin as i64,
      }
    }
    conway::Certificate::AuthCommitteeHot(cold, hot) => Certificate::AuthCommitteeHot {
      committee_cold_credential: credential_to_napi(cold),
      committee_hot_credential: credential_to_napi(hot),
    },
    conway::Certificate::ResignCommitteeCold(cred, anchor) => Certificate::ResignCommitteeCold {
      committee_cold_credential: credential_to_napi(cred),
      anchor: anchor.as_ref().map(anchor_to_napi),
    },
    conway::Certificate::RegDRepCert(cred, coin, anchor) => Certificate::RegDRepCert {
      drep_credential: credential_to_napi(cred),
      coin: *coin as i64,
      anchor: anchor.as_ref().map(anchor_to_napi),
    },
    conway::Certificate::UnRegDRepCert(cred, coin) => Certificate::UnRegDRepCert {
      drep_credential: credential_to_napi(cred),
      coin: *coin as i64,
    },
    conway::Certificate::UpdateDRepCert(cred, anchor) => Certificate::UpdateDRepCert {
      drep_credential: credential_to_napi(cred),
      anchor: anchor.as_ref().map(anchor_to_napi),
    },
  }
}
