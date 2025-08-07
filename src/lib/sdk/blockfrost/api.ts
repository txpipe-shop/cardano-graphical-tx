/* tslint:disable */
/* eslint-disable */
/**
 * Blockfrost.io ~ API Documentation
 * Blockfrost is an API as a service that allows users to interact with the Cardano blockchain and parts of its ecosystem.  ## Tokens  After signing up on https://blockfrost.io, a `project_id` token is automatically generated for each project. HTTP header of your request MUST include this `project_id` in order to authenticate against Blockfrost servers.  ## Available networks  At the moment, you can use the following networks. Please, note that each network has its own `project_id`.  <table>   <tbody>     <tr>       <td>           <b>Network</b>       </td>       <td>           <b>Endpoint</b>       </td>     </tr>     <tr>         <td>Cardano mainnet</td>         <td>             <code>https://cardano-mainnet.blockfrost.io/api/v0</code>         </td>     </tr>     <tr>         <td>Cardano preprod</td>         <td>             <code>https://cardano-preprod.blockfrost.io/api/v0</code>         </td>     </tr>     <tr>         <td>Cardano preview</td>         <td>             <code>https://cardano-preview.blockfrost.io/api/v0</code>         </td>     </tr>     <tr>         <td>InterPlanetary File System</td>         <td>             <code>https://ipfs.blockfrost.io/api/v0</code>         </td>     </tr>     <tr>         <td>Milkomeda mainnet</td>         <td>             <code>https://milkomeda-mainnet.blockfrost.io/api/v0</code>         </td>     </tr>     <tr>         <td>Milkomeda testnet</td>         <td>             <code>https://milkomeda-testnet.blockfrost.io/api/v0</code>         </td>     </tr>   </tbody> </table>  ## Milkomeda  <p>   <span>     For more information about how to use Milkomeda as well as the list of available endpoints, see the <a href=\"https://blockfrost.dev/start-building/milkomeda\" target=\"_blank\">Milkomeda section</a>.   </span> </p>   ## Concepts  * All endpoints return either a JSON object or an array. * Data is returned in *ascending* (oldest first, newest last) order, if not stated otherwise.   * You might use the `?order=desc` query parameter to reverse this order. * By default, we return 100 results at a time. You have to use `?page=2` to list through the results. * All time and timestamp related fields (except `server_time`) are in seconds of UNIX time. * All amounts are returned in Lovelaces, where 1 ADA = 1 000 000 Lovelaces. * Addresses, accounts and pool IDs are in Bech32 format. * All values are case sensitive. * All hex encoded values are lower case. * Examples are not based on real data. Any resemblance to actual events is purely coincidental. * We allow to upload files up to 100MB of size to IPFS. This might increase in the future. * Only pinned IPFS files are counted towards the IPFS quota. * Non-pinned IPFS files are subject to regular garbage collection and will be removed unless pinned. * We allow maximum of 100 queued pins per IPFS user.  ## Errors  ### HTTP Status codes  The following are HTTP status code your application might receive when reaching Blockfrost endpoints and it should handle all of these cases.  * HTTP `400` return code is used when the request is not valid. * HTTP `402` return code is used when the projects exceed their daily request limit. * HTTP `403` return code is used when the request is not authenticated. * HTTP `404` return code is used when the resource doesn\'t exist. * HTTP `418` return code is used when the user has been auto-banned for flooding too much after previously receiving error code `402` or `429`. * HTTP `425` return code is used in Cardano networks, when the user has submitted a transaction when the mempool is already full, not accepting new txs straight away. * HTTP `425` return code is used in IPFS network, when the user has submitted a pin when the pin queue is already full, not accepting new pins straight away. * HTTP `429` return code is used when the user has sent too many requests in a given amount of time and therefore has been rate-limited. * HTTP `500` return code is used when our endpoints are having a problem.  ### Error codes  An internal error code number is used for better indication of the error in question. It is passed using the following payload.  ```json {   \"status_code\": 403,   \"error\": \"Forbidden\",   \"message\": \"Invalid project token.\" } ``` ## Limits  There are two types of limits we are enforcing:  The first depends on your plan and is the number of request we allow per day. We defined the day from midnight to midnight of UTC time.  The second is rate limiting. We limit an end user, distinguished by IP address, to 10 requests per second. On top of that, we allow each user to send burst of 500 requests, which cools off at rate of 10 requests per second. In essence, a user is allowed to make another whole burst after (currently) 500/10 = 50 seconds. E.g. if a user attempts to make a call 3 seconds after whole burst, 30 requests will be processed. We believe this should be sufficient for most of the use cases. If it is not and you have a specific use case, please get in touch with us, and we will make sure to take it into account as much as we can.  ## SDKs  We support a number of SDKs that will help you in developing your application on top of Blockfrost.  <table>   <tbody>     <tr>         <td><b>Programming language</b></td>         <td><b>SDK</b></td>     </tr>     <tr>         <td>JavaScript</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-js\">blockfrost-js</a>         </td>     </tr>     <tr>         <td>Haskell</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-haskell\">blockfrost-haskell</a>         </td>     </tr>     <tr>         <td>Python</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-python\">blockfrost-python</a>         </td>     </tr>     <tr>         <td>Rust</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-rust\">blockfrost-rust</a>         </td>     </tr>     <tr>         <td>Golang</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-go\">blockfrost-go</a>         </td>     </tr>     <tr>         <td>Ruby</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-ruby\">blockfrost-ruby</a>         </td>     </tr>     <tr>         <td>Java</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-java\">blockfrost-java</a>         </td>     </tr>     <tr>         <td>Scala</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-scala\">blockfrost-scala</a>         </td>     </tr>     <tr>         <td>Swift</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-swift\">blockfrost-swift</a>         </td>     </tr>     <tr>         <td>Kotlin</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-kotlin\">blockfrost-kotlin</a>         </td>     </tr>     <tr>         <td>Elixir</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-elixir\">blockfrost-elixir</a>         </td>     </tr>     <tr>         <td>.NET</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-dotnet\">blockfrost-dotnet</a>         </td>     </tr>     <tr>         <td>Arduino</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-arduino\">blockfrost-arduino</a>         </td>     </tr>     <tr>         <td>PHP</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-php\">blockfrost-php</a>         </td>     </tr>     <tr>         <td>Crystal</td>         <td>             <a href=\"https://github.com/blockfrost/blockfrost-crystal\">blockfrost-crystal</a>         </td>     </tr>   </tbody> </table>
 *
 * The version of the OpenAPI document: 0.1.79
 * Contact: contact@blockfrost.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction
} from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * The sum of all assets of all addresses associated with a given account
 * @export
 * @interface AccountAddressesAssetsInner
 */
export interface AccountAddressesAssetsInner {
  /**
   * The unit of the value
   * @type {string}
   * @memberof AccountAddressesAssetsInner
   */
  unit: string;
  /**
   * The quantity of the unit
   * @type {string}
   * @memberof AccountAddressesAssetsInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface AccountAddressesContentInner
 */
export interface AccountAddressesContentInner {
  /**
   * Address associated with the stake key
   * @type {string}
   * @memberof AccountAddressesContentInner
   */
  address: string;
}
/**
 *
 * @export
 * @interface AccountAddressesTotal
 */
export interface AccountAddressesTotal {
  /**
   * Bech32 encoded stake address
   * @type {string}
   * @memberof AccountAddressesTotal
   */
  stake_address: string;
  /**
   *
   * @type {Array<AccountAddressesTotalReceivedSumInner>}
   * @memberof AccountAddressesTotal
   */
  received_sum: Array<AccountAddressesTotalReceivedSumInner>;
  /**
   *
   * @type {Array<AccountAddressesTotalReceivedSumInner>}
   * @memberof AccountAddressesTotal
   */
  sent_sum: Array<AccountAddressesTotalReceivedSumInner>;
  /**
   * Count of all transactions for all addresses associated with the account
   * @type {number}
   * @memberof AccountAddressesTotal
   */
  tx_count: number;
}
/**
 * The sum of all the UTXO per asset for all addresses associated with the account
 * @export
 * @interface AccountAddressesTotalReceivedSumInner
 */
export interface AccountAddressesTotalReceivedSumInner {
  /**
   * The unit of the value
   * @type {string}
   * @memberof AccountAddressesTotalReceivedSumInner
   */
  unit: string;
  /**
   * The quantity of the unit
   * @type {string}
   * @memberof AccountAddressesTotalReceivedSumInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface AccountContent
 */
export interface AccountContent {
  /**
   * Bech32 stake address
   * @type {string}
   * @memberof AccountContent
   */
  stake_address: string;
  /**
   * Registration state of an account
   * @type {boolean}
   * @memberof AccountContent
   */
  active: boolean;
  /**
   * Epoch of the most recent action - registration or deregistration
   * @type {number}
   * @memberof AccountContent
   */
  active_epoch: number | null;
  /**
   * Balance of the account in Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  controlled_amount: string;
  /**
   * Sum of all rewards for the account in the Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  rewards_sum: string;
  /**
   * Sum of all the withdrawals for the account in Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  withdrawals_sum: string;
  /**
   * Sum of all  funds from reserves for the account in the Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  reserves_sum: string;
  /**
   * Sum of all funds from treasury for the account in the Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  treasury_sum: string;
  /**
   * Sum of available rewards that haven\'t been withdrawn yet for the account in the Lovelaces
   * @type {string}
   * @memberof AccountContent
   */
  withdrawable_amount: string;
  /**
   * Bech32 pool ID to which this account is delegated
   * @type {string}
   * @memberof AccountContent
   */
  pool_id: string | null;
  /**
   * Bech32 drep ID to which this account is delegated
   * @type {string}
   * @memberof AccountContent
   */
  drep_id: string | null;
}
/**
 *
 * @export
 * @interface AccountDelegationContentInner
 */
export interface AccountDelegationContentInner {
  /**
   * Epoch in which the delegation becomes active
   * @type {number}
   * @memberof AccountDelegationContentInner
   */
  active_epoch: number;
  /**
   * Hash of the transaction containing the delegation
   * @type {string}
   * @memberof AccountDelegationContentInner
   */
  tx_hash: string;
  /**
   * Rewards for given epoch in Lovelaces
   * @type {string}
   * @memberof AccountDelegationContentInner
   */
  amount: string;
  /**
   * Bech32 ID of pool being delegated to
   * @type {string}
   * @memberof AccountDelegationContentInner
   */
  pool_id: string;
}
/**
 *
 * @export
 * @interface AccountHistoryContentInner
 */
export interface AccountHistoryContentInner {
  /**
   * Epoch in which the stake was active
   * @type {number}
   * @memberof AccountHistoryContentInner
   */
  active_epoch: number;
  /**
   * Stake amount in Lovelaces
   * @type {string}
   * @memberof AccountHistoryContentInner
   */
  amount: string;
  /**
   * Bech32 ID of pool being delegated to
   * @type {string}
   * @memberof AccountHistoryContentInner
   */
  pool_id: string;
}
/**
 *
 * @export
 * @interface AccountMirContentInner
 */
export interface AccountMirContentInner {
  /**
   * Hash of the transaction containing the MIR
   * @type {string}
   * @memberof AccountMirContentInner
   */
  tx_hash: string;
  /**
   * MIR amount in Lovelaces
   * @type {string}
   * @memberof AccountMirContentInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface AccountRegistrationContentInner
 */
export interface AccountRegistrationContentInner {
  /**
   * Hash of the transaction containing the (de)registration certificate
   * @type {string}
   * @memberof AccountRegistrationContentInner
   */
  tx_hash: string;
  /**
   * Action in the certificate
   * @type {string}
   * @memberof AccountRegistrationContentInner
   */
  action: AccountRegistrationContentInnerActionEnum;
}

export const AccountRegistrationContentInnerActionEnum = {
  Registered: 'registered',
  Deregistered: 'deregistered'
} as const;

export type AccountRegistrationContentInnerActionEnum =
  (typeof AccountRegistrationContentInnerActionEnum)[keyof typeof AccountRegistrationContentInnerActionEnum];

/**
 *
 * @export
 * @interface AccountRewardContentInner
 */
export interface AccountRewardContentInner {
  /**
   * Epoch of the associated reward
   * @type {number}
   * @memberof AccountRewardContentInner
   */
  epoch: number;
  /**
   * Rewards for given epoch in Lovelaces
   * @type {string}
   * @memberof AccountRewardContentInner
   */
  amount: string;
  /**
   * Bech32 pool ID being delegated to
   * @type {string}
   * @memberof AccountRewardContentInner
   */
  pool_id: string;
  /**
   * Type of the reward
   * @type {string}
   * @memberof AccountRewardContentInner
   */
  type: AccountRewardContentInnerTypeEnum;
}

export const AccountRewardContentInnerTypeEnum = {
  Leader: 'leader',
  Member: 'member',
  PoolDepositRefund: 'pool_deposit_refund'
} as const;

export type AccountRewardContentInnerTypeEnum =
  (typeof AccountRewardContentInnerTypeEnum)[keyof typeof AccountRewardContentInnerTypeEnum];

/**
 *
 * @export
 * @interface AccountUtxoContentInner
 */
export interface AccountUtxoContentInner {
  /**
   * Bech32 encoded addresses
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  address: string;
  /**
   * Transaction hash of the UTXO
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  tx_hash: string;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof AccountUtxoContentInner
   * @deprecated
   */
  tx_index: number;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof AccountUtxoContentInner
   */
  output_index: number;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof AccountUtxoContentInner
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * Block hash of the UTXO
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  block: string;
  /**
   * The hash of the transaction output datum
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  data_hash: string | null;
  /**
   * CBOR encoded inline datum
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  inline_datum: string | null;
  /**
   * The hash of the reference script of the output
   * @type {string}
   * @memberof AccountUtxoContentInner
   */
  reference_script_hash: string | null;
}
/**
 *
 * @export
 * @interface AccountWithdrawalContentInner
 */
export interface AccountWithdrawalContentInner {
  /**
   * Hash of the transaction containing the withdrawal
   * @type {string}
   * @memberof AccountWithdrawalContentInner
   */
  tx_hash: string;
  /**
   * Withdrawal amount in Lovelaces
   * @type {string}
   * @memberof AccountWithdrawalContentInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface AddressContent
 */
export interface AddressContent {
  /**
   * Bech32 encoded addresses
   * @type {string}
   * @memberof AddressContent
   */
  address: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof AddressContent
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * Stake address that controls the key
   * @type {string}
   * @memberof AddressContent
   */
  stake_address: string | null;
  /**
   * Address era
   * @type {string}
   * @memberof AddressContent
   */
  type: AddressContentTypeEnum;
  /**
   * True if this is a script address
   * @type {boolean}
   * @memberof AddressContent
   */
  script: boolean;
}

export const AddressContentTypeEnum = {
  Byron: 'byron',
  Shelley: 'shelley'
} as const;

export type AddressContentTypeEnum =
  (typeof AddressContentTypeEnum)[keyof typeof AddressContentTypeEnum];

/**
 *
 * @export
 * @interface AddressContentExtended
 */
export interface AddressContentExtended {
  /**
   * Bech32 encoded addresses
   * @type {string}
   * @memberof AddressContentExtended
   */
  address: string;
  /**
   *
   * @type {Array<AddressContentExtendedAmountInner>}
   * @memberof AddressContentExtended
   */
  amount: Array<AddressContentExtendedAmountInner>;
  /**
   * Stake address that controls the key
   * @type {string}
   * @memberof AddressContentExtended
   */
  stake_address: string | null;
  /**
   * Address era
   * @type {string}
   * @memberof AddressContentExtended
   */
  type: AddressContentExtendedTypeEnum;
  /**
   * True if this is a script address
   * @type {boolean}
   * @memberof AddressContentExtended
   */
  script: boolean;
}

export const AddressContentExtendedTypeEnum = {
  Byron: 'byron',
  Shelley: 'shelley'
} as const;

export type AddressContentExtendedTypeEnum =
  (typeof AddressContentExtendedTypeEnum)[keyof typeof AddressContentExtendedTypeEnum];

/**
 * The sum of all the UTXO per asset
 * @export
 * @interface AddressContentExtendedAmountInner
 */
export interface AddressContentExtendedAmountInner {
  /**
   * The unit of the value
   * @type {string}
   * @memberof AddressContentExtendedAmountInner
   */
  unit: string;
  /**
   * The quantity of the unit
   * @type {string}
   * @memberof AddressContentExtendedAmountInner
   */
  quantity: string;
  /**
   * Number of decimal places of the asset unit. Primary data source is CIP68 reference NFT with a fallback to off-chain metadata.
   * @type {number}
   * @memberof AddressContentExtendedAmountInner
   */
  decimals: number | null;
  /**
   * True if the latest minting transaction includes metadata (best-effort)
   * @type {boolean}
   * @memberof AddressContentExtendedAmountInner
   */
  has_nft_onchain_metadata: boolean;
}
/**
 *
 * @export
 * @interface AddressContentTotal
 */
export interface AddressContentTotal {
  /**
   * Bech32 encoded address
   * @type {string}
   * @memberof AddressContentTotal
   */
  address: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof AddressContentTotal
   */
  received_sum: Array<TxContentOutputAmountInner>;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof AddressContentTotal
   */
  sent_sum: Array<TxContentOutputAmountInner>;
  /**
   * Count of all transactions on the address
   * @type {number}
   * @memberof AddressContentTotal
   */
  tx_count: number;
}
/**
 *
 * @export
 * @interface AddressTransactionsContentInner
 */
export interface AddressTransactionsContentInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof AddressTransactionsContentInner
   */
  tx_hash: string;
  /**
   * Transaction index within the block
   * @type {number}
   * @memberof AddressTransactionsContentInner
   */
  tx_index: number;
  /**
   * Block height
   * @type {number}
   * @memberof AddressTransactionsContentInner
   */
  block_height: number;
  /**
   * Block creation time in UNIX time
   * @type {number}
   * @memberof AddressTransactionsContentInner
   */
  block_time: number;
}
/**
 *
 * @export
 * @interface AddressUtxoContentInner
 */
export interface AddressUtxoContentInner {
  /**
   * Bech32 encoded addresses - useful when querying by payment_cred
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  address: string;
  /**
   * Transaction hash of the UTXO
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  tx_hash: string;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof AddressUtxoContentInner
   * @deprecated
   */
  tx_index: number;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof AddressUtxoContentInner
   */
  output_index: number;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof AddressUtxoContentInner
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * Block hash of the UTXO
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  block: string;
  /**
   * The hash of the transaction output datum
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  data_hash: string | null;
  /**
   * CBOR encoded inline datum
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  inline_datum: string | null;
  /**
   * The hash of the reference script of the output
   * @type {string}
   * @memberof AddressUtxoContentInner
   */
  reference_script_hash: string | null;
}
/**
 *
 * @export
 * @interface Asset
 */
export interface Asset {
  /**
   * Hex-encoded asset full name
   * @type {string}
   * @memberof Asset
   */
  asset: string;
  /**
   * Policy ID of the asset
   * @type {string}
   * @memberof Asset
   */
  policy_id: string;
  /**
   * Hex-encoded asset name of the asset
   * @type {string}
   * @memberof Asset
   */
  asset_name: string | null;
  /**
   * CIP14 based user-facing fingerprint
   * @type {string}
   * @memberof Asset
   */
  fingerprint: string;
  /**
   * Current asset quantity
   * @type {string}
   * @memberof Asset
   */
  quantity: string;
  /**
   * ID of the initial minting transaction
   * @type {string}
   * @memberof Asset
   */
  initial_mint_tx_hash: string;
  /**
   * Count of mint and burn transactions
   * @type {number}
   * @memberof Asset
   */
  mint_or_burn_count: number;
  /**
   * On-chain metadata which SHOULD adhere to the valid standards, based on which we perform the look up and display the asset (best effort)
   * @type {{ [key: string]: any; }}
   * @memberof Asset
   */
  onchain_metadata: { [key: string]: any } | null;
  /**
   * If on-chain metadata passes validation, we display the standard under which it is valid
   * @type {string}
   * @memberof Asset
   */
  onchain_metadata_standard?: AssetOnchainMetadataStandardEnum | null;
  /**
   * Arbitrary plutus data (CIP68).
   * @type {string}
   * @memberof Asset
   */
  onchain_metadata_extra?: string | null;
  /**
   *
   * @type {AssetMetadata}
   * @memberof Asset
   */
  metadata: AssetMetadata | null;
}

export const AssetOnchainMetadataStandardEnum = {
  Cip25v1: 'CIP25v1',
  Cip25v2: 'CIP25v2',
  Cip68v1: 'CIP68v1',
  Cip68v2: 'CIP68v2',
  Cip68v3: 'CIP68v3'
} as const;

export type AssetOnchainMetadataStandardEnum =
  (typeof AssetOnchainMetadataStandardEnum)[keyof typeof AssetOnchainMetadataStandardEnum];

/**
 *
 * @export
 * @interface AssetAddressesInner
 */
export interface AssetAddressesInner {
  /**
   * Address containing the specific asset
   * @type {string}
   * @memberof AssetAddressesInner
   */
  address: string;
  /**
   * Asset quantity on the specific address
   * @type {string}
   * @memberof AssetAddressesInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface AssetHistoryInner
 */
export interface AssetHistoryInner {
  /**
   * Hash of the transaction containing the asset action
   * @type {string}
   * @memberof AssetHistoryInner
   */
  tx_hash: string;
  /**
   * Action executed upon the asset policy
   * @type {string}
   * @memberof AssetHistoryInner
   */
  action: AssetHistoryInnerActionEnum;
  /**
   * Asset amount of the specific action
   * @type {string}
   * @memberof AssetHistoryInner
   */
  amount: string;
}

export const AssetHistoryInnerActionEnum = {
  Minted: 'minted',
  Burned: 'burned'
} as const;

export type AssetHistoryInnerActionEnum =
  (typeof AssetHistoryInnerActionEnum)[keyof typeof AssetHistoryInnerActionEnum];

/**
 * Off-chain metadata fetched from GitHub based on network. Mainnet: https://github.com/cardano-foundation/cardano-token-registry/ Testnet: https://github.com/input-output-hk/metadata-registry-testnet/
 * @export
 * @interface AssetMetadata
 */
export interface AssetMetadata {
  /**
   * Asset name
   * @type {string}
   * @memberof AssetMetadata
   */
  name: string;
  /**
   * Asset description
   * @type {string}
   * @memberof AssetMetadata
   */
  description: string;
  /**
   *
   * @type {string}
   * @memberof AssetMetadata
   */
  ticker: string | null;
  /**
   * Asset website
   * @type {string}
   * @memberof AssetMetadata
   */
  url: string | null;
  /**
   * Base64 encoded logo of the asset
   * @type {string}
   * @memberof AssetMetadata
   */
  logo: string | null;
  /**
   * Number of decimal places of the asset unit
   * @type {number}
   * @memberof AssetMetadata
   */
  decimals: number | null;
}
/**
 * On-chain metadata stored in the minting transaction under label 721, which adheres to https://cips.cardano.org/cips/cip25/
 * @export
 * @interface AssetOnchainMetadataCip25
 */
export interface AssetOnchainMetadataCip25 {
  [key: string]: any;

  /**
   * Name of the asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip25
   */
  name: string;
  /**
   *
   * @type {AssetOnchainMetadataCip25Image}
   * @memberof AssetOnchainMetadataCip25
   */
  image: AssetOnchainMetadataCip25Image;
  /**
   *
   * @type {AssetOnchainMetadataCip25Description}
   * @memberof AssetOnchainMetadataCip25
   */
  description?: AssetOnchainMetadataCip25Description;
  /**
   * Mime sub-type of image
   * @type {string}
   * @memberof AssetOnchainMetadataCip25
   */
  mediaType?: string;
  /**
   *
   * @type {Array<AssetOnchainMetadataCip25FilesInner>}
   * @memberof AssetOnchainMetadataCip25
   */
  files?: Array<AssetOnchainMetadataCip25FilesInner>;
}
/**
 * @type AssetOnchainMetadataCip25Description
 * Additional description
 * @export
 */
export type AssetOnchainMetadataCip25Description = Array<string> | string;

/**
 *
 * @export
 * @interface AssetOnchainMetadataCip25FilesInner
 */
export interface AssetOnchainMetadataCip25FilesInner {
  [key: string]: any;

  /**
   * Name of the file
   * @type {string}
   * @memberof AssetOnchainMetadataCip25FilesInner
   */
  name?: string;
  /**
   * Mime sub-type of image
   * @type {string}
   * @memberof AssetOnchainMetadataCip25FilesInner
   */
  mediaType: string;
  /**
   *
   * @type {AssetOnchainMetadataCip25FilesInnerSrc}
   * @memberof AssetOnchainMetadataCip25FilesInner
   */
  src: AssetOnchainMetadataCip25FilesInnerSrc;
}
/**
 * @type AssetOnchainMetadataCip25FilesInnerSrc
 * URI pointing to a resource of this mime type
 * @export
 */
export type AssetOnchainMetadataCip25FilesInnerSrc = Array<string> | string;

/**
 * @type AssetOnchainMetadataCip25Image
 * URI(s) of the associated asset
 * @export
 */
export type AssetOnchainMetadataCip25Image = Array<string> | string;

/**
 * On-chain metadata stored in the datum of the reference NFT output which adheres to 333 FT Standard https://cips.cardano.org/cips/cip68/
 * @export
 * @interface AssetOnchainMetadataCip68Ft333
 */
export interface AssetOnchainMetadataCip68Ft333 {
  [key: string]: any;

  /**
   * Name of the asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Ft333
   */
  name: string;
  /**
   * Additional description
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Ft333
   */
  description: string;
  /**
   * URI(s) of the associated asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Ft333
   */
  logo?: string;
  /**
   * Ticker
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Ft333
   */
  ticker?: string;
  /**
   * Number of decimals
   * @type {number}
   * @memberof AssetOnchainMetadataCip68Ft333
   */
  decimals?: number;
}
/**
 * On-chain metadata stored in the datum of the reference NFT output which adheres to 222 NFT Standard https://cips.cardano.org/cips/cip68/
 * @export
 * @interface AssetOnchainMetadataCip68Nft222
 */
export interface AssetOnchainMetadataCip68Nft222 {
  [key: string]: any;

  /**
   * Name of the asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Nft222
   */
  name: string;
  /**
   * URI(s) of the associated asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Nft222
   */
  image: string;
  /**
   * Additional description
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Nft222
   */
  description?: string;
  /**
   * Mime sub-type of image
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Nft222
   */
  mediaType?: string;
  /**
   *
   * @type {Array<AssetOnchainMetadataCip25FilesInner>}
   * @memberof AssetOnchainMetadataCip68Nft222
   */
  files?: Array<AssetOnchainMetadataCip25FilesInner>;
}
/**
 * On-chain metadata stored in the datum of the reference NFT output which adheres to 222 NFT Standard https://cips.cardano.org/cips/cip68/
 * @export
 * @interface AssetOnchainMetadataCip68Rft444
 */
export interface AssetOnchainMetadataCip68Rft444 {
  [key: string]: any;

  /**
   * Name of the asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  name: string;
  /**
   * URI(s) of the associated asset
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  image: string;
  /**
   * Additional description
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  description?: string;
  /**
   * Mime sub-type of image
   * @type {string}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  mediaType?: string;
  /**
   * Number of decimals
   * @type {number}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  decimals?: number;
  /**
   *
   * @type {Array<AssetOnchainMetadataCip25FilesInner>}
   * @memberof AssetOnchainMetadataCip68Rft444
   */
  files?: Array<AssetOnchainMetadataCip25FilesInner>;
}
/**
 *
 * @export
 * @interface AssetPolicyInner
 */
export interface AssetPolicyInner {
  /**
   * Concatenation of the policy_id and hex-encoded asset_name
   * @type {string}
   * @memberof AssetPolicyInner
   */
  asset: string;
  /**
   * Current asset quantity
   * @type {string}
   * @memberof AssetPolicyInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface AssetTransactionsInner
 */
export interface AssetTransactionsInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof AssetTransactionsInner
   */
  tx_hash: string;
  /**
   * Transaction index within the block
   * @type {number}
   * @memberof AssetTransactionsInner
   */
  tx_index: number;
  /**
   * Block height
   * @type {number}
   * @memberof AssetTransactionsInner
   */
  block_height: number;
  /**
   * Block creation time in UNIX time
   * @type {number}
   * @memberof AssetTransactionsInner
   */
  block_time: number;
}
/**
 *
 * @export
 * @interface AssetsInner
 */
export interface AssetsInner {
  /**
   * Asset identifier
   * @type {string}
   * @memberof AssetsInner
   */
  asset: string;
  /**
   * Current asset quantity
   * @type {string}
   * @memberof AssetsInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface BlockContent
 */
export interface BlockContent {
  /**
   * Block creation time in UNIX time
   * @type {number}
   * @memberof BlockContent
   */
  time: number;
  /**
   * Block number
   * @type {number}
   * @memberof BlockContent
   */
  height: number | null;
  /**
   * Hash of the block
   * @type {string}
   * @memberof BlockContent
   */
  hash: string;
  /**
   * Slot number
   * @type {number}
   * @memberof BlockContent
   */
  slot: number | null;
  /**
   * Epoch number
   * @type {number}
   * @memberof BlockContent
   */
  epoch: number | null;
  /**
   * Slot within the epoch
   * @type {number}
   * @memberof BlockContent
   */
  epoch_slot: number | null;
  /**
   * Bech32 ID of the slot leader or specific block description in case there is no slot leader
   * @type {string}
   * @memberof BlockContent
   */
  slot_leader: string;
  /**
   * Block size in Bytes
   * @type {number}
   * @memberof BlockContent
   */
  size: number;
  /**
   * Number of transactions in the block
   * @type {number}
   * @memberof BlockContent
   */
  tx_count: number;
  /**
   * Total output within the block in Lovelaces
   * @type {string}
   * @memberof BlockContent
   */
  output: string | null;
  /**
   * Total fees within the block in Lovelaces
   * @type {string}
   * @memberof BlockContent
   */
  fees: string | null;
  /**
   * VRF key of the block
   * @type {string}
   * @memberof BlockContent
   */
  block_vrf: string | null;
  /**
   * The hash of the operational certificate of the block producer
   * @type {string}
   * @memberof BlockContent
   */
  op_cert: string | null;
  /**
   * The value of the counter used to produce the operational certificate
   * @type {string}
   * @memberof BlockContent
   */
  op_cert_counter: string | null;
  /**
   * Hash of the previous block
   * @type {string}
   * @memberof BlockContent
   */
  previous_block: string | null;
  /**
   * Hash of the next block
   * @type {string}
   * @memberof BlockContent
   */
  next_block: string | null;
  /**
   * Number of block confirmations
   * @type {number}
   * @memberof BlockContent
   */
  confirmations: number;
}
/**
 *
 * @export
 * @interface BlockContentAddressesInner
 */
export interface BlockContentAddressesInner {
  /**
   * Address that was affected in the specified block
   * @type {string}
   * @memberof BlockContentAddressesInner
   */
  address: string;
  /**
   * List of transactions containing the address either in their inputs or outputs. Sorted by transaction index within a block, ascending.
   * @type {Array<BlockContentAddressesInnerTransactionsInner>}
   * @memberof BlockContentAddressesInner
   */
  transactions: Array<BlockContentAddressesInnerTransactionsInner>;
}
/**
 *
 * @export
 * @interface BlockContentAddressesInnerTransactionsInner
 */
export interface BlockContentAddressesInnerTransactionsInner {
  /**
   *
   * @type {string}
   * @memberof BlockContentAddressesInnerTransactionsInner
   */
  tx_hash: string;
}
/**
 *
 * @export
 * @interface BlockContentTxsCborInner
 */
export interface BlockContentTxsCborInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof BlockContentTxsCborInner
   */
  tx_hash: string;
  /**
   * CBOR representation of the transaction data
   * @type {string}
   * @memberof BlockContentTxsCborInner
   */
  cbor: string;
}
/**
 *
 * @export
 * @interface Drep
 */
export interface Drep {
  /**
   * Bech32 encoded DRep address
   * @type {string}
   * @memberof Drep
   */
  drep_id: string;
  /**
   * The raw bytes of the DRep
   * @type {string}
   * @memberof Drep
   */
  hex: string;
  /**
   * The total amount of voting power this DRep is delegated.
   * @type {string}
   * @memberof Drep
   */
  amount: string;
  /**
   * Registration state of the DRep
   * @type {boolean}
   * @memberof Drep
   * @deprecated
   */
  active: boolean;
  /**
   * Epoch of the most recent registration
   * @type {number}
   * @memberof Drep
   * @deprecated
   */
  active_epoch: number | null;
  /**
   * Flag which shows if this DRep credentials are a script hash
   * @type {boolean}
   * @memberof Drep
   */
  has_script: boolean;
  /**
   * Registration state of the DRep. Set to `true` if the DRep has been deregistered; otherwise, `false`.
   * @type {boolean}
   * @memberof Drep
   */
  retired: boolean;
  /**
   * Whether the DRep has been inactive for a consecutive number of epochs (determined by a epoch parameter `drep_activity`)
   * @type {boolean}
   * @memberof Drep
   */
  expired: boolean;
  /**
   * Epoch of the most recent action - registration, update, deregistration or voting
   * @type {number}
   * @memberof Drep
   */
  last_active_epoch: number | null;
}
/**
 *
 * @export
 * @interface DrepDelegatorsInner
 */
export interface DrepDelegatorsInner {
  /**
   * Bech32 encoded stake addresses
   * @type {string}
   * @memberof DrepDelegatorsInner
   */
  address: string;
  /**
   * Currently delegated amount
   * @type {string}
   * @memberof DrepDelegatorsInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface DrepMetadata
 */
export interface DrepMetadata {
  /**
   * Bech32 encoded addresses
   * @type {string}
   * @memberof DrepMetadata
   */
  drep_id: string;
  /**
   * The raw bytes of the DRep
   * @type {string}
   * @memberof DrepMetadata
   */
  hex: string;
  /**
   * URL to the drep metadata
   * @type {string}
   * @memberof DrepMetadata
   */
  url: string;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof DrepMetadata
   */
  hash: string;
  /**
   * Content of the JSON metadata (validated CIP-119)
   * @type {any}
   * @memberof DrepMetadata
   */
  json_metadata: any | null;
  /**
   * Content of the metadata (raw)
   * @type {string}
   * @memberof DrepMetadata
   */
  bytes: string;
}
/**
 *
 * @export
 * @interface DrepUpdatesInner
 */
export interface DrepUpdatesInner {
  /**
   * Transaction ID
   * @type {string}
   * @memberof DrepUpdatesInner
   */
  tx_hash: string;
  /**
   * Index of the certificate within the update transaction.
   * @type {number}
   * @memberof DrepUpdatesInner
   */
  cert_index: number;
  /**
   * Action in the certificate
   * @type {string}
   * @memberof DrepUpdatesInner
   */
  action: DrepUpdatesInnerActionEnum;
}

export const DrepUpdatesInnerActionEnum = {
  Registered: 'registered',
  Deregistered: 'deregistered',
  Updated: 'updated'
} as const;

export type DrepUpdatesInnerActionEnum =
  (typeof DrepUpdatesInnerActionEnum)[keyof typeof DrepUpdatesInnerActionEnum];

/**
 *
 * @export
 * @interface DrepVotesInner
 */
export interface DrepVotesInner {
  /**
   * Hash of the proposal transaction.
   * @type {string}
   * @memberof DrepVotesInner
   */
  tx_hash: string;
  /**
   * Index of the certificate within the proposal transaction.
   * @type {number}
   * @memberof DrepVotesInner
   */
  cert_index: number;
  /**
   * The Vote. Can be one of yes, no, abstain.
   * @type {string}
   * @memberof DrepVotesInner
   */
  vote: DrepVotesInnerVoteEnum;
}

export const DrepVotesInnerVoteEnum = {
  Yes: 'yes',
  No: 'no',
  Abstain: 'abstain'
} as const;

export type DrepVotesInnerVoteEnum =
  (typeof DrepVotesInnerVoteEnum)[keyof typeof DrepVotesInnerVoteEnum];

/**
 *
 * @export
 * @interface DrepsInner
 */
export interface DrepsInner {
  /**
   * The Bech32 encoded DRep address
   * @type {string}
   * @memberof DrepsInner
   */
  drep_id: string;
  /**
   * The raw bytes of the DRep
   * @type {string}
   * @memberof DrepsInner
   */
  hex: string;
}
/**
 *
 * @export
 * @interface EpochContent
 */
export interface EpochContent {
  /**
   * Epoch number
   * @type {number}
   * @memberof EpochContent
   */
  epoch: number;
  /**
   * Unix time of the start of the epoch
   * @type {number}
   * @memberof EpochContent
   */
  start_time: number;
  /**
   * Unix time of the end of the epoch
   * @type {number}
   * @memberof EpochContent
   */
  end_time: number;
  /**
   * Unix time of the first block of the epoch
   * @type {number}
   * @memberof EpochContent
   */
  first_block_time: number;
  /**
   * Unix time of the last block of the epoch
   * @type {number}
   * @memberof EpochContent
   */
  last_block_time: number;
  /**
   * Number of blocks within the epoch
   * @type {number}
   * @memberof EpochContent
   */
  block_count: number;
  /**
   * Number of transactions within the epoch
   * @type {number}
   * @memberof EpochContent
   */
  tx_count: number;
  /**
   * Sum of all the transactions within the epoch in Lovelaces
   * @type {string}
   * @memberof EpochContent
   */
  output: string;
  /**
   * Sum of all the fees within the epoch in Lovelaces
   * @type {string}
   * @memberof EpochContent
   */
  fees: string;
  /**
   * Sum of all the active stakes within the epoch in Lovelaces
   * @type {string}
   * @memberof EpochContent
   */
  active_stake: string | null;
}
/**
 *
 * @export
 * @interface EpochParamContent
 */
export interface EpochParamContent {
  /**
   * Epoch number
   * @type {number}
   * @memberof EpochParamContent
   */
  epoch: number;
  /**
   * The linear factor for the minimum fee calculation for given epoch
   * @type {number}
   * @memberof EpochParamContent
   */
  min_fee_a: number;
  /**
   * The constant factor for the minimum fee calculation
   * @type {number}
   * @memberof EpochParamContent
   */
  min_fee_b: number;
  /**
   * Maximum block body size in Bytes
   * @type {number}
   * @memberof EpochParamContent
   */
  max_block_size: number;
  /**
   * Maximum transaction size
   * @type {number}
   * @memberof EpochParamContent
   */
  max_tx_size: number;
  /**
   * Maximum block header size
   * @type {number}
   * @memberof EpochParamContent
   */
  max_block_header_size: number;
  /**
   * The amount of a key registration deposit in Lovelaces
   * @type {string}
   * @memberof EpochParamContent
   */
  key_deposit: string;
  /**
   * The amount of a pool registration deposit in Lovelaces
   * @type {string}
   * @memberof EpochParamContent
   */
  pool_deposit: string;
  /**
   * Epoch bound on pool retirement
   * @type {number}
   * @memberof EpochParamContent
   */
  e_max: number;
  /**
   * Desired number of pools
   * @type {number}
   * @memberof EpochParamContent
   */
  n_opt: number;
  /**
   * Pool pledge influence
   * @type {number}
   * @memberof EpochParamContent
   */
  a0: number;
  /**
   * Monetary expansion
   * @type {number}
   * @memberof EpochParamContent
   */
  rho: number;
  /**
   * Treasury expansion
   * @type {number}
   * @memberof EpochParamContent
   */
  tau: number;
  /**
   * Percentage of blocks produced by federated nodes
   * @type {number}
   * @memberof EpochParamContent
   */
  decentralisation_param: number;
  /**
   * Seed for extra entropy
   * @type {string}
   * @memberof EpochParamContent
   */
  extra_entropy: string | null;
  /**
   * Accepted protocol major version
   * @type {number}
   * @memberof EpochParamContent
   */
  protocol_major_ver: number;
  /**
   * Accepted protocol minor version
   * @type {number}
   * @memberof EpochParamContent
   */
  protocol_minor_ver: number;
  /**
   * Minimum UTXO value. Use `coins_per_utxo_size` for Alonzo and later eras
   * @type {string}
   * @memberof EpochParamContent
   * @deprecated
   */
  min_utxo: string;
  /**
   * Minimum stake cost forced on the pool
   * @type {string}
   * @memberof EpochParamContent
   */
  min_pool_cost: string;
  /**
   * Epoch number only used once
   * @type {string}
   * @memberof EpochParamContent
   */
  nonce: string;
  /**
   * Cost models parameters for Plutus Core scripts
   * @type {{ [key: string]: any; }}
   * @memberof EpochParamContent
   */
  cost_models: { [key: string]: any } | null;
  /**
   * Cost models parameters for Plutus Core scripts in raw list form
   * @type {{ [key: string]: any; }}
   * @memberof EpochParamContent
   */
  cost_models_raw?: { [key: string]: any } | null;
  /**
   * The per word cost of script memory usage
   * @type {number}
   * @memberof EpochParamContent
   */
  price_mem: number | null;
  /**
   * The cost of script execution step usage
   * @type {number}
   * @memberof EpochParamContent
   */
  price_step: number | null;
  /**
   * The maximum number of execution memory allowed to be used in a single transaction
   * @type {string}
   * @memberof EpochParamContent
   */
  max_tx_ex_mem: string | null;
  /**
   * The maximum number of execution steps allowed to be used in a single transaction
   * @type {string}
   * @memberof EpochParamContent
   */
  max_tx_ex_steps: string | null;
  /**
   * The maximum number of execution memory allowed to be used in a single block
   * @type {string}
   * @memberof EpochParamContent
   */
  max_block_ex_mem: string | null;
  /**
   * The maximum number of execution steps allowed to be used in a single block
   * @type {string}
   * @memberof EpochParamContent
   */
  max_block_ex_steps: string | null;
  /**
   * The maximum Val size
   * @type {string}
   * @memberof EpochParamContent
   */
  max_val_size: string | null;
  /**
   * The percentage of the transactions fee which must be provided as collateral when including non-native scripts
   * @type {number}
   * @memberof EpochParamContent
   */
  collateral_percent: number | null;
  /**
   * The maximum number of collateral inputs allowed in a transaction
   * @type {number}
   * @memberof EpochParamContent
   */
  max_collateral_inputs: number | null;
  /**
   * Cost per UTxO word for Alonzo. Cost per UTxO byte for Babbage and later.
   * @type {string}
   * @memberof EpochParamContent
   */
  coins_per_utxo_size: string | null;
  /**
   * Cost per UTxO word for Alonzo. Cost per UTxO byte for Babbage and later.
   * @type {string}
   * @memberof EpochParamContent
   * @deprecated
   */
  coins_per_utxo_word: string | null;
  /**
   * Pool Voting threshold for motion of no-confidence.
   * @type {number}
   * @memberof EpochParamContent
   */
  pvt_motion_no_confidence: number | null;
  /**
   * Pool Voting threshold for new committee/threshold (normal state).
   * @type {number}
   * @memberof EpochParamContent
   */
  pvt_committee_normal: number | null;
  /**
   * Pool Voting threshold for new committee/threshold (state of no-confidence).
   * @type {number}
   * @memberof EpochParamContent
   */
  pvt_committee_no_confidence: number | null;
  /**
   * Pool Voting threshold for hard-fork initiation.
   * @type {number}
   * @memberof EpochParamContent
   */
  pvt_hard_fork_initiation: number | null;
  /**
   * DRep Vote threshold for motion of no-confidence.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_motion_no_confidence: number | null;
  /**
   * DRep Vote threshold for new committee/threshold (normal state).
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_committee_normal: number | null;
  /**
   * DRep Vote threshold for new committee/threshold (state of no-confidence).
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_committee_no_confidence: number | null;
  /**
   * DRep Vote threshold for update to the Constitution.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_update_to_constitution: number | null;
  /**
   * DRep Vote threshold for hard-fork initiation.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_hard_fork_initiation: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, network group.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_p_p_network_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, economic group.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_p_p_economic_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, technical group.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_p_p_technical_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, governance group.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_p_p_gov_group: number | null;
  /**
   * DRep Vote threshold for treasury withdrawal.
   * @type {number}
   * @memberof EpochParamContent
   */
  dvt_treasury_withdrawal: number | null;
  /**
   * Minimal constitutional committee size.
   * @type {string}
   * @memberof EpochParamContent
   */
  committee_min_size: string | null;
  /**
   * Constitutional committee term limits.
   * @type {string}
   * @memberof EpochParamContent
   */
  committee_max_term_length: string | null;
  /**
   * Governance action expiration.
   * @type {string}
   * @memberof EpochParamContent
   */
  gov_action_lifetime: string | null;
  /**
   * Governance action deposit.
   * @type {string}
   * @memberof EpochParamContent
   */
  gov_action_deposit: string | null;
  /**
   * DRep deposit amount.
   * @type {string}
   * @memberof EpochParamContent
   */
  drep_deposit: string | null;
  /**
   * DRep activity period.
   * @type {string}
   * @memberof EpochParamContent
   */
  drep_activity: string | null;
  /**
   * Pool Voting threshold for security-relevant protocol parameters changes. Renamed to pvt_p_p_security_group.
   * @type {number}
   * @memberof EpochParamContent
   * @deprecated
   */
  pvtpp_security_group: number | null;
  /**
   * Pool Voting threshold for security-relevant protocol parameters changes.
   * @type {number}
   * @memberof EpochParamContent
   */
  pvt_p_p_security_group: number | null;
  /**
   *
   * @type {number}
   * @memberof EpochParamContent
   */
  min_fee_ref_script_cost_per_byte: number | null;
}
/**
 *
 * @export
 * @interface EpochStakeContentInner
 */
export interface EpochStakeContentInner {
  /**
   * Stake address
   * @type {string}
   * @memberof EpochStakeContentInner
   */
  stake_address: string;
  /**
   * Bech32 prefix of the pool delegated to
   * @type {string}
   * @memberof EpochStakeContentInner
   */
  pool_id: string;
  /**
   * Amount of active delegated stake in Lovelaces
   * @type {string}
   * @memberof EpochStakeContentInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface EpochStakePoolContentInner
 */
export interface EpochStakePoolContentInner {
  /**
   * Stake address
   * @type {string}
   * @memberof EpochStakePoolContentInner
   */
  stake_address: string;
  /**
   * Amount of active delegated stake in Lovelaces
   * @type {string}
   * @memberof EpochStakePoolContentInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface GenesisContent
 */
export interface GenesisContent {
  /**
   * The proportion of slots in which blocks should be issued
   * @type {number}
   * @memberof GenesisContent
   */
  active_slots_coefficient: number;
  /**
   * Determines the quorum needed for votes on the protocol parameter updates
   * @type {number}
   * @memberof GenesisContent
   */
  update_quorum: number;
  /**
   * The total number of lovelace in the system
   * @type {string}
   * @memberof GenesisContent
   */
  max_lovelace_supply: string;
  /**
   * Network identifier
   * @type {number}
   * @memberof GenesisContent
   */
  network_magic: number;
  /**
   * Number of slots in an epoch
   * @type {number}
   * @memberof GenesisContent
   */
  epoch_length: number;
  /**
   * Time of slot 0 in UNIX time
   * @type {number}
   * @memberof GenesisContent
   */
  system_start: number;
  /**
   * Number of slots in an KES period
   * @type {number}
   * @memberof GenesisContent
   */
  slots_per_kes_period: number;
  /**
   * Duration of one slot in seconds
   * @type {number}
   * @memberof GenesisContent
   */
  slot_length: number;
  /**
   * The maximum number of time a KES key can be evolved before a pool operator must create a new operational certificate
   * @type {number}
   * @memberof GenesisContent
   */
  max_kes_evolutions: number;
  /**
   * Security parameter k
   * @type {number}
   * @memberof GenesisContent
   */
  security_param: number;
}
/**
 *
 * @export
 * @interface Get200Response
 */
export interface Get200Response {
  /**
   *
   * @type {string}
   * @memberof Get200Response
   */
  url: string;
  /**
   *
   * @type {string}
   * @memberof Get200Response
   */
  version: string;
}
/**
 *
 * @export
 * @interface HealthClockGet200Response
 */
export interface HealthClockGet200Response {
  /**
   *
   * @type {number}
   * @memberof HealthClockGet200Response
   */
  server_time: number;
}
/**
 *
 * @export
 * @interface HealthGet200Response
 */
export interface HealthGet200Response {
  /**
   *
   * @type {boolean}
   * @memberof HealthGet200Response
   */
  is_healthy: boolean;
}
/**
 *
 * @export
 * @interface InlineObject
 */
export interface InlineObject {
  /**
   *
   * @type {number}
   * @memberof InlineObject
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject1
 */
export interface InlineObject1 {
  /**
   *
   * @type {number}
   * @memberof InlineObject1
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject1
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject1
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject2
 */
export interface InlineObject2 {
  /**
   *
   * @type {number}
   * @memberof InlineObject2
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject2
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject2
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject3
 */
export interface InlineObject3 {
  /**
   *
   * @type {number}
   * @memberof InlineObject3
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject3
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject3
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject4
 */
export interface InlineObject4 {
  /**
   *
   * @type {number}
   * @memberof InlineObject4
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject4
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject4
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject5
 */
export interface InlineObject5 {
  /**
   *
   * @type {number}
   * @memberof InlineObject5
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject5
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject5
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject6
 */
export interface InlineObject6 {
  /**
   *
   * @type {number}
   * @memberof InlineObject6
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject6
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject6
   */
  message: string;
}
/**
 *
 * @export
 * @interface InlineObject7
 */
export interface InlineObject7 {
  /**
   *
   * @type {number}
   * @memberof InlineObject7
   */
  status_code: number;
  /**
   *
   * @type {string}
   * @memberof InlineObject7
   */
  error: string;
  /**
   *
   * @type {string}
   * @memberof InlineObject7
   */
  message: string;
}
/**
 *
 * @export
 * @interface IpfsAdd200Response
 */
export interface IpfsAdd200Response {
  /**
   * Name of the file
   * @type {string}
   * @memberof IpfsAdd200Response
   */
  name: string;
  /**
   * IPFS hash of the file
   * @type {string}
   * @memberof IpfsAdd200Response
   */
  ipfs_hash: string;
  /**
   * IPFS node size in Bytes
   * @type {string}
   * @memberof IpfsAdd200Response
   */
  size: string;
}
/**
 *
 * @export
 * @interface IpfsPinAddIPFSPathPost200Response
 */
export interface IpfsPinAddIPFSPathPost200Response {
  /**
   * IPFS hash of the pinned object
   * @type {string}
   * @memberof IpfsPinAddIPFSPathPost200Response
   */
  ipfs_hash: string;
  /**
   * State of the pin action
   * @type {string}
   * @memberof IpfsPinAddIPFSPathPost200Response
   */
  state: IpfsPinAddIPFSPathPost200ResponseStateEnum;
  /**
   * Whether filecoin was used to pin the resource.
   * @type {boolean}
   * @memberof IpfsPinAddIPFSPathPost200Response
   */
  filecoin: boolean;
}

export const IpfsPinAddIPFSPathPost200ResponseStateEnum = {
  Queued: 'queued',
  Pinned: 'pinned',
  Unpinned: 'unpinned',
  Failed: 'failed',
  Gc: 'gc'
} as const;

export type IpfsPinAddIPFSPathPost200ResponseStateEnum =
  (typeof IpfsPinAddIPFSPathPost200ResponseStateEnum)[keyof typeof IpfsPinAddIPFSPathPost200ResponseStateEnum];

/**
 *
 * @export
 * @interface IpfsPinListGet200ResponseInner
 */
export interface IpfsPinListGet200ResponseInner {
  /**
   * Creation time of the IPFS object on our backends
   * @type {number}
   * @memberof IpfsPinListGet200ResponseInner
   */
  time_created: number;
  /**
   * Pin time of the IPFS object on our backends
   * @type {number}
   * @memberof IpfsPinListGet200ResponseInner
   */
  time_pinned: number;
  /**
   * IPFS hash of the pinned object
   * @type {string}
   * @memberof IpfsPinListGet200ResponseInner
   */
  ipfs_hash: string;
  /**
   * Size of the object in Bytes
   * @type {string}
   * @memberof IpfsPinListGet200ResponseInner
   */
  size: string;
  /**
   * State of the pinned object, which is `queued` when we are retriving object. If this is successful the state is changed to `pinned` or `failed` if not. The state `gc` means the pinned item has been garbage collected due to account being over storage quota or after it has been moved to `unpinned` state by removing the object pin.
   * @type {string}
   * @memberof IpfsPinListGet200ResponseInner
   */
  state: IpfsPinListGet200ResponseInnerStateEnum;
  /**
   * Whether filecoin was used to pin the resource.
   * @type {boolean}
   * @memberof IpfsPinListGet200ResponseInner
   */
  filecoin: boolean;
}

export const IpfsPinListGet200ResponseInnerStateEnum = {
  Queued: 'queued',
  Pinned: 'pinned',
  Unpinned: 'unpinned',
  Failed: 'failed',
  Gc: 'gc'
} as const;

export type IpfsPinListGet200ResponseInnerStateEnum =
  (typeof IpfsPinListGet200ResponseInnerStateEnum)[keyof typeof IpfsPinListGet200ResponseInnerStateEnum];

/**
 *
 * @export
 * @interface IpfsPinListIPFSPathGet200Response
 */
export interface IpfsPinListIPFSPathGet200Response {
  /**
   * Time of the creation of the IPFS object on our backends
   * @type {number}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  time_created: number;
  /**
   * Time of the pin of the IPFS object on our backends
   * @type {number}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  time_pinned: number;
  /**
   * IPFS hash of the pinned object
   * @type {string}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  ipfs_hash: string;
  /**
   * Size of the object in Bytes
   * @type {string}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  size: string;
  /**
   * State of the pinned object. We define 5 states: `queued`, `pinned`, `unpinned`, `failed`, `gc`. When the object is pending retrieval (i.e. after `/ipfs/pin/add/{IPFS_path}`), the state is `queued`. If the object is already successfully retrieved, state is changed to `pinned` or `failed` otherwise. When object is unpinned (i.e. after `/ipfs/pin/remove/{IPFS_path}`) it is marked for garbage collection. State `gc` means that a previously `unpinned` item has been garbage collected due to account being over storage quota.
   * @type {string}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  state: IpfsPinListIPFSPathGet200ResponseStateEnum;
  /**
   * Whether filecoin was used to pin the resource.
   * @type {boolean}
   * @memberof IpfsPinListIPFSPathGet200Response
   */
  filecoin: boolean;
}

export const IpfsPinListIPFSPathGet200ResponseStateEnum = {
  Queued: 'queued',
  Pinned: 'pinned',
  Unpinned: 'unpinned',
  Failed: 'failed',
  Gc: 'gc'
} as const;

export type IpfsPinListIPFSPathGet200ResponseStateEnum =
  (typeof IpfsPinListIPFSPathGet200ResponseStateEnum)[keyof typeof IpfsPinListIPFSPathGet200ResponseStateEnum];

/**
 *
 * @export
 * @interface IpfsPinRemoveIPFSPathPost200Response
 */
export interface IpfsPinRemoveIPFSPathPost200Response {
  /**
   * IPFS hash of the pinned object
   * @type {string}
   * @memberof IpfsPinRemoveIPFSPathPost200Response
   */
  ipfs_hash: string;
  /**
   * State of the pin action
   * @type {string}
   * @memberof IpfsPinRemoveIPFSPathPost200Response
   */
  state: IpfsPinRemoveIPFSPathPost200ResponseStateEnum;
}

export const IpfsPinRemoveIPFSPathPost200ResponseStateEnum = {
  Queued: 'queued',
  Pinned: 'pinned',
  Unpinned: 'unpinned',
  Failed: 'failed',
  Gc: 'gc'
} as const;

export type IpfsPinRemoveIPFSPathPost200ResponseStateEnum =
  (typeof IpfsPinRemoveIPFSPathPost200ResponseStateEnum)[keyof typeof IpfsPinRemoveIPFSPathPost200ResponseStateEnum];

/**
 *
 * @export
 * @interface MempoolContentInner
 */
export interface MempoolContentInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof MempoolContentInner
   */
  tx_hash: string;
}
/**
 *
 * @export
 * @interface MempoolTxContent
 */
export interface MempoolTxContent {
  /**
   *
   * @type {MempoolTxContentTx}
   * @memberof MempoolTxContent
   */
  tx: MempoolTxContentTx;
  /**
   *
   * @type {Array<MempoolTxContentInputsInner>}
   * @memberof MempoolTxContent
   */
  inputs: Array<MempoolTxContentInputsInner>;
  /**
   *
   * @type {Array<MempoolTxContentOutputsInner>}
   * @memberof MempoolTxContent
   */
  outputs: Array<MempoolTxContentOutputsInner>;
  /**
   *
   * @type {Array<MempoolTxContentRedeemersInner>}
   * @memberof MempoolTxContent
   */
  redeemers?: Array<MempoolTxContentRedeemersInner>;
}
/**
 *
 * @export
 * @interface MempoolTxContentInputsInner
 */
export interface MempoolTxContentInputsInner {
  /**
   * Input address
   * @type {string}
   * @memberof MempoolTxContentInputsInner
   */
  address?: string;
  /**
   * Hash of the UTXO transaction
   * @type {string}
   * @memberof MempoolTxContentInputsInner
   */
  tx_hash: string;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof MempoolTxContentInputsInner
   */
  output_index: number;
  /**
   * Whether the input is a collateral consumed on script validation failure
   * @type {boolean}
   * @memberof MempoolTxContentInputsInner
   */
  collateral: boolean;
  /**
   * Whether the input is a reference transaction input
   * @type {boolean}
   * @memberof MempoolTxContentInputsInner
   */
  reference?: boolean;
}
/**
 *
 * @export
 * @interface MempoolTxContentOutputsInner
 */
export interface MempoolTxContentOutputsInner {
  /**
   * Output address
   * @type {string}
   * @memberof MempoolTxContentOutputsInner
   */
  address: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof MempoolTxContentOutputsInner
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof MempoolTxContentOutputsInner
   */
  output_index: number;
  /**
   * The hash of the transaction output datum
   * @type {string}
   * @memberof MempoolTxContentOutputsInner
   */
  data_hash: string | null;
  /**
   * CBOR encoded inline datum
   * @type {string}
   * @memberof MempoolTxContentOutputsInner
   */
  inline_datum: string | null;
  /**
   * Whether the output is a collateral output
   * @type {boolean}
   * @memberof MempoolTxContentOutputsInner
   */
  collateral: boolean;
  /**
   * The hash of the reference script of the output
   * @type {string}
   * @memberof MempoolTxContentOutputsInner
   */
  reference_script_hash: string | null;
}
/**
 *
 * @export
 * @interface MempoolTxContentRedeemersInner
 */
export interface MempoolTxContentRedeemersInner {
  /**
   * Index of the redeemer within the transaction
   * @type {number}
   * @memberof MempoolTxContentRedeemersInner
   */
  tx_index: number;
  /**
   * Validation purpose
   * @type {string}
   * @memberof MempoolTxContentRedeemersInner
   */
  purpose: MempoolTxContentRedeemersInnerPurposeEnum;
  /**
   * The budget in Memory to run a script
   * @type {string}
   * @memberof MempoolTxContentRedeemersInner
   */
  unit_mem: string;
  /**
   * The budget in CPU steps to run a script
   * @type {string}
   * @memberof MempoolTxContentRedeemersInner
   */
  unit_steps: string;
}

export const MempoolTxContentRedeemersInnerPurposeEnum = {
  Spend: 'spend',
  Mint: 'mint',
  Cert: 'cert',
  Reward: 'reward'
} as const;

export type MempoolTxContentRedeemersInnerPurposeEnum =
  (typeof MempoolTxContentRedeemersInnerPurposeEnum)[keyof typeof MempoolTxContentRedeemersInnerPurposeEnum];

/**
 *
 * @export
 * @interface MempoolTxContentTx
 */
export interface MempoolTxContentTx {
  /**
   * Transaction hash
   * @type {string}
   * @memberof MempoolTxContentTx
   */
  hash: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof MempoolTxContentTx
   */
  output_amount: Array<TxContentOutputAmountInner>;
  /**
   * Fees of the transaction in Lovelaces
   * @type {string}
   * @memberof MempoolTxContentTx
   */
  fees: string;
  /**
   * Deposit within the transaction in Lovelaces
   * @type {string}
   * @memberof MempoolTxContentTx
   */
  deposit: string;
  /**
   * Size of the transaction in Bytes
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  size: number;
  /**
   * Left (included) endpoint of the timelock validity intervals
   * @type {string}
   * @memberof MempoolTxContentTx
   */
  invalid_before: string | null;
  /**
   * Right (excluded) endpoint of the timelock validity intervals
   * @type {string}
   * @memberof MempoolTxContentTx
   */
  invalid_hereafter: string | null;
  /**
   * Count of UTXOs within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  utxo_count: number;
  /**
   * Count of the withdrawals within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  withdrawal_count: number;
  /**
   * Count of the MIR certificates within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  mir_cert_count: number;
  /**
   * Count of the delegations within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  delegation_count: number;
  /**
   * Count of the stake keys (de)registration within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  stake_cert_count: number;
  /**
   * Count of the stake pool registration and update certificates within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  pool_update_count: number;
  /**
   * Count of the stake pool retirement certificates within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  pool_retire_count: number;
  /**
   * Count of asset mints and burns within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  asset_mint_or_burn_count: number;
  /**
   * Count of redeemers within the transaction
   * @type {number}
   * @memberof MempoolTxContentTx
   */
  redeemer_count: number;
  /**
   * True if contract script passed validation
   * @type {boolean}
   * @memberof MempoolTxContentTx
   */
  valid_contract: boolean;
}
/**
 *
 * @export
 * @interface MetricsEndpointsInner
 */
export interface MetricsEndpointsInner {
  /**
   * Starting time of the call count interval (ends midnight UTC) in UNIX time
   * @type {number}
   * @memberof MetricsEndpointsInner
   */
  time: number;
  /**
   * Sum of all calls for a particular day and endpoint
   * @type {number}
   * @memberof MetricsEndpointsInner
   */
  calls: number;
  /**
   * Endpoint parent name
   * @type {string}
   * @memberof MetricsEndpointsInner
   */
  endpoint: string;
}
/**
 *
 * @export
 * @interface MetricsInner
 */
export interface MetricsInner {
  /**
   * Starting time of the call count interval (ends midnight UTC) in UNIX time
   * @type {number}
   * @memberof MetricsInner
   */
  time: number;
  /**
   * Sum of all calls for a particular day
   * @type {number}
   * @memberof MetricsInner
   */
  calls: number;
}
/**
 *
 * @export
 * @interface Network
 */
export interface Network {
  /**
   *
   * @type {NetworkSupply}
   * @memberof Network
   */
  supply: NetworkSupply;
  /**
   *
   * @type {NetworkStake}
   * @memberof Network
   */
  stake: NetworkStake;
}
/**
 *
 * @export
 * @interface NetworkErasInner
 */
export interface NetworkErasInner {
  /**
   *
   * @type {NetworkErasInnerStart}
   * @memberof NetworkErasInner
   */
  start: NetworkErasInnerStart;
  /**
   *
   * @type {NetworkErasInnerEnd}
   * @memberof NetworkErasInner
   */
  end: NetworkErasInnerEnd;
  /**
   *
   * @type {NetworkErasInnerParameters}
   * @memberof NetworkErasInner
   */
  parameters: NetworkErasInnerParameters;
}
/**
 * End of the blockchain era, relative to the start of the network
 * @export
 * @interface NetworkErasInnerEnd
 */
export interface NetworkErasInnerEnd {
  /**
   * Time in seconds relative to the start time of the network
   * @type {number}
   * @memberof NetworkErasInnerEnd
   */
  time: number;
  /**
   * Absolute slot number
   * @type {number}
   * @memberof NetworkErasInnerEnd
   */
  slot: number;
  /**
   * Epoch number
   * @type {number}
   * @memberof NetworkErasInnerEnd
   */
  epoch: number;
}
/**
 * Era parameters
 * @export
 * @interface NetworkErasInnerParameters
 */
export interface NetworkErasInnerParameters {
  /**
   * Epoch length in number of slots
   * @type {number}
   * @memberof NetworkErasInnerParameters
   */
  epoch_length: number;
  /**
   * Slot length in seconds
   * @type {number}
   * @memberof NetworkErasInnerParameters
   */
  slot_length: number;
  /**
   * Zone in which it is guaranteed that no hard fork can take place
   * @type {number}
   * @memberof NetworkErasInnerParameters
   */
  safe_zone: number;
}
/**
 * Start of the blockchain era, relative to the start of the network
 * @export
 * @interface NetworkErasInnerStart
 */
export interface NetworkErasInnerStart {
  /**
   * Time in seconds relative to the start time of the network
   * @type {number}
   * @memberof NetworkErasInnerStart
   */
  time: number;
  /**
   * Absolute slot number
   * @type {number}
   * @memberof NetworkErasInnerStart
   */
  slot: number;
  /**
   * Epoch number
   * @type {number}
   * @memberof NetworkErasInnerStart
   */
  epoch: number;
}
/**
 *
 * @export
 * @interface NetworkStake
 */
export interface NetworkStake {
  /**
   * Current live stake in Lovelaces
   * @type {string}
   * @memberof NetworkStake
   */
  live: string;
  /**
   * Current active stake in Lovelaces
   * @type {string}
   * @memberof NetworkStake
   */
  active: string;
}
/**
 *
 * @export
 * @interface NetworkSupply
 */
export interface NetworkSupply {
  /**
   * Maximum supply in Lovelaces
   * @type {string}
   * @memberof NetworkSupply
   */
  max: string;
  /**
   * Current total (max supply - reserves) supply in Lovelaces
   * @type {string}
   * @memberof NetworkSupply
   */
  total: string;
  /**
   * Current circulating (UTXOs + withdrawables) supply in Lovelaces
   * @type {string}
   * @memberof NetworkSupply
   */
  circulating: string;
  /**
   * Current supply locked by scripts in Lovelaces
   * @type {string}
   * @memberof NetworkSupply
   */
  locked: string;
  /**
   * Current supply locked in treasury
   * @type {string}
   * @memberof NetworkSupply
   */
  treasury: string;
  /**
   * Current supply locked in reserves
   * @type {string}
   * @memberof NetworkSupply
   */
  reserves: string;
}
/**
 *
 * @export
 * @interface NutlinkAddress
 */
export interface NutlinkAddress {
  /**
   * Bech32 encoded address
   * @type {string}
   * @memberof NutlinkAddress
   */
  address: string;
  /**
   * URL of the specific metadata file
   * @type {string}
   * @memberof NutlinkAddress
   */
  metadata_url: string;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof NutlinkAddress
   */
  metadata_hash: string;
  /**
   * The cached metadata of the `metadata_url` file.
   * @type {{ [key: string]: any; }}
   * @memberof NutlinkAddress
   */
  metadata: { [key: string]: any } | null;
}
/**
 *
 * @export
 * @interface NutlinkAddressTickerInner
 */
export interface NutlinkAddressTickerInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof NutlinkAddressTickerInner
   */
  tx_hash: string;
  /**
   * Block height of the record
   * @type {number}
   * @memberof NutlinkAddressTickerInner
   */
  block_height: number;
  /**
   * Transaction index within the block
   * @type {number}
   * @memberof NutlinkAddressTickerInner
   */
  tx_index: number;
  /**
   * Content of the ticker
   * @type {any}
   * @memberof NutlinkAddressTickerInner
   */
  payload: any;
}
/**
 *
 * @export
 * @interface NutlinkAddressTickersInner
 */
export interface NutlinkAddressTickersInner {
  /**
   * Name of the ticker
   * @type {string}
   * @memberof NutlinkAddressTickersInner
   */
  name: string;
  /**
   * Number of ticker records
   * @type {number}
   * @memberof NutlinkAddressTickersInner
   */
  count: number;
  /**
   * Block height of the latest record
   * @type {number}
   * @memberof NutlinkAddressTickersInner
   */
  latest_block: number;
}
/**
 *
 * @export
 * @interface NutlinkTickersTickerInner
 */
export interface NutlinkTickersTickerInner {
  /**
   * Address of a metadata oracle
   * @type {string}
   * @memberof NutlinkTickersTickerInner
   */
  address: string;
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof NutlinkTickersTickerInner
   */
  tx_hash: string;
  /**
   * Block height of the record
   * @type {number}
   * @memberof NutlinkTickersTickerInner
   */
  block_height: number;
  /**
   * Transaction index within the block
   * @type {number}
   * @memberof NutlinkTickersTickerInner
   */
  tx_index: number;
  /**
   * Content of the ticker
   * @type {any}
   * @memberof NutlinkTickersTickerInner
   */
  payload: any;
}
/**
 *
 * @export
 * @interface Pool
 */
export interface Pool {
  /**
   * Bech32 pool ID
   * @type {string}
   * @memberof Pool
   */
  pool_id: string;
  /**
   * Hexadecimal pool ID.
   * @type {string}
   * @memberof Pool
   */
  hex: string;
  /**
   * VRF key hash
   * @type {string}
   * @memberof Pool
   */
  vrf_key: string;
  /**
   * Total minted blocks
   * @type {number}
   * @memberof Pool
   */
  blocks_minted: number;
  /**
   * Number of blocks minted in the current epoch
   * @type {number}
   * @memberof Pool
   */
  blocks_epoch: number;
  /**
   *
   * @type {string}
   * @memberof Pool
   */
  live_stake: string;
  /**
   *
   * @type {number}
   * @memberof Pool
   */
  live_size: number;
  /**
   *
   * @type {number}
   * @memberof Pool
   */
  live_saturation: number;
  /**
   *
   * @type {number}
   * @memberof Pool
   */
  live_delegators: number;
  /**
   *
   * @type {string}
   * @memberof Pool
   */
  active_stake: string;
  /**
   *
   * @type {number}
   * @memberof Pool
   */
  active_size: number;
  /**
   * Stake pool certificate pledge
   * @type {string}
   * @memberof Pool
   */
  declared_pledge: string;
  /**
   * Stake pool current pledge
   * @type {string}
   * @memberof Pool
   */
  live_pledge: string;
  /**
   * Margin tax cost of the stake pool
   * @type {number}
   * @memberof Pool
   */
  margin_cost: number;
  /**
   * Fixed tax cost of the stake pool
   * @type {string}
   * @memberof Pool
   */
  fixed_cost: string;
  /**
   * Bech32 reward account of the stake pool
   * @type {string}
   * @memberof Pool
   */
  reward_account: string;
  /**
   *
   * @type {Array<string>}
   * @memberof Pool
   */
  owners: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof Pool
   */
  registration: Array<string>;
  /**
   *
   * @type {Array<string>}
   * @memberof Pool
   */
  retirement: Array<string>;
  /**
   *
   * @type {PoolCalidusKey}
   * @memberof Pool
   */
  calidus_key: PoolCalidusKey | null;
}
/**
 * Last valid Calidus key for the pool
 * @export
 * @interface PoolCalidusKey
 */
export interface PoolCalidusKey {
  /**
   * A Bech32-encoded identifier derived from the calidus public key
   * @type {string}
   * @memberof PoolCalidusKey
   */
  id: string;
  /**
   * The raw hexadecimal-encoded calidus public key used for verification purposes
   * @type {string}
   * @memberof PoolCalidusKey
   */
  pub_key: string;
  /**
   * A unique number used once to prevent replay attacks and ensure the uniqueness of the key registration
   * @type {number}
   * @memberof PoolCalidusKey
   */
  nonce: number;
  /**
   * The transaction hash that submitted the Calidus key registration
   * @type {string}
   * @memberof PoolCalidusKey
   */
  tx_hash: string;
  /**
   * The block height at which this key registration was recorded
   * @type {number}
   * @memberof PoolCalidusKey
   */
  block_height: number;
  /**
   * Block time of the key registration
   * @type {number}
   * @memberof PoolCalidusKey
   */
  block_time: number;
  /**
   * Epoch number of the key registration
   * @type {number}
   * @memberof PoolCalidusKey
   */
  epoch: number;
}
/**
 *
 * @export
 * @interface PoolDelegatorsInner
 */
export interface PoolDelegatorsInner {
  /**
   * Bech32 encoded stake addresses
   * @type {string}
   * @memberof PoolDelegatorsInner
   */
  address: string;
  /**
   * Currently delegated amount
   * @type {string}
   * @memberof PoolDelegatorsInner
   */
  live_stake: string;
}
/**
 *
 * @export
 * @interface PoolHistoryInner
 */
export interface PoolHistoryInner {
  /**
   * Epoch number
   * @type {number}
   * @memberof PoolHistoryInner
   */
  epoch: number;
  /**
   * Number of blocks created by pool
   * @type {number}
   * @memberof PoolHistoryInner
   */
  blocks: number;
  /**
   * Active (Snapshot of live stake 2 epochs ago) stake in Lovelaces
   * @type {string}
   * @memberof PoolHistoryInner
   */
  active_stake: string;
  /**
   * Pool size (percentage) of overall active stake at that epoch
   * @type {number}
   * @memberof PoolHistoryInner
   */
  active_size: number;
  /**
   * Number of delegators for epoch
   * @type {number}
   * @memberof PoolHistoryInner
   */
  delegators_count: number;
  /**
   * Total rewards received before distribution to delegators
   * @type {string}
   * @memberof PoolHistoryInner
   */
  rewards: string;
  /**
   * Pool operator rewards
   * @type {string}
   * @memberof PoolHistoryInner
   */
  fees: string;
}
/**
 *
 * @export
 * @interface PoolListExtendedInner
 */
export interface PoolListExtendedInner {
  /**
   * Bech32 encoded pool ID
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  pool_id: string;
  /**
   * Hexadecimal pool ID.
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  hex: string;
  /**
   * Active delegated amount
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  active_stake: string;
  /**
   * Currently delegated amount
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  live_stake: string;
  /**
   *
   * @type {number}
   * @memberof PoolListExtendedInner
   */
  live_saturation: number;
  /**
   * Total minted blocks
   * @type {number}
   * @memberof PoolListExtendedInner
   */
  blocks_minted: number;
  /**
   * Stake pool certificate pledge
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  declared_pledge: string;
  /**
   * Margin tax cost of the stake pool
   * @type {number}
   * @memberof PoolListExtendedInner
   */
  margin_cost: number;
  /**
   * Fixed tax cost of the stake pool
   * @type {string}
   * @memberof PoolListExtendedInner
   */
  fixed_cost: string;
  /**
   *
   * @type {TxContentPoolCertsInnerMetadata}
   * @memberof PoolListExtendedInner
   */
  metadata: TxContentPoolCertsInnerMetadata | null;
}
/**
 *
 * @export
 * @interface PoolListRetireInner
 */
export interface PoolListRetireInner {
  /**
   * Bech32 encoded pool ID
   * @type {string}
   * @memberof PoolListRetireInner
   */
  pool_id: string;
  /**
   * Retirement epoch number
   * @type {number}
   * @memberof PoolListRetireInner
   */
  epoch: number;
}
/**
 *
 * @export
 * @interface PoolMetadata
 */
export interface PoolMetadata {
  /**
   * Bech32 pool ID
   * @type {string}
   * @memberof PoolMetadata
   */
  pool_id: string;
  /**
   * Hexadecimal pool ID
   * @type {string}
   * @memberof PoolMetadata
   */
  hex: string;
  /**
   * URL to the stake pool metadata
   * @type {string}
   * @memberof PoolMetadata
   */
  url: string | null;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof PoolMetadata
   */
  hash: string | null;
  /**
   * Ticker of the stake pool
   * @type {string}
   * @memberof PoolMetadata
   */
  ticker: string | null;
  /**
   * Name of the stake pool
   * @type {string}
   * @memberof PoolMetadata
   */
  name: string | null;
  /**
   * Description of the stake pool
   * @type {string}
   * @memberof PoolMetadata
   */
  description: string | null;
  /**
   * Home page of the stake pool
   * @type {string}
   * @memberof PoolMetadata
   */
  homepage: string | null;
}
/**
 *
 * @export
 * @interface PoolUpdatesInner
 */
export interface PoolUpdatesInner {
  /**
   * Transaction ID
   * @type {string}
   * @memberof PoolUpdatesInner
   */
  tx_hash: string;
  /**
   * Certificate within the transaction
   * @type {number}
   * @memberof PoolUpdatesInner
   */
  cert_index: number;
  /**
   * Action in the certificate
   * @type {string}
   * @memberof PoolUpdatesInner
   */
  action: PoolUpdatesInnerActionEnum;
}

export const PoolUpdatesInnerActionEnum = {
  Registered: 'registered',
  Deregistered: 'deregistered'
} as const;

export type PoolUpdatesInnerActionEnum =
  (typeof PoolUpdatesInnerActionEnum)[keyof typeof PoolUpdatesInnerActionEnum];

/**
 *
 * @export
 * @interface PoolsPoolIdMetadataGet200Response
 */
export interface PoolsPoolIdMetadataGet200Response {
  /**
   * Bech32 pool ID
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  pool_id: string;
  /**
   * Hexadecimal pool ID
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  hex: string;
  /**
   * URL to the stake pool metadata
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  url: string | null;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  hash: string | null;
  /**
   * Ticker of the stake pool
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  ticker: string | null;
  /**
   * Name of the stake pool
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  name: string | null;
  /**
   * Description of the stake pool
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  description: string | null;
  /**
   * Home page of the stake pool
   * @type {string}
   * @memberof PoolsPoolIdMetadataGet200Response
   */
  homepage: string | null;
}
/**
 *
 * @export
 * @interface Proposal
 */
export interface Proposal {
  /**
   * Hash of the proposal transaction.
   * @type {string}
   * @memberof Proposal
   */
  tx_hash: string;
  /**
   * Index of the certificate within the proposal transaction.
   * @type {number}
   * @memberof Proposal
   */
  cert_index: number;
  /**
   * Type of proposal.
   * @type {string}
   * @memberof Proposal
   */
  governance_type: ProposalGovernanceTypeEnum;
  /**
   * An object describing the content of this GovActionProposal in a readable way.
   * @type {{ [key: string]: any; }}
   * @memberof Proposal
   */
  governance_description: { [key: string]: any } | null;
  /**
   * The deposit amount paid for this proposal.
   * @type {string}
   * @memberof Proposal
   */
  deposit: string;
  /**
   * Bech32 stake address of the reward address to receive the deposit when it is repaid.
   * @type {string}
   * @memberof Proposal
   */
  return_address: string;
  /**
   * The epoch at which the proposal was ratified. Null if the proposal has not been ratified.
   * @type {number}
   * @memberof Proposal
   */
  ratified_epoch: number | null;
  /**
   * The epoch at which the proposal was enacted. Null if the proposal has not been enacted.
   * @type {number}
   * @memberof Proposal
   */
  enacted_epoch: number | null;
  /**
   * The epoch at which the proposal was dropped. A proposal is dropped if it expires or if any of its dependencies expire.
   * @type {number}
   * @memberof Proposal
   */
  dropped_epoch: number | null;
  /**
   * The epoch at which the proposal expired. Null if the proposal has not expired.
   * @type {number}
   * @memberof Proposal
   */
  expired_epoch: number | null;
  /**
   * The epoch at which this governance action will expire.
   * @type {number}
   * @memberof Proposal
   */
  expiration: number;
}

export const ProposalGovernanceTypeEnum = {
  HardForkInitiation: 'hard_fork_initiation',
  NewCommittee: 'new_committee',
  NewConstitution: 'new_constitution',
  InfoAction: 'info_action',
  NoConfidence: 'no_confidence',
  ParameterChange: 'parameter_change',
  TreasuryWithdrawals: 'treasury_withdrawals'
} as const;

export type ProposalGovernanceTypeEnum =
  (typeof ProposalGovernanceTypeEnum)[keyof typeof ProposalGovernanceTypeEnum];

/**
 *
 * @export
 * @interface ProposalMetadata
 */
export interface ProposalMetadata {
  /**
   * Off-chain metadata of a proposal with a specific transaction hash
   * @type {string}
   * @memberof ProposalMetadata
   */
  tx_hash: string;
  /**
   * Off-chain metadata of a proposal with a specific transaction cert_index
   * @type {number}
   * @memberof ProposalMetadata
   */
  cert_index: number;
  /**
   * URL to the proposal metadata
   * @type {string}
   * @memberof ProposalMetadata
   */
  url: string;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof ProposalMetadata
   */
  hash: string;
  /**
   * Content of the JSON metadata (validated CIP-108)
   * @type {any}
   * @memberof ProposalMetadata
   */
  json_metadata: any | null;
  /**
   * Content of the metadata (raw)
   * @type {string}
   * @memberof ProposalMetadata
   */
  bytes: string;
}
/**
 *
 * @export
 * @interface ProposalParameters
 */
export interface ProposalParameters {
  /**
   * Off-chain metadata of a proposal with a specific transaction hash
   * @type {string}
   * @memberof ProposalParameters
   */
  tx_hash: string;
  /**
   * Off-chain metadata of a proposal with a specific transaction cert_index
   * @type {number}
   * @memberof ProposalParameters
   */
  cert_index: number;
  /**
   *
   * @type {ProposalParametersParameters}
   * @memberof ProposalParameters
   */
  parameters: ProposalParametersParameters;
}
/**
 *
 * @export
 * @interface ProposalParametersParameters
 */
export interface ProposalParametersParameters {
  /**
   * Epoch number
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  epoch?: number | null;
  /**
   * The linear factor for the minimum fee calculation for given epoch
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  min_fee_a: number | null;
  /**
   * The constant factor for the minimum fee calculation
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  min_fee_b: number | null;
  /**
   * Maximum block body size in Bytes
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  max_block_size: number | null;
  /**
   * Maximum transaction size
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  max_tx_size: number | null;
  /**
   * Maximum block header size
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  max_block_header_size: number | null;
  /**
   * The amount of a key registration deposit in Lovelaces
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  key_deposit: string | null;
  /**
   * The amount of a pool registration deposit in Lovelaces
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  pool_deposit: string | null;
  /**
   * Epoch bound on pool retirement
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  e_max: number | null;
  /**
   * Desired number of pools
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  n_opt: number | null;
  /**
   * Pool pledge influence
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  a0: number | null;
  /**
   * Monetary expansion
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  rho: number | null;
  /**
   * Treasury expansion
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  tau: number | null;
  /**
   * Percentage of blocks produced by federated nodes
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  decentralisation_param: number | null;
  /**
   * Seed for extra entropy
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  extra_entropy: string | null;
  /**
   * Accepted protocol major version
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  protocol_major_ver: number | null;
  /**
   * Accepted protocol minor version
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  protocol_minor_ver: number | null;
  /**
   * Minimum UTXO value
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  min_utxo: string | null;
  /**
   * Minimum stake cost forced on the pool
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  min_pool_cost: string | null;
  /**
   * Cost models parameters for Plutus Core scripts in raw list form
   * @type {{ [key: string]: any; }}
   * @memberof ProposalParametersParameters
   */
  cost_models: { [key: string]: any } | null;
  /**
   * The per word cost of script memory usage
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  price_mem: number | null;
  /**
   * The cost of script execution step usage
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  price_step: number | null;
  /**
   * The maximum number of execution memory allowed to be used in a single transaction
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  max_tx_ex_mem: string | null;
  /**
   * The maximum number of execution steps allowed to be used in a single transaction
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  max_tx_ex_steps: string | null;
  /**
   * The maximum number of execution memory allowed to be used in a single block
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  max_block_ex_mem: string | null;
  /**
   * The maximum number of execution steps allowed to be used in a single block
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  max_block_ex_steps: string | null;
  /**
   * The maximum Val size
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  max_val_size: string | null;
  /**
   * The percentage of the transactions fee which must be provided as collateral when including non-native scripts
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  collateral_percent: number | null;
  /**
   * The maximum number of collateral inputs allowed in a transaction
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  max_collateral_inputs: number | null;
  /**
   * Cost per UTxO word for Alonzo. Cost per UTxO byte for Babbage and later.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  coins_per_utxo_size: string | null;
  /**
   * Cost per UTxO word for Alonzo. Cost per UTxO byte for Babbage and later.
   * @type {string}
   * @memberof ProposalParametersParameters
   * @deprecated
   */
  coins_per_utxo_word: string | null;
  /**
   * Pool Voting threshold for motion of no-confidence. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  pvt_motion_no_confidence: number | null;
  /**
   * Pool Voting threshold for new committee/threshold (normal state). New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  pvt_committee_normal: number | null;
  /**
   * Pool Voting threshold for new committee/threshold (state of no-confidence). New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  pvt_committee_no_confidence: number | null;
  /**
   * Pool Voting threshold for hard-fork initiation. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  pvt_hard_fork_initiation: number | null;
  /**
   * DRep Vote threshold for motion of no-confidence. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_motion_no_confidence: number | null;
  /**
   * DRep Vote threshold for new committee/threshold (normal state). New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_committee_normal: number | null;
  /**
   * DRep Vote threshold for new committee/threshold (state of no-confidence). New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_committee_no_confidence: number | null;
  /**
   * DRep Vote threshold for update to the Constitution. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_update_to_constitution: number | null;
  /**
   * DRep Vote threshold for hard-fork initiation. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_hard_fork_initiation: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, network group. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_p_p_network_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, economic group. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_p_p_economic_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, technical group. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_p_p_technical_group: number | null;
  /**
   * DRep Vote threshold for protocol parameter changes, governance group. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_p_p_gov_group: number | null;
  /**
   * DRep Vote threshold for treasury withdrawal. New in 13.2-Conway.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  dvt_treasury_withdrawal: number | null;
  /**
   * Minimal constitutional committee size. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  committee_min_size: string | null;
  /**
   * Constitutional committee term limits. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  committee_max_term_length: string | null;
  /**
   * Governance action expiration. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  gov_action_lifetime: string | null;
  /**
   * Governance action deposit. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  gov_action_deposit: string | null;
  /**
   * DRep deposit amount. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  drep_deposit: string | null;
  /**
   * DRep activity period. New in 13.2-Conway.
   * @type {string}
   * @memberof ProposalParametersParameters
   */
  drep_activity: string | null;
  /**
   * Pool Voting threshold for security-relevant protocol parameters changes. Renamed to pvt_p_p_security_group.
   * @type {number}
   * @memberof ProposalParametersParameters
   * @deprecated
   */
  pvtpp_security_group: number | null;
  /**
   * Pool Voting threshold for security-relevant protocol parameters changes.
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  pvt_p_p_security_group: number | null;
  /**
   *
   * @type {number}
   * @memberof ProposalParametersParameters
   */
  min_fee_ref_script_cost_per_byte: number | null;
}
/**
 *
 * @export
 * @interface ProposalVotesInner
 */
export interface ProposalVotesInner {
  /**
   * Hash of the voting transaction.
   * @type {string}
   * @memberof ProposalVotesInner
   */
  tx_hash: string;
  /**
   * Index of the certificate within the voting transaction.
   * @type {number}
   * @memberof ProposalVotesInner
   */
  cert_index: number;
  /**
   * The role of the voter. Can be one of constitutional_committee, drep, spo.
   * @type {string}
   * @memberof ProposalVotesInner
   */
  voter_role: ProposalVotesInnerVoterRoleEnum;
  /**
   * The actual voter.
   * @type {string}
   * @memberof ProposalVotesInner
   */
  voter: string;
  /**
   * The Vote. Can be one of yes, no, abstain.
   * @type {string}
   * @memberof ProposalVotesInner
   */
  vote: ProposalVotesInnerVoteEnum;
}

export const ProposalVotesInnerVoterRoleEnum = {
  ConstitutionalCommittee: 'constitutional_committee',
  Drep: 'drep',
  Spo: 'spo'
} as const;

export type ProposalVotesInnerVoterRoleEnum =
  (typeof ProposalVotesInnerVoterRoleEnum)[keyof typeof ProposalVotesInnerVoterRoleEnum];
export const ProposalVotesInnerVoteEnum = {
  Yes: 'yes',
  No: 'no',
  Abstain: 'abstain'
} as const;

export type ProposalVotesInnerVoteEnum =
  (typeof ProposalVotesInnerVoteEnum)[keyof typeof ProposalVotesInnerVoteEnum];

/**
 *
 * @export
 * @interface ProposalWithdrawalsInner
 */
export interface ProposalWithdrawalsInner {
  /**
   * Bech32 stake address
   * @type {string}
   * @memberof ProposalWithdrawalsInner
   */
  stake_address: string;
  /**
   * Withdrawal amount in Lovelaces
   * @type {string}
   * @memberof ProposalWithdrawalsInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface ProposalsInner
 */
export interface ProposalsInner {
  /**
   * Hash of the proposal transaction.
   * @type {string}
   * @memberof ProposalsInner
   */
  tx_hash: string;
  /**
   * Index of the certificate within the proposal transaction.
   * @type {number}
   * @memberof ProposalsInner
   */
  cert_index: number;
  /**
   * Type of proposal.
   * @type {string}
   * @memberof ProposalsInner
   */
  governance_type: ProposalsInnerGovernanceTypeEnum;
}

export const ProposalsInnerGovernanceTypeEnum = {
  HardForkInitiation: 'hard_fork_initiation',
  NewCommittee: 'new_committee',
  NewConstitution: 'new_constitution',
  InfoAction: 'info_action',
  NoConfidence: 'no_confidence',
  ParameterChange: 'parameter_change',
  TreasuryWithdrawals: 'treasury_withdrawals'
} as const;

export type ProposalsInnerGovernanceTypeEnum =
  (typeof ProposalsInnerGovernanceTypeEnum)[keyof typeof ProposalsInnerGovernanceTypeEnum];

/**
 *
 * @export
 * @interface Script
 */
export interface Script {
  /**
   * Script hash
   * @type {string}
   * @memberof Script
   */
  script_hash: string;
  /**
   * Type of the script language
   * @type {string}
   * @memberof Script
   */
  type: ScriptTypeEnum;
  /**
   * The size of the CBOR serialised script, if a Plutus script
   * @type {number}
   * @memberof Script
   */
  serialised_size: number | null;
}

export const ScriptTypeEnum = {
  Timelock: 'timelock',
  PlutusV1: 'plutusV1',
  PlutusV2: 'plutusV2'
} as const;

export type ScriptTypeEnum = (typeof ScriptTypeEnum)[keyof typeof ScriptTypeEnum];

/**
 *
 * @export
 * @interface ScriptCbor
 */
export interface ScriptCbor {
  /**
   * CBOR contents of the `plutus` script, null for `timelocks`
   * @type {string}
   * @memberof ScriptCbor
   */
  cbor: string | null;
}
/**
 *
 * @export
 * @interface ScriptDatum
 */
export interface ScriptDatum {
  /**
   * JSON content of the datum
   * @type {{ [key: string]: any; }}
   * @memberof ScriptDatum
   */
  json_value: { [key: string]: any };
}
/**
 *
 * @export
 * @interface ScriptDatumCbor
 */
export interface ScriptDatumCbor {
  /**
   * CBOR serialized datum
   * @type {string}
   * @memberof ScriptDatumCbor
   */
  cbor: string;
}
/**
 *
 * @export
 * @interface ScriptJson
 */
export interface ScriptJson {
  /**
   * JSON contents of the `timelock` script, null for `plutus` scripts
   * @type {any}
   * @memberof ScriptJson
   */
  json: any | null;
}
/**
 *
 * @export
 * @interface ScriptRedeemersInner
 */
export interface ScriptRedeemersInner {
  /**
   * Hash of the transaction
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  tx_hash: string;
  /**
   * The index of the redeemer pointer in the transaction
   * @type {number}
   * @memberof ScriptRedeemersInner
   */
  tx_index: number;
  /**
   * Validation purpose
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  purpose: ScriptRedeemersInnerPurposeEnum;
  /**
   * Datum hash of the redeemer
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  redeemer_data_hash: string;
  /**
   * Datum hash
   * @type {string}
   * @memberof ScriptRedeemersInner
   * @deprecated
   */
  datum_hash: string;
  /**
   * The budget in Memory to run a script
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  unit_mem: string;
  /**
   * The budget in CPU steps to run a script
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  unit_steps: string;
  /**
   * The fee consumed to run the script
   * @type {string}
   * @memberof ScriptRedeemersInner
   */
  fee: string;
}

export const ScriptRedeemersInnerPurposeEnum = {
  Spend: 'spend',
  Mint: 'mint',
  Cert: 'cert',
  Reward: 'reward'
} as const;

export type ScriptRedeemersInnerPurposeEnum =
  (typeof ScriptRedeemersInnerPurposeEnum)[keyof typeof ScriptRedeemersInnerPurposeEnum];

/**
 *
 * @export
 * @interface ScriptsInner
 */
export interface ScriptsInner {
  /**
   * Script hash
   * @type {string}
   * @memberof ScriptsInner
   */
  script_hash: string;
}
/**
 *
 * @export
 * @interface TxContent
 */
export interface TxContent {
  /**
   * Transaction hash
   * @type {string}
   * @memberof TxContent
   */
  hash: string;
  /**
   * Block hash
   * @type {string}
   * @memberof TxContent
   */
  block: string;
  /**
   * Block number
   * @type {number}
   * @memberof TxContent
   */
  block_height: number;
  /**
   * Block creation time in UNIX time
   * @type {number}
   * @memberof TxContent
   */
  block_time: number;
  /**
   * Slot number
   * @type {number}
   * @memberof TxContent
   */
  slot: number;
  /**
   * Transaction index within the block
   * @type {number}
   * @memberof TxContent
   */
  index: number;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof TxContent
   */
  output_amount: Array<TxContentOutputAmountInner>;
  /**
   * Fees of the transaction in Lovelaces
   * @type {string}
   * @memberof TxContent
   */
  fees: string;
  /**
   * Deposit within the transaction in Lovelaces
   * @type {string}
   * @memberof TxContent
   */
  deposit: string;
  /**
   * Size of the transaction in Bytes
   * @type {number}
   * @memberof TxContent
   */
  size: number;
  /**
   * Left (included) endpoint of the timelock validity intervals
   * @type {string}
   * @memberof TxContent
   */
  invalid_before: string | null;
  /**
   * Right (excluded) endpoint of the timelock validity intervals
   * @type {string}
   * @memberof TxContent
   */
  invalid_hereafter: string | null;
  /**
   * Count of UTXOs within the transaction
   * @type {number}
   * @memberof TxContent
   */
  utxo_count: number;
  /**
   * Count of the withdrawals within the transaction
   * @type {number}
   * @memberof TxContent
   */
  withdrawal_count: number;
  /**
   * Count of the MIR certificates within the transaction
   * @type {number}
   * @memberof TxContent
   */
  mir_cert_count: number;
  /**
   * Count of the delegations within the transaction
   * @type {number}
   * @memberof TxContent
   */
  delegation_count: number;
  /**
   * Count of the stake keys (de)registration within the transaction
   * @type {number}
   * @memberof TxContent
   */
  stake_cert_count: number;
  /**
   * Count of the stake pool registration and update certificates within the transaction
   * @type {number}
   * @memberof TxContent
   */
  pool_update_count: number;
  /**
   * Count of the stake pool retirement certificates within the transaction
   * @type {number}
   * @memberof TxContent
   */
  pool_retire_count: number;
  /**
   * Count of asset mints and burns within the transaction
   * @type {number}
   * @memberof TxContent
   */
  asset_mint_or_burn_count: number;
  /**
   * Count of redeemers within the transaction
   * @type {number}
   * @memberof TxContent
   */
  redeemer_count: number;
  /**
   * True if contract script passed validation
   * @type {boolean}
   * @memberof TxContent
   */
  valid_contract: boolean;
}
/**
 *
 * @export
 * @interface TxContentCbor
 */
export interface TxContentCbor {
  /**
   * CBOR serialized transaction
   * @type {string}
   * @memberof TxContentCbor
   */
  cbor: string;
}
/**
 *
 * @export
 * @interface TxContentDelegationsInner
 */
export interface TxContentDelegationsInner {
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentDelegationsInner
   * @deprecated
   */
  index: number;
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentDelegationsInner
   */
  cert_index: number;
  /**
   * Bech32 delegation stake address
   * @type {string}
   * @memberof TxContentDelegationsInner
   */
  address: string;
  /**
   * Bech32 ID of delegated stake pool
   * @type {string}
   * @memberof TxContentDelegationsInner
   */
  pool_id: string;
  /**
   * Epoch in which the delegation becomes active
   * @type {number}
   * @memberof TxContentDelegationsInner
   */
  active_epoch: number;
}
/**
 *
 * @export
 * @interface TxContentMetadataCborInner
 */
export interface TxContentMetadataCborInner {
  /**
   * Metadata label
   * @type {string}
   * @memberof TxContentMetadataCborInner
   */
  label: string;
  /**
   * Content of the CBOR metadata
   * @type {string}
   * @memberof TxContentMetadataCborInner
   * @deprecated
   */
  cbor_metadata: string | null;
  /**
   * Content of the CBOR metadata in hex
   * @type {string}
   * @memberof TxContentMetadataCborInner
   */
  metadata: string | null;
}
/**
 *
 * @export
 * @interface TxContentMetadataInner
 */
export interface TxContentMetadataInner {
  /**
   * Metadata label
   * @type {string}
   * @memberof TxContentMetadataInner
   */
  label: string;
  /**
   *
   * @type {TxContentMetadataInnerJsonMetadata}
   * @memberof TxContentMetadataInner
   */
  json_metadata: TxContentMetadataInnerJsonMetadata;
}
/**
 * @type TxContentMetadataInnerJsonMetadata
 * Content of the metadata
 * @export
 */
export type TxContentMetadataInnerJsonMetadata = string | { [key: string]: any };

/**
 *
 * @export
 * @interface TxContentMirsInner
 */
export interface TxContentMirsInner {
  /**
   * Source of MIR funds
   * @type {string}
   * @memberof TxContentMirsInner
   */
  pot: TxContentMirsInnerPotEnum;
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentMirsInner
   */
  cert_index: number;
  /**
   * Bech32 stake address
   * @type {string}
   * @memberof TxContentMirsInner
   */
  address: string;
  /**
   * MIR amount in Lovelaces
   * @type {string}
   * @memberof TxContentMirsInner
   */
  amount: string;
}

export const TxContentMirsInnerPotEnum = {
  Reserve: 'reserve',
  Treasury: 'treasury'
} as const;

export type TxContentMirsInnerPotEnum =
  (typeof TxContentMirsInnerPotEnum)[keyof typeof TxContentMirsInnerPotEnum];

/**
 * The sum of all the UTXO per asset
 * @export
 * @interface TxContentOutputAmountInner
 */
export interface TxContentOutputAmountInner {
  /**
   * The unit of the value
   * @type {string}
   * @memberof TxContentOutputAmountInner
   */
  unit: string;
  /**
   * The quantity of the unit
   * @type {string}
   * @memberof TxContentOutputAmountInner
   */
  quantity: string;
}
/**
 *
 * @export
 * @interface TxContentPoolCertsInner
 */
export interface TxContentPoolCertsInner {
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentPoolCertsInner
   */
  cert_index: number;
  /**
   * Bech32 encoded pool ID
   * @type {string}
   * @memberof TxContentPoolCertsInner
   */
  pool_id: string;
  /**
   * VRF key hash
   * @type {string}
   * @memberof TxContentPoolCertsInner
   */
  vrf_key: string;
  /**
   * Stake pool certificate pledge in Lovelaces
   * @type {string}
   * @memberof TxContentPoolCertsInner
   */
  pledge: string;
  /**
   * Margin tax cost of the stake pool
   * @type {number}
   * @memberof TxContentPoolCertsInner
   */
  margin_cost: number;
  /**
   * Fixed tax cost of the stake pool in Lovelaces
   * @type {string}
   * @memberof TxContentPoolCertsInner
   */
  fixed_cost: string;
  /**
   * Bech32 reward account of the stake pool
   * @type {string}
   * @memberof TxContentPoolCertsInner
   */
  reward_account: string;
  /**
   *
   * @type {Array<string>}
   * @memberof TxContentPoolCertsInner
   */
  owners: Array<string>;
  /**
   *
   * @type {TxContentPoolCertsInnerMetadata}
   * @memberof TxContentPoolCertsInner
   */
  metadata: TxContentPoolCertsInnerMetadata | null;
  /**
   *
   * @type {Array<TxContentPoolCertsInnerRelaysInner>}
   * @memberof TxContentPoolCertsInner
   */
  relays: Array<TxContentPoolCertsInnerRelaysInner>;
  /**
   * Epoch in which the update becomes active
   * @type {number}
   * @memberof TxContentPoolCertsInner
   */
  active_epoch: number;
}
/**
 *
 * @export
 * @interface TxContentPoolCertsInnerMetadata
 */
export interface TxContentPoolCertsInnerMetadata {
  /**
   * URL to the stake pool metadata
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  url: string | null;
  /**
   * Hash of the metadata file
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  hash: string | null;
  /**
   * Ticker of the stake pool
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  ticker: string | null;
  /**
   * Name of the stake pool
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  name: string | null;
  /**
   * Description of the stake pool
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  description: string | null;
  /**
   * Home page of the stake pool
   * @type {string}
   * @memberof TxContentPoolCertsInnerMetadata
   */
  homepage: string | null;
}
/**
 *
 * @export
 * @interface TxContentPoolCertsInnerRelaysInner
 */
export interface TxContentPoolCertsInnerRelaysInner {
  /**
   * IPv4 address of the relay
   * @type {string}
   * @memberof TxContentPoolCertsInnerRelaysInner
   */
  ipv4: string | null;
  /**
   * IPv6 address of the relay
   * @type {string}
   * @memberof TxContentPoolCertsInnerRelaysInner
   */
  ipv6: string | null;
  /**
   * DNS name of the relay
   * @type {string}
   * @memberof TxContentPoolCertsInnerRelaysInner
   */
  dns: string | null;
  /**
   * DNS SRV entry of the relay
   * @type {string}
   * @memberof TxContentPoolCertsInnerRelaysInner
   */
  dns_srv: string | null;
  /**
   * Network port of the relay
   * @type {number}
   * @memberof TxContentPoolCertsInnerRelaysInner
   */
  port: number;
}
/**
 *
 * @export
 * @interface TxContentPoolRetiresInner
 */
export interface TxContentPoolRetiresInner {
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentPoolRetiresInner
   */
  cert_index: number;
  /**
   * Bech32 stake pool ID
   * @type {string}
   * @memberof TxContentPoolRetiresInner
   */
  pool_id: string;
  /**
   * Epoch in which the pool becomes retired
   * @type {number}
   * @memberof TxContentPoolRetiresInner
   */
  retiring_epoch: number;
}
/**
 *
 * @export
 * @interface TxContentRedeemersInner
 */
export interface TxContentRedeemersInner {
  /**
   * Index of the redeemer within the transaction
   * @type {number}
   * @memberof TxContentRedeemersInner
   */
  tx_index: number;
  /**
   * Validation purpose
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  purpose: TxContentRedeemersInnerPurposeEnum;
  /**
   * Script hash
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  script_hash: string;
  /**
   * Redeemer data hash
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  redeemer_data_hash: string;
  /**
   * Datum hash
   * @type {string}
   * @memberof TxContentRedeemersInner
   * @deprecated
   */
  datum_hash: string;
  /**
   * The budget in Memory to run a script
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  unit_mem: string;
  /**
   * The budget in CPU steps to run a script
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  unit_steps: string;
  /**
   * The fee consumed to run the script
   * @type {string}
   * @memberof TxContentRedeemersInner
   */
  fee: string;
}

export const TxContentRedeemersInnerPurposeEnum = {
  Spend: 'spend',
  Mint: 'mint',
  Cert: 'cert',
  Reward: 'reward'
} as const;

export type TxContentRedeemersInnerPurposeEnum =
  (typeof TxContentRedeemersInnerPurposeEnum)[keyof typeof TxContentRedeemersInnerPurposeEnum];

/**
 *
 * @export
 * @interface TxContentRequiredSignersInner
 */
export interface TxContentRequiredSignersInner {
  /**
   * Hash of the witness
   * @type {string}
   * @memberof TxContentRequiredSignersInner
   */
  witness_hash: string;
}
/**
 *
 * @export
 * @interface TxContentStakeAddrInner
 */
export interface TxContentStakeAddrInner {
  /**
   * Index of the certificate within the transaction
   * @type {number}
   * @memberof TxContentStakeAddrInner
   */
  cert_index: number;
  /**
   * Delegation stake address
   * @type {string}
   * @memberof TxContentStakeAddrInner
   */
  address: string;
  /**
   * Registration boolean, false if deregistration
   * @type {boolean}
   * @memberof TxContentStakeAddrInner
   */
  registration: boolean;
}
/**
 *
 * @export
 * @interface TxContentUtxo
 */
export interface TxContentUtxo {
  /**
   * Transaction hash
   * @type {string}
   * @memberof TxContentUtxo
   */
  hash: string;
  /**
   *
   * @type {Array<TxContentUtxoInputsInner>}
   * @memberof TxContentUtxo
   */
  inputs: Array<TxContentUtxoInputsInner>;
  /**
   *
   * @type {Array<TxContentUtxoOutputsInner>}
   * @memberof TxContentUtxo
   */
  outputs: Array<TxContentUtxoOutputsInner>;
}
/**
 *
 * @export
 * @interface TxContentUtxoInputsInner
 */
export interface TxContentUtxoInputsInner {
  /**
   * Input address
   * @type {string}
   * @memberof TxContentUtxoInputsInner
   */
  address: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof TxContentUtxoInputsInner
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * Hash of the UTXO transaction
   * @type {string}
   * @memberof TxContentUtxoInputsInner
   */
  tx_hash: string;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof TxContentUtxoInputsInner
   */
  output_index: number;
  /**
   * The hash of the transaction output datum
   * @type {string}
   * @memberof TxContentUtxoInputsInner
   */
  data_hash: string | null;
  /**
   * CBOR encoded inline datum
   * @type {string}
   * @memberof TxContentUtxoInputsInner
   */
  inline_datum: string | null;
  /**
   * The hash of the reference script of the input
   * @type {string}
   * @memberof TxContentUtxoInputsInner
   */
  reference_script_hash: string | null;
  /**
   * Whether the input is a collateral consumed on script validation failure
   * @type {boolean}
   * @memberof TxContentUtxoInputsInner
   */
  collateral: boolean;
  /**
   * Whether the input is a reference transaction input
   * @type {boolean}
   * @memberof TxContentUtxoInputsInner
   */
  reference?: boolean;
}
/**
 *
 * @export
 * @interface TxContentUtxoOutputsInner
 */
export interface TxContentUtxoOutputsInner {
  /**
   * Output address
   * @type {string}
   * @memberof TxContentUtxoOutputsInner
   */
  address: string;
  /**
   *
   * @type {Array<TxContentOutputAmountInner>}
   * @memberof TxContentUtxoOutputsInner
   */
  amount: Array<TxContentOutputAmountInner>;
  /**
   * UTXO index in the transaction
   * @type {number}
   * @memberof TxContentUtxoOutputsInner
   */
  output_index: number;
  /**
   * The hash of the transaction output datum
   * @type {string}
   * @memberof TxContentUtxoOutputsInner
   */
  data_hash: string | null;
  /**
   * CBOR encoded inline datum
   * @type {string}
   * @memberof TxContentUtxoOutputsInner
   */
  inline_datum: string | null;
  /**
   * Whether the output is a collateral output
   * @type {boolean}
   * @memberof TxContentUtxoOutputsInner
   */
  collateral: boolean;
  /**
   * The hash of the reference script of the output
   * @type {string}
   * @memberof TxContentUtxoOutputsInner
   */
  reference_script_hash: string | null;
  /**
   * Transaction hash that consumed the UTXO or null for unconsumed UTXOs. Always null for collateral outputs.
   * @type {string}
   * @memberof TxContentUtxoOutputsInner
   */
  consumed_by_tx?: string | null;
}
/**
 *
 * @export
 * @interface TxContentWithdrawalsInner
 */
export interface TxContentWithdrawalsInner {
  /**
   * Bech32 withdrawal address
   * @type {string}
   * @memberof TxContentWithdrawalsInner
   */
  address: string;
  /**
   * Withdrawal amount in Lovelaces
   * @type {string}
   * @memberof TxContentWithdrawalsInner
   */
  amount: string;
}
/**
 *
 * @export
 * @interface TxMetadataLabelCborInner
 */
export interface TxMetadataLabelCborInner {
  /**
   * Transaction hash that contains the specific metadata
   * @type {string}
   * @memberof TxMetadataLabelCborInner
   */
  tx_hash: string;
  /**
   * Content of the CBOR metadata
   * @type {string}
   * @memberof TxMetadataLabelCborInner
   * @deprecated
   */
  cbor_metadata: string | null;
  /**
   * Content of the CBOR metadata in hex
   * @type {string}
   * @memberof TxMetadataLabelCborInner
   */
  metadata: string | null;
}
/**
 *
 * @export
 * @interface TxMetadataLabelJsonInner
 */
export interface TxMetadataLabelJsonInner {
  /**
   * Transaction hash that contains the specific metadata
   * @type {string}
   * @memberof TxMetadataLabelJsonInner
   */
  tx_hash: string;
  /**
   * Content of the JSON metadata
   * @type {any}
   * @memberof TxMetadataLabelJsonInner
   */
  json_metadata: any | null;
}
/**
 *
 * @export
 * @interface TxMetadataLabelsInner
 */
export interface TxMetadataLabelsInner {
  /**
   * Metadata label
   * @type {string}
   * @memberof TxMetadataLabelsInner
   */
  label: string;
  /**
   * CIP10 defined description
   * @type {string}
   * @memberof TxMetadataLabelsInner
   */
  cip10: string | null;
  /**
   * The count of metadata entries with a specific label
   * @type {string}
   * @memberof TxMetadataLabelsInner
   */
  count: string;
}
/**
 *
 * @export
 * @interface UtilsAddressesXpub
 */
export interface UtilsAddressesXpub {
  /**
   * Script hash
   * @type {string}
   * @memberof UtilsAddressesXpub
   */
  xpub: string;
  /**
   * Account role
   * @type {number}
   * @memberof UtilsAddressesXpub
   */
  role: number;
  /**
   * Address index
   * @type {number}
   * @memberof UtilsAddressesXpub
   */
  index: number;
  /**
   * Derived address
   * @type {string}
   * @memberof UtilsAddressesXpub
   */
  address: string;
}
/**
 *
 * @export
 * @interface UtilsTxsEvaluateUtxosPostRequest
 */
export interface UtilsTxsEvaluateUtxosPostRequest {
  /**
   * Transaction CBOR (encoded using base64 or base16).
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequest
   */
  cbor: string;
  /**
   * Additional UTXO as an array of tuples [TxIn, TxOut]. See https://ogmios.dev/mini-protocols/local-tx-submission/#additional-utxo-set.
   * @type {Array<Array<UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner>>}
   * @memberof UtilsTxsEvaluateUtxosPostRequest
   */
  additionalUtxoSet?: Array<Array<UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner>>;
}
/**
 *
 * @export
 * @interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
 */
export interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner {
  /**
   * Transaction hash for the input
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  txId?: string;
  /**
   * Index of the output within the transaction
   * @type {number}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  index?: number;
  /**
   * Output address
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  address: string;
  /**
   *
   * @type {UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  value: UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value;
  /**
   *
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  datum_hash?: string;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  datum?: { [key: string]: any };
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInner
   */
  script?: { [key: string]: any };
}
/**
 * TxIn
 * @export
 * @interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf
 */
export interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf {
  /**
   * Transaction hash for the input
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf
   */
  txId?: string;
  /**
   * Index of the output within the transaction
   * @type {number}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf
   */
  index?: number;
}
/**
 * TxOut
 * @export
 * @interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
 */
export interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1 {
  /**
   * Output address
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
   */
  address: string;
  /**
   *
   * @type {UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
   */
  value: UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value;
  /**
   *
   * @type {string}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
   */
  datum_hash?: string;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
   */
  datum?: { [key: string]: any };
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1
   */
  script?: { [key: string]: any };
}
/**
 *
 * @export
 * @interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value
 */
export interface UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value {
  /**
   * Lovelace amount
   * @type {number}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value
   */
  coins: number;
  /**
   * Assets amount
   * @type {{ [key: string]: number; }}
   * @memberof UtilsTxsEvaluateUtxosPostRequestAdditionalUtxoSetInnerInnerAnyOf1Value
   */
  assets?: { [key: string]: number };
}

/**
 * CardanoAccountsApi - axios parameter creator
 * @export
 */
export const CardanoAccountsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Obtain information about assets associated with addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Assets associated with the account addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesAssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesAssetsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesAssetsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressAddressesAssetsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/addresses/assets`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Account associated addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressAddressesGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/addresses`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain summed details about all addresses associated with a given account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Detailed information about account associated addresses
     * @param {string} stakeAddress Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesTotalGet: async (
      stakeAddress: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressAddressesTotalGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/addresses/total`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the delegation of a specific account.
     * @summary Account delegation history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressDelegationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressDelegationsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressDelegationsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressDelegationsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/delegations`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about a specific stake account.
     * @summary Specific account address
     * @param {string} stakeAddress Bech32 stake address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressGet: async (
      stakeAddress: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the history of a specific account.
     * @summary Account history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressHistoryGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressHistoryGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressHistoryGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/history`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the MIRs of a specific account.
     * @summary Account MIR history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressMirsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressMirsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressMirsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressMirsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/mirs`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the registrations and deregistrations of a specific account.
     * @summary Account registration history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRegistrationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressRegistrationsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRegistrationsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressRegistrationsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/registrations`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the reward history of a specific account.
     * @summary Account reward history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRewardsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressRewardsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRewardsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressRewardsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/rewards`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * UTXOs associated with the account.
     * @summary Account UTXOs
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressUtxosGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressUtxosGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressUtxosGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/utxos`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about the withdrawals of a specific account.
     * @summary Account withdrawal history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressWithdrawalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressWithdrawalsGet: async (
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressWithdrawalsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'stakeAddress' is not null or undefined
      assertParamExists('accountsStakeAddressWithdrawalsGet', 'stakeAddress', stakeAddress);
      const localVarPath = `/accounts/{stake_address}/withdrawals`.replace(
        `{${'stake_address'}}`,
        encodeURIComponent(String(stakeAddress))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoAccountsApi - functional programming interface
 * @export
 */
export const CardanoAccountsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoAccountsApiAxiosParamCreator(configuration);
  return {
    /**
     * Obtain information about assets associated with addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Assets associated with the account addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesAssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressAddressesAssetsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesAssetsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountAddressesAssetsInner>>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.accountsStakeAddressAddressesAssetsGet(
          stakeAddress,
          count,
          page,
          order,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressAddressesAssetsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Account associated addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressAddressesGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<AccountAddressesContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressAddressesGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressAddressesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain summed details about all addresses associated with a given account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Detailed information about account associated addresses
     * @param {string} stakeAddress Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressAddressesTotalGet(
      stakeAddress: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AccountAddressesTotal>> {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.accountsStakeAddressAddressesTotalGet(
          stakeAddress,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressAddressesTotalGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the delegation of a specific account.
     * @summary Account delegation history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressDelegationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressDelegationsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressDelegationsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<AccountDelegationContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressDelegationsGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressDelegationsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about a specific stake account.
     * @summary Specific account address
     * @param {string} stakeAddress Bech32 stake address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressGet(
      stakeAddress: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AccountContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressGet(
        stakeAddress,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the history of a specific account.
     * @summary Account history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressHistoryGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountHistoryContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressHistoryGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressHistoryGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the MIRs of a specific account.
     * @summary Account MIR history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressMirsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressMirsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressMirsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountMirContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressMirsGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressMirsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the registrations and deregistrations of a specific account.
     * @summary Account registration history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRegistrationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressRegistrationsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRegistrationsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<AccountRegistrationContentInner>>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.accountsStakeAddressRegistrationsGet(
          stakeAddress,
          count,
          page,
          order,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressRegistrationsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the reward history of a specific account.
     * @summary Account reward history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRewardsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressRewardsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRewardsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountRewardContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressRewardsGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressRewardsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * UTXOs associated with the account.
     * @summary Account UTXOs
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressUtxosGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressUtxosGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountUtxoContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressUtxosGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressUtxosGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about the withdrawals of a specific account.
     * @summary Account withdrawal history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressWithdrawalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async accountsStakeAddressWithdrawalsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressWithdrawalsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<AccountWithdrawalContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.accountsStakeAddressWithdrawalsGet(
        stakeAddress,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAccountsApi.accountsStakeAddressWithdrawalsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoAccountsApi - factory interface
 * @export
 */
export const CardanoAccountsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoAccountsApiFp(configuration);
  return {
    /**
     * Obtain information about assets associated with addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Assets associated with the account addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesAssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesAssetsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesAssetsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountAddressesAssetsInner>> {
      return localVarFp
        .accountsStakeAddressAddressesAssetsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Account associated addresses
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressAddressesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountAddressesContentInner>> {
      return localVarFp
        .accountsStakeAddressAddressesGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain summed details about all addresses associated with a given account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
     * @summary Detailed information about account associated addresses
     * @param {string} stakeAddress Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressAddressesTotalGet(
      stakeAddress: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<AccountAddressesTotal> {
      return localVarFp
        .accountsStakeAddressAddressesTotalGet(stakeAddress, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the delegation of a specific account.
     * @summary Account delegation history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressDelegationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressDelegationsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressDelegationsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountDelegationContentInner>> {
      return localVarFp
        .accountsStakeAddressDelegationsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about a specific stake account.
     * @summary Specific account address
     * @param {string} stakeAddress Bech32 stake address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressGet(
      stakeAddress: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<AccountContent> {
      return localVarFp
        .accountsStakeAddressGet(stakeAddress, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the history of a specific account.
     * @summary Account history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressHistoryGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountHistoryContentInner>> {
      return localVarFp
        .accountsStakeAddressHistoryGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the MIRs of a specific account.
     * @summary Account MIR history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressMirsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressMirsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressMirsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountMirContentInner>> {
      return localVarFp
        .accountsStakeAddressMirsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the registrations and deregistrations of a specific account.
     * @summary Account registration history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRegistrationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressRegistrationsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRegistrationsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountRegistrationContentInner>> {
      return localVarFp
        .accountsStakeAddressRegistrationsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the reward history of a specific account.
     * @summary Account reward history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressRewardsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressRewardsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressRewardsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountRewardContentInner>> {
      return localVarFp
        .accountsStakeAddressRewardsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * UTXOs associated with the account.
     * @summary Account UTXOs
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressUtxosGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressUtxosGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountUtxoContentInner>> {
      return localVarFp
        .accountsStakeAddressUtxosGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about the withdrawals of a specific account.
     * @summary Account withdrawal history
     * @param {string} stakeAddress Bech32 stake address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AccountsStakeAddressWithdrawalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    accountsStakeAddressWithdrawalsGet(
      stakeAddress: string,
      count?: number,
      page?: number,
      order?: AccountsStakeAddressWithdrawalsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AccountWithdrawalContentInner>> {
      return localVarFp
        .accountsStakeAddressWithdrawalsGet(stakeAddress, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoAccountsApi - object-oriented interface
 * @export
 * @class CardanoAccountsApi
 * @extends {BaseAPI}
 */
export class CardanoAccountsApi extends BaseAPI {
  /**
   * Obtain information about assets associated with addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
   * @summary Assets associated with the account addresses
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressAddressesAssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressAddressesAssetsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressAddressesAssetsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressAddressesAssetsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the addresses of a specific account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
   * @summary Account associated addresses
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressAddressesGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressAddressesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressAddressesGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain summed details about all addresses associated with a given account. <b>Be careful</b>, as an account could be part of a mangled address and does not necessarily mean the addresses are owned by user as the account.
   * @summary Detailed information about account associated addresses
   * @param {string} stakeAddress Bech32 address.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressAddressesTotalGet(
    stakeAddress: string,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressAddressesTotalGet(stakeAddress, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the delegation of a specific account.
   * @summary Account delegation history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressDelegationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressDelegationsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressDelegationsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressDelegationsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about a specific stake account.
   * @summary Specific account address
   * @param {string} stakeAddress Bech32 stake address.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressGet(stakeAddress: string, options?: RawAxiosRequestConfig) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressGet(stakeAddress, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the history of a specific account.
   * @summary Account history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressHistoryGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressHistoryGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressHistoryGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the MIRs of a specific account.
   * @summary Account MIR history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressMirsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressMirsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressMirsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressMirsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the registrations and deregistrations of a specific account.
   * @summary Account registration history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressRegistrationsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressRegistrationsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressRegistrationsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressRegistrationsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the reward history of a specific account.
   * @summary Account reward history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressRewardsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressRewardsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressRewardsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressRewardsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * UTXOs associated with the account.
   * @summary Account UTXOs
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressUtxosGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressUtxosGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressUtxosGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about the withdrawals of a specific account.
   * @summary Account withdrawal history
   * @param {string} stakeAddress Bech32 stake address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AccountsStakeAddressWithdrawalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAccountsApi
   */
  public accountsStakeAddressWithdrawalsGet(
    stakeAddress: string,
    count?: number,
    page?: number,
    order?: AccountsStakeAddressWithdrawalsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAccountsApiFp(this.configuration)
      .accountsStakeAddressWithdrawalsGet(stakeAddress, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const AccountsStakeAddressAddressesAssetsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressAddressesAssetsGetOrderEnum =
  (typeof AccountsStakeAddressAddressesAssetsGetOrderEnum)[keyof typeof AccountsStakeAddressAddressesAssetsGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressAddressesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressAddressesGetOrderEnum =
  (typeof AccountsStakeAddressAddressesGetOrderEnum)[keyof typeof AccountsStakeAddressAddressesGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressDelegationsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressDelegationsGetOrderEnum =
  (typeof AccountsStakeAddressDelegationsGetOrderEnum)[keyof typeof AccountsStakeAddressDelegationsGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressHistoryGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressHistoryGetOrderEnum =
  (typeof AccountsStakeAddressHistoryGetOrderEnum)[keyof typeof AccountsStakeAddressHistoryGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressMirsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressMirsGetOrderEnum =
  (typeof AccountsStakeAddressMirsGetOrderEnum)[keyof typeof AccountsStakeAddressMirsGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressRegistrationsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressRegistrationsGetOrderEnum =
  (typeof AccountsStakeAddressRegistrationsGetOrderEnum)[keyof typeof AccountsStakeAddressRegistrationsGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressRewardsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressRewardsGetOrderEnum =
  (typeof AccountsStakeAddressRewardsGetOrderEnum)[keyof typeof AccountsStakeAddressRewardsGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressUtxosGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressUtxosGetOrderEnum =
  (typeof AccountsStakeAddressUtxosGetOrderEnum)[keyof typeof AccountsStakeAddressUtxosGetOrderEnum];
/**
 * @export
 */
export const AccountsStakeAddressWithdrawalsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AccountsStakeAddressWithdrawalsGetOrderEnum =
  (typeof AccountsStakeAddressWithdrawalsGetOrderEnum)[keyof typeof AccountsStakeAddressWithdrawalsGetOrderEnum];

/**
 * CardanoAddressesApi - axios parameter creator
 * @export
 */
export const CardanoAddressesApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Obtain extended information about a specific address.
     * @summary Extended information of a specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressExtendedGet: async (
      address: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressExtendedGet', 'address', address);
      const localVarPath = `/addresses/{address}/extended`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about a specific address.
     * @summary Specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressGet: async (
      address: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressGet', 'address', address);
      const localVarPath = `/addresses/{address}`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain details about an address.
     * @summary Address details
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressTotalGet: async (
      address: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressTotalGet', 'address', address);
      const localVarPath = `/addresses/{address}/total`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Transactions on the address.
     * @summary Address transactions
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of addresses per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {string} [from] The block number and optionally also index from which (inclusive) to start search for results, concatenated using colon. Has to be lower than or equal to &#x60;to&#x60; parameter.
     * @param {string} [to] The block number and optionally also index where (inclusive) to end the search for results, concatenated using colon. Has to be higher than or equal to &#x60;from&#x60; parameter.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressTransactionsGet: async (
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTransactionsGetOrderEnum,
      from?: string,
      to?: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressTransactionsGet', 'address', address);
      const localVarPath = `/addresses/{address}/transactions`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      if (from !== undefined) {
        localVarQueryParameter['from'] = from;
      }

      if (to !== undefined) {
        localVarQueryParameter['to'] = to;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Transactions on the address.
     * @summary Address txs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of transactions per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    addressesAddressTxsGet: async (
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTxsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressTxsGet', 'address', address);
      const localVarPath = `/addresses/{address}/txs`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs of a given asset
     * @param {string} address Bech32 address.
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosAssetGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressUtxosAssetGet: async (
      address: string,
      asset: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosAssetGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressUtxosAssetGet', 'address', address);
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('addressesAddressUtxosAssetGet', 'asset', asset);
      const localVarPath = `/addresses/{address}/utxos/{asset}`
        .replace(`{${'address'}}`, encodeURIComponent(String(address)))
        .replace(`{${'asset'}}`, encodeURIComponent(String(asset)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressUtxosGet: async (
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('addressesAddressUtxosGet', 'address', address);
      const localVarPath = `/addresses/{address}/utxos`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoAddressesApi - functional programming interface
 * @export
 */
export const CardanoAddressesApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoAddressesApiAxiosParamCreator(configuration);
  return {
    /**
     * Obtain extended information about a specific address.
     * @summary Extended information of a specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressExtendedGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AddressContentExtended>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressExtendedGet(
        address,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressExtendedGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about a specific address.
     * @summary Specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AddressContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressGet(
        address,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain details about an address.
     * @summary Address details
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressTotalGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AddressContentTotal>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressTotalGet(
        address,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressTotalGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Transactions on the address.
     * @summary Address transactions
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of addresses per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {string} [from] The block number and optionally also index from which (inclusive) to start search for results, concatenated using colon. Has to be lower than or equal to &#x60;to&#x60; parameter.
     * @param {string} [to] The block number and optionally also index where (inclusive) to end the search for results, concatenated using colon. Has to be higher than or equal to &#x60;from&#x60; parameter.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressTransactionsGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTransactionsGetOrderEnum,
      from?: string,
      to?: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<AddressTransactionsContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressTransactionsGet(
        address,
        count,
        page,
        order,
        from,
        to,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressTransactionsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Transactions on the address.
     * @summary Address txs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of transactions per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    async addressesAddressTxsGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressTxsGet(
        address,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressTxsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs of a given asset
     * @param {string} address Bech32 address.
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosAssetGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressUtxosAssetGet(
      address: string,
      asset: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosAssetGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AddressUtxoContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressUtxosAssetGet(
        address,
        asset,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressUtxosAssetGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async addressesAddressUtxosGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AddressUtxoContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.addressesAddressUtxosGet(
        address,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAddressesApi.addressesAddressUtxosGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoAddressesApi - factory interface
 * @export
 */
export const CardanoAddressesApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoAddressesApiFp(configuration);
  return {
    /**
     * Obtain extended information about a specific address.
     * @summary Extended information of a specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressExtendedGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<AddressContentExtended> {
      return localVarFp
        .addressesAddressExtendedGet(address, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about a specific address.
     * @summary Specific address
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<AddressContent> {
      return localVarFp
        .addressesAddressGet(address, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain details about an address.
     * @summary Address details
     * @param {string} address Bech32 address.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressTotalGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<AddressContentTotal> {
      return localVarFp
        .addressesAddressTotalGet(address, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Transactions on the address.
     * @summary Address transactions
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of addresses per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {string} [from] The block number and optionally also index from which (inclusive) to start search for results, concatenated using colon. Has to be lower than or equal to &#x60;to&#x60; parameter.
     * @param {string} [to] The block number and optionally also index where (inclusive) to end the search for results, concatenated using colon. Has to be higher than or equal to &#x60;from&#x60; parameter.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressTransactionsGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTransactionsGetOrderEnum,
      from?: string,
      to?: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AddressTransactionsContentInner>> {
      return localVarFp
        .addressesAddressTransactionsGet(address, count, page, order, from, to, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Transactions on the address.
     * @summary Address txs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of transactions per page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    addressesAddressTxsGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .addressesAddressTxsGet(address, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs of a given asset
     * @param {string} address Bech32 address.
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosAssetGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressUtxosAssetGet(
      address: string,
      asset: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosAssetGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AddressUtxoContentInner>> {
      return localVarFp
        .addressesAddressUtxosAssetGet(address, asset, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * UTXOs of the address.
     * @summary Address UTXOs
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AddressesAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addressesAddressUtxosGet(
      address: string,
      count?: number,
      page?: number,
      order?: AddressesAddressUtxosGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AddressUtxoContentInner>> {
      return localVarFp
        .addressesAddressUtxosGet(address, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoAddressesApi - object-oriented interface
 * @export
 * @class CardanoAddressesApi
 * @extends {BaseAPI}
 */
export class CardanoAddressesApi extends BaseAPI {
  /**
   * Obtain extended information about a specific address.
   * @summary Extended information of a specific address
   * @param {string} address Bech32 address.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressExtendedGet(address: string, options?: RawAxiosRequestConfig) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressExtendedGet(address, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about a specific address.
   * @summary Specific address
   * @param {string} address Bech32 address.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressGet(address: string, options?: RawAxiosRequestConfig) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressGet(address, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain details about an address.
   * @summary Address details
   * @param {string} address Bech32 address.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressTotalGet(address: string, options?: RawAxiosRequestConfig) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressTotalGet(address, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Transactions on the address.
   * @summary Address transactions
   * @param {string} address Bech32 address.
   * @param {number} [count] The number of addresses per page.
   * @param {number} [page] The page number for listing the results.
   * @param {AddressesAddressTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {string} [from] The block number and optionally also index from which (inclusive) to start search for results, concatenated using colon. Has to be lower than or equal to &#x60;to&#x60; parameter.
   * @param {string} [to] The block number and optionally also index where (inclusive) to end the search for results, concatenated using colon. Has to be higher than or equal to &#x60;from&#x60; parameter.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressTransactionsGet(
    address: string,
    count?: number,
    page?: number,
    order?: AddressesAddressTransactionsGetOrderEnum,
    from?: string,
    to?: string,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressTransactionsGet(address, count, page, order, from, to, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Transactions on the address.
   * @summary Address txs
   * @param {string} address Bech32 address.
   * @param {number} [count] The number of transactions per page.
   * @param {number} [page] The page number for listing the results.
   * @param {AddressesAddressTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @deprecated
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressTxsGet(
    address: string,
    count?: number,
    page?: number,
    order?: AddressesAddressTxsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressTxsGet(address, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * UTXOs of the address.
   * @summary Address UTXOs of a given asset
   * @param {string} address Bech32 address.
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AddressesAddressUtxosAssetGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressUtxosAssetGet(
    address: string,
    asset: string,
    count?: number,
    page?: number,
    order?: AddressesAddressUtxosAssetGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressUtxosAssetGet(address, asset, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * UTXOs of the address.
   * @summary Address UTXOs
   * @param {string} address Bech32 address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AddressesAddressUtxosGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAddressesApi
   */
  public addressesAddressUtxosGet(
    address: string,
    count?: number,
    page?: number,
    order?: AddressesAddressUtxosGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAddressesApiFp(this.configuration)
      .addressesAddressUtxosGet(address, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const AddressesAddressTransactionsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AddressesAddressTransactionsGetOrderEnum =
  (typeof AddressesAddressTransactionsGetOrderEnum)[keyof typeof AddressesAddressTransactionsGetOrderEnum];
/**
 * @export
 */
export const AddressesAddressTxsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AddressesAddressTxsGetOrderEnum =
  (typeof AddressesAddressTxsGetOrderEnum)[keyof typeof AddressesAddressTxsGetOrderEnum];
/**
 * @export
 */
export const AddressesAddressUtxosAssetGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AddressesAddressUtxosAssetGetOrderEnum =
  (typeof AddressesAddressUtxosAssetGetOrderEnum)[keyof typeof AddressesAddressUtxosAssetGetOrderEnum];
/**
 * @export
 */
export const AddressesAddressUtxosGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AddressesAddressUtxosGetOrderEnum =
  (typeof AddressesAddressUtxosGetOrderEnum)[keyof typeof AddressesAddressUtxosGetOrderEnum];

/**
 * CardanoAssetsApi - axios parameter creator
 * @export
 */
export const CardanoAssetsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List of a addresses containing a specific asset
     * @summary Asset addresses
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetAddressesGet: async (
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetAddressesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('assetsAssetAddressesGet', 'asset', asset);
      const localVarPath = `/assets/{asset}/addresses`.replace(
        `{${'asset'}}`,
        encodeURIComponent(String(asset))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Information about a specific asset
     * @summary Specific asset
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetGet: async (
      asset: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('assetsAssetGet', 'asset', asset);
      const localVarPath = `/assets/{asset}`.replace(
        `{${'asset'}}`,
        encodeURIComponent(String(asset))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of a specific asset
     * @summary Asset history
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetHistoryGet: async (
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetHistoryGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('assetsAssetHistoryGet', 'asset', asset);
      const localVarPath = `/assets/{asset}/history`.replace(
        `{${'asset'}}`,
        encodeURIComponent(String(asset))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of a specific asset transactions
     * @summary Asset transactions
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetTransactionsGet: async (
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTransactionsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('assetsAssetTransactionsGet', 'asset', asset);
      const localVarPath = `/assets/{asset}/transactions`.replace(
        `{${'asset'}}`,
        encodeURIComponent(String(asset))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of a specific asset transactions
     * @summary Asset txs
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    assetsAssetTxsGet: async (
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTxsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'asset' is not null or undefined
      assertParamExists('assetsAssetTxsGet', 'asset', asset);
      const localVarPath = `/assets/{asset}/txs`.replace(
        `{${'asset'}}`,
        encodeURIComponent(String(asset))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of assets. If an asset is completely burned, it will stay on the list with quantity 0 (order of assets is immutable).
     * @summary Assets
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsGet: async (
      count?: number,
      page?: number,
      order?: AssetsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/assets`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of asset minted under a specific policy
     * @summary Assets of a specific policy
     * @param {string} policyId Specific policy_id
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsPolicyPolicyIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsPolicyPolicyIdGet: async (
      policyId: string,
      count?: number,
      page?: number,
      order?: AssetsPolicyPolicyIdGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'policyId' is not null or undefined
      assertParamExists('assetsPolicyPolicyIdGet', 'policyId', policyId);
      const localVarPath = `/assets/policy/{policy_id}`.replace(
        `{${'policy_id'}}`,
        encodeURIComponent(String(policyId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoAssetsApi - functional programming interface
 * @export
 */
export const CardanoAssetsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoAssetsApiAxiosParamCreator(configuration);
  return {
    /**
     * List of a addresses containing a specific asset
     * @summary Asset addresses
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsAssetAddressesGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetAddressesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AssetAddressesInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsAssetAddressesGet(
        asset,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsAssetAddressesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Information about a specific asset
     * @summary Specific asset
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsAssetGet(
      asset: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Asset>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsAssetGet(asset, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsAssetGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of a specific asset
     * @summary Asset history
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsAssetHistoryGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AssetHistoryInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsAssetHistoryGet(
        asset,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsAssetHistoryGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of a specific asset transactions
     * @summary Asset transactions
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsAssetTransactionsGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTransactionsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AssetTransactionsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsAssetTransactionsGet(
        asset,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsAssetTransactionsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of a specific asset transactions
     * @summary Asset txs
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    async assetsAssetTxsGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsAssetTxsGet(
        asset,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsAssetTxsGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of assets. If an asset is completely burned, it will stay on the list with quantity 0 (order of assets is immutable).
     * @summary Assets
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsGet(
      count?: number,
      page?: number,
      order?: AssetsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AssetsInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of asset minted under a specific policy
     * @summary Assets of a specific policy
     * @param {string} policyId Specific policy_id
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsPolicyPolicyIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async assetsPolicyPolicyIdGet(
      policyId: string,
      count?: number,
      page?: number,
      order?: AssetsPolicyPolicyIdGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AssetPolicyInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.assetsPolicyPolicyIdGet(
        policyId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoAssetsApi.assetsPolicyPolicyIdGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoAssetsApi - factory interface
 * @export
 */
export const CardanoAssetsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoAssetsApiFp(configuration);
  return {
    /**
     * List of a addresses containing a specific asset
     * @summary Asset addresses
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetAddressesGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetAddressesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AssetAddressesInner>> {
      return localVarFp
        .assetsAssetAddressesGet(asset, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Information about a specific asset
     * @summary Specific asset
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetGet(asset: string, options?: RawAxiosRequestConfig): AxiosPromise<Asset> {
      return localVarFp.assetsAssetGet(asset, options).then((request) => request(axios, basePath));
    },
    /**
     * History of a specific asset
     * @summary Asset history
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetHistoryGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AssetHistoryInner>> {
      return localVarFp
        .assetsAssetHistoryGet(asset, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of a specific asset transactions
     * @summary Asset transactions
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsAssetTransactionsGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTransactionsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AssetTransactionsInner>> {
      return localVarFp
        .assetsAssetTransactionsGet(asset, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of a specific asset transactions
     * @summary Asset txs
     * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsAssetTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     */
    assetsAssetTxsGet(
      asset: string,
      count?: number,
      page?: number,
      order?: AssetsAssetTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .assetsAssetTxsGet(asset, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of assets. If an asset is completely burned, it will stay on the list with quantity 0 (order of assets is immutable).
     * @summary Assets
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsGet(
      count?: number,
      page?: number,
      order?: AssetsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AssetsInner>> {
      return localVarFp
        .assetsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of asset minted under a specific policy
     * @summary Assets of a specific policy
     * @param {string} policyId Specific policy_id
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {AssetsPolicyPolicyIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    assetsPolicyPolicyIdGet(
      policyId: string,
      count?: number,
      page?: number,
      order?: AssetsPolicyPolicyIdGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<AssetPolicyInner>> {
      return localVarFp
        .assetsPolicyPolicyIdGet(policyId, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoAssetsApi - object-oriented interface
 * @export
 * @class CardanoAssetsApi
 * @extends {BaseAPI}
 */
export class CardanoAssetsApi extends BaseAPI {
  /**
   * List of a addresses containing a specific asset
   * @summary Asset addresses
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsAssetAddressesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsAssetAddressesGet(
    asset: string,
    count?: number,
    page?: number,
    order?: AssetsAssetAddressesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsAssetAddressesGet(asset, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Information about a specific asset
   * @summary Specific asset
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsAssetGet(asset: string, options?: RawAxiosRequestConfig) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsAssetGet(asset, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of a specific asset
   * @summary Asset history
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsAssetHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsAssetHistoryGet(
    asset: string,
    count?: number,
    page?: number,
    order?: AssetsAssetHistoryGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsAssetHistoryGet(asset, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of a specific asset transactions
   * @summary Asset transactions
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsAssetTransactionsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsAssetTransactionsGet(
    asset: string,
    count?: number,
    page?: number,
    order?: AssetsAssetTransactionsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsAssetTransactionsGet(asset, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of a specific asset transactions
   * @summary Asset txs
   * @param {string} asset Concatenation of the policy_id and hex-encoded asset_name
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsAssetTxsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @deprecated
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsAssetTxsGet(
    asset: string,
    count?: number,
    page?: number,
    order?: AssetsAssetTxsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsAssetTxsGet(asset, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of assets. If an asset is completely burned, it will stay on the list with quantity 0 (order of assets is immutable).
   * @summary Assets
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsGet(
    count?: number,
    page?: number,
    order?: AssetsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of asset minted under a specific policy
   * @summary Assets of a specific policy
   * @param {string} policyId Specific policy_id
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {AssetsPolicyPolicyIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoAssetsApi
   */
  public assetsPolicyPolicyIdGet(
    policyId: string,
    count?: number,
    page?: number,
    order?: AssetsPolicyPolicyIdGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoAssetsApiFp(this.configuration)
      .assetsPolicyPolicyIdGet(policyId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const AssetsAssetAddressesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsAssetAddressesGetOrderEnum =
  (typeof AssetsAssetAddressesGetOrderEnum)[keyof typeof AssetsAssetAddressesGetOrderEnum];
/**
 * @export
 */
export const AssetsAssetHistoryGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsAssetHistoryGetOrderEnum =
  (typeof AssetsAssetHistoryGetOrderEnum)[keyof typeof AssetsAssetHistoryGetOrderEnum];
/**
 * @export
 */
export const AssetsAssetTransactionsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsAssetTransactionsGetOrderEnum =
  (typeof AssetsAssetTransactionsGetOrderEnum)[keyof typeof AssetsAssetTransactionsGetOrderEnum];
/**
 * @export
 */
export const AssetsAssetTxsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsAssetTxsGetOrderEnum =
  (typeof AssetsAssetTxsGetOrderEnum)[keyof typeof AssetsAssetTxsGetOrderEnum];
/**
 * @export
 */
export const AssetsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsGetOrderEnum = (typeof AssetsGetOrderEnum)[keyof typeof AssetsGetOrderEnum];
/**
 * @export
 */
export const AssetsPolicyPolicyIdGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type AssetsPolicyPolicyIdGetOrderEnum =
  (typeof AssetsPolicyPolicyIdGetOrderEnum)[keyof typeof AssetsPolicyPolicyIdGetOrderEnum];

/**
 * CardanoBlocksApi - axios parameter creator
 * @export
 */
export const CardanoBlocksApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Return the content of a requested block for a specific slot in an epoch.
     * @summary Specific block in a slot in an epoch
     * @param {number} epochNumber Epoch for specific epoch slot.
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksEpochEpochNumberSlotSlotNumberGet: async (
      epochNumber: number,
      slotNumber: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'epochNumber' is not null or undefined
      assertParamExists('blocksEpochEpochNumberSlotSlotNumberGet', 'epochNumber', epochNumber);
      // verify required parameter 'slotNumber' is not null or undefined
      assertParamExists('blocksEpochEpochNumberSlotSlotNumberGet', 'slotNumber', slotNumber);
      const localVarPath = `/blocks/epoch/{epoch_number}/slot/{slot_number}`
        .replace(`{${'epoch_number'}}`, encodeURIComponent(String(epochNumber)))
        .replace(`{${'slot_number'}}`, encodeURIComponent(String(slotNumber)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return list of addresses affected in the specified block with additional information, sorted by the bech32 address, ascending.
     * @summary Addresses affected in a specific block
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberAddressesGet: async (
      hashOrNumber: string,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberAddressesGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}/addresses`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the content of a requested block.
     * @summary Specific block
     * @param {string} hashOrNumber Hash or number of the requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberGet: async (
      hashOrNumber: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the list of blocks following a specific block.
     * @summary Listing of next blocks
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberNextGet: async (
      hashOrNumber: string,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberNextGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}/next`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the list of blocks preceding a specific block.
     * @summary Listing of previous blocks
     * @param {string} hashOrNumber Hash of the requested block
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberPreviousGet: async (
      hashOrNumber: string,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberPreviousGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}/previous`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the transactions within the block, including CBOR representations.
     * @summary Block transactions with CBOR data
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberTxsCborGet: async (
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsCborGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberTxsCborGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}/txs/cbor`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the transactions within the block.
     * @summary Block transactions
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberTxsGet: async (
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hashOrNumber' is not null or undefined
      assertParamExists('blocksHashOrNumberTxsGet', 'hashOrNumber', hashOrNumber);
      const localVarPath = `/blocks/{hash_or_number}/txs`.replace(
        `{${'hash_or_number'}}`,
        encodeURIComponent(String(hashOrNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the latest block available to the backends, also known as the tip of the blockchain.
     * @summary Latest block
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/blocks/latest`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the transactions within the latest block, including CBOR representations.
     * @summary Latest block transactions with CBOR data
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestTxsCborGet: async (
      count?: number,
      page?: number,
      order?: BlocksLatestTxsCborGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/blocks/latest/txs/cbor`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the transactions within the latest block.
     * @summary Latest block transactions
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestTxsGet: async (
      count?: number,
      page?: number,
      order?: BlocksLatestTxsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/blocks/latest/txs`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the content of a requested block for a specific slot.
     * @summary Specific block in a slot
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksSlotSlotNumberGet: async (
      slotNumber: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'slotNumber' is not null or undefined
      assertParamExists('blocksSlotSlotNumberGet', 'slotNumber', slotNumber);
      const localVarPath = `/blocks/slot/{slot_number}`.replace(
        `{${'slot_number'}}`,
        encodeURIComponent(String(slotNumber))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoBlocksApi - functional programming interface
 * @export
 */
export const CardanoBlocksApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoBlocksApiAxiosParamCreator(configuration);
  return {
    /**
     * Return the content of a requested block for a specific slot in an epoch.
     * @summary Specific block in a slot in an epoch
     * @param {number} epochNumber Epoch for specific epoch slot.
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksEpochEpochNumberSlotSlotNumberGet(
      epochNumber: number,
      slotNumber: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BlockContent>> {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.blocksEpochEpochNumberSlotSlotNumberGet(
          epochNumber,
          slotNumber,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksEpochEpochNumberSlotSlotNumberGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return list of addresses affected in the specified block with additional information, sorted by the bech32 address, ascending.
     * @summary Addresses affected in a specific block
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberAddressesGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BlockContentAddressesInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberAddressesGet(
        hashOrNumber,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberAddressesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the content of a requested block.
     * @summary Specific block
     * @param {string} hashOrNumber Hash or number of the requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberGet(
      hashOrNumber: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BlockContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberGet(
        hashOrNumber,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the list of blocks following a specific block.
     * @summary Listing of next blocks
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberNextGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BlockContent>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberNextGet(
        hashOrNumber,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberNextGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the list of blocks preceding a specific block.
     * @summary Listing of previous blocks
     * @param {string} hashOrNumber Hash of the requested block
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberPreviousGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BlockContent>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberPreviousGet(
        hashOrNumber,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberPreviousGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the transactions within the block, including CBOR representations.
     * @summary Block transactions with CBOR data
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberTxsCborGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BlockContentTxsCborInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberTxsCborGet(
        hashOrNumber,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberTxsCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the transactions within the block.
     * @summary Block transactions
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksHashOrNumberTxsGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksHashOrNumberTxsGet(
        hashOrNumber,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksHashOrNumberTxsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the latest block available to the backends, also known as the tip of the blockchain.
     * @summary Latest block
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksLatestGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BlockContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksLatestGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksLatestGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the transactions within the latest block, including CBOR representations.
     * @summary Latest block transactions with CBOR data
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksLatestTxsCborGet(
      count?: number,
      page?: number,
      order?: BlocksLatestTxsCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BlockContentTxsCborInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksLatestTxsCborGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksLatestTxsCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the transactions within the latest block.
     * @summary Latest block transactions
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksLatestTxsGet(
      count?: number,
      page?: number,
      order?: BlocksLatestTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksLatestTxsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksLatestTxsGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the content of a requested block for a specific slot.
     * @summary Specific block in a slot
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async blocksSlotSlotNumberGet(
      slotNumber: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BlockContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.blocksSlotSlotNumberGet(
        slotNumber,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoBlocksApi.blocksSlotSlotNumberGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoBlocksApi - factory interface
 * @export
 */
export const CardanoBlocksApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoBlocksApiFp(configuration);
  return {
    /**
     * Return the content of a requested block for a specific slot in an epoch.
     * @summary Specific block in a slot in an epoch
     * @param {number} epochNumber Epoch for specific epoch slot.
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksEpochEpochNumberSlotSlotNumberGet(
      epochNumber: number,
      slotNumber: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<BlockContent> {
      return localVarFp
        .blocksEpochEpochNumberSlotSlotNumberGet(epochNumber, slotNumber, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return list of addresses affected in the specified block with additional information, sorted by the bech32 address, ascending.
     * @summary Addresses affected in a specific block
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberAddressesGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<BlockContentAddressesInner>> {
      return localVarFp
        .blocksHashOrNumberAddressesGet(hashOrNumber, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the content of a requested block.
     * @summary Specific block
     * @param {string} hashOrNumber Hash or number of the requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberGet(
      hashOrNumber: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<BlockContent> {
      return localVarFp
        .blocksHashOrNumberGet(hashOrNumber, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the list of blocks following a specific block.
     * @summary Listing of next blocks
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberNextGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<BlockContent>> {
      return localVarFp
        .blocksHashOrNumberNextGet(hashOrNumber, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the list of blocks preceding a specific block.
     * @summary Listing of previous blocks
     * @param {string} hashOrNumber Hash of the requested block
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberPreviousGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<BlockContent>> {
      return localVarFp
        .blocksHashOrNumberPreviousGet(hashOrNumber, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the transactions within the block, including CBOR representations.
     * @summary Block transactions with CBOR data
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberTxsCborGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<BlockContentTxsCborInner>> {
      return localVarFp
        .blocksHashOrNumberTxsCborGet(hashOrNumber, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the transactions within the block.
     * @summary Block transactions
     * @param {string} hashOrNumber Hash of the requested block.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksHashOrNumberTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksHashOrNumberTxsGet(
      hashOrNumber: string,
      count?: number,
      page?: number,
      order?: BlocksHashOrNumberTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .blocksHashOrNumberTxsGet(hashOrNumber, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the latest block available to the backends, also known as the tip of the blockchain.
     * @summary Latest block
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestGet(options?: RawAxiosRequestConfig): AxiosPromise<BlockContent> {
      return localVarFp.blocksLatestGet(options).then((request) => request(axios, basePath));
    },
    /**
     * Return the transactions within the latest block, including CBOR representations.
     * @summary Latest block transactions with CBOR data
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestTxsCborGet(
      count?: number,
      page?: number,
      order?: BlocksLatestTxsCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<BlockContentTxsCborInner>> {
      return localVarFp
        .blocksLatestTxsCborGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the transactions within the latest block.
     * @summary Latest block transactions
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {BlocksLatestTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksLatestTxsGet(
      count?: number,
      page?: number,
      order?: BlocksLatestTxsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .blocksLatestTxsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the content of a requested block for a specific slot.
     * @summary Specific block in a slot
     * @param {number} slotNumber Slot position for requested block.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    blocksSlotSlotNumberGet(
      slotNumber: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<BlockContent> {
      return localVarFp
        .blocksSlotSlotNumberGet(slotNumber, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoBlocksApi - object-oriented interface
 * @export
 * @class CardanoBlocksApi
 * @extends {BaseAPI}
 */
export class CardanoBlocksApi extends BaseAPI {
  /**
   * Return the content of a requested block for a specific slot in an epoch.
   * @summary Specific block in a slot in an epoch
   * @param {number} epochNumber Epoch for specific epoch slot.
   * @param {number} slotNumber Slot position for requested block.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksEpochEpochNumberSlotSlotNumberGet(
    epochNumber: number,
    slotNumber: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksEpochEpochNumberSlotSlotNumberGet(epochNumber, slotNumber, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return list of addresses affected in the specified block with additional information, sorted by the bech32 address, ascending.
   * @summary Addresses affected in a specific block
   * @param {string} hashOrNumber Hash of the requested block.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberAddressesGet(
    hashOrNumber: string,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberAddressesGet(hashOrNumber, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the content of a requested block.
   * @summary Specific block
   * @param {string} hashOrNumber Hash or number of the requested block.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberGet(hashOrNumber: string, options?: RawAxiosRequestConfig) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberGet(hashOrNumber, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the list of blocks following a specific block.
   * @summary Listing of next blocks
   * @param {string} hashOrNumber Hash of the requested block.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberNextGet(
    hashOrNumber: string,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberNextGet(hashOrNumber, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the list of blocks preceding a specific block.
   * @summary Listing of previous blocks
   * @param {string} hashOrNumber Hash of the requested block
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberPreviousGet(
    hashOrNumber: string,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberPreviousGet(hashOrNumber, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the transactions within the block, including CBOR representations.
   * @summary Block transactions with CBOR data
   * @param {string} hashOrNumber Hash of the requested block.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {BlocksHashOrNumberTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberTxsCborGet(
    hashOrNumber: string,
    count?: number,
    page?: number,
    order?: BlocksHashOrNumberTxsCborGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberTxsCborGet(hashOrNumber, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the transactions within the block.
   * @summary Block transactions
   * @param {string} hashOrNumber Hash of the requested block.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {BlocksHashOrNumberTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksHashOrNumberTxsGet(
    hashOrNumber: string,
    count?: number,
    page?: number,
    order?: BlocksHashOrNumberTxsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksHashOrNumberTxsGet(hashOrNumber, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the latest block available to the backends, also known as the tip of the blockchain.
   * @summary Latest block
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksLatestGet(options?: RawAxiosRequestConfig) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksLatestGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the transactions within the latest block, including CBOR representations.
   * @summary Latest block transactions with CBOR data
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {BlocksLatestTxsCborGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksLatestTxsCborGet(
    count?: number,
    page?: number,
    order?: BlocksLatestTxsCborGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksLatestTxsCborGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the transactions within the latest block.
   * @summary Latest block transactions
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {BlocksLatestTxsGetOrderEnum} [order] Ordered by tx index in the block. The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksLatestTxsGet(
    count?: number,
    page?: number,
    order?: BlocksLatestTxsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksLatestTxsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the content of a requested block for a specific slot.
   * @summary Specific block in a slot
   * @param {number} slotNumber Slot position for requested block.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoBlocksApi
   */
  public blocksSlotSlotNumberGet(slotNumber: number, options?: RawAxiosRequestConfig) {
    return CardanoBlocksApiFp(this.configuration)
      .blocksSlotSlotNumberGet(slotNumber, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const BlocksHashOrNumberTxsCborGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type BlocksHashOrNumberTxsCborGetOrderEnum =
  (typeof BlocksHashOrNumberTxsCborGetOrderEnum)[keyof typeof BlocksHashOrNumberTxsCborGetOrderEnum];
/**
 * @export
 */
export const BlocksHashOrNumberTxsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type BlocksHashOrNumberTxsGetOrderEnum =
  (typeof BlocksHashOrNumberTxsGetOrderEnum)[keyof typeof BlocksHashOrNumberTxsGetOrderEnum];
/**
 * @export
 */
export const BlocksLatestTxsCborGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type BlocksLatestTxsCborGetOrderEnum =
  (typeof BlocksLatestTxsCborGetOrderEnum)[keyof typeof BlocksLatestTxsCborGetOrderEnum];
/**
 * @export
 */
export const BlocksLatestTxsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type BlocksLatestTxsGetOrderEnum =
  (typeof BlocksLatestTxsGetOrderEnum)[keyof typeof BlocksLatestTxsGetOrderEnum];

/**
 * CardanoEpochsApi - axios parameter creator
 * @export
 */
export const CardanoEpochsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Return the information about the latest, therefore current, epoch.
     * @summary Latest epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsLatestGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/epochs/latest`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the protocol parameters for the latest epoch.
     * @summary Latest epoch protocol parameters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsLatestParametersGet: async (
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/epochs/latest/parameters`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the blocks minted for the epoch specified.
     * @summary Block distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberBlocksGet: async (
      number: number,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberBlocksGet', 'number', number);
      const localVarPath = `/epochs/{number}/blocks`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the block minted for the epoch specified by stake pool.
     * @summary Block distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksPoolIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberBlocksPoolIdGet: async (
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksPoolIdGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberBlocksPoolIdGet', 'number', number);
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('epochsNumberBlocksPoolIdGet', 'poolId', poolId);
      const localVarPath = `/epochs/{number}/blocks/{pool_id}`
        .replace(`{${'number'}}`, encodeURIComponent(String(number)))
        .replace(`{${'pool_id'}}`, encodeURIComponent(String(poolId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the content of the requested epoch.
     * @summary Specific epoch
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberGet: async (
      number: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberGet', 'number', number);
      const localVarPath = `/epochs/{number}`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the list of epochs following a specific epoch.
     * @summary Listing of next epochs
     * @param {number} number Number of the requested epoch.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberNextGet: async (
      number: number,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberNextGet', 'number', number);
      const localVarPath = `/epochs/{number}/next`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the protocol parameters for the epoch specified.
     * @summary Protocol parameters
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberParametersGet: async (
      number: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberParametersGet', 'number', number);
      const localVarPath = `/epochs/{number}/parameters`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the list of epochs preceding a specific epoch.
     * @summary Listing of previous epochs
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberPreviousGet: async (
      number: number,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberPreviousGet', 'number', number);
      const localVarPath = `/epochs/{number}/previous`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the active stake distribution for the specified epoch.
     * @summary Stake distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberStakesGet: async (
      number: number,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberStakesGet', 'number', number);
      const localVarPath = `/epochs/{number}/stakes`.replace(
        `{${'number'}}`,
        encodeURIComponent(String(number))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the active stake distribution for the epoch specified by stake pool.
     * @summary Stake distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberStakesPoolIdGet: async (
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'number' is not null or undefined
      assertParamExists('epochsNumberStakesPoolIdGet', 'number', number);
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('epochsNumberStakesPoolIdGet', 'poolId', poolId);
      const localVarPath = `/epochs/{number}/stakes/{pool_id}`
        .replace(`{${'number'}}`, encodeURIComponent(String(number)))
        .replace(`{${'pool_id'}}`, encodeURIComponent(String(poolId)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoEpochsApi - functional programming interface
 * @export
 */
export const CardanoEpochsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoEpochsApiAxiosParamCreator(configuration);
  return {
    /**
     * Return the information about the latest, therefore current, epoch.
     * @summary Latest epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsLatestGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EpochContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsLatestGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsLatestGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the protocol parameters for the latest epoch.
     * @summary Latest epoch protocol parameters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsLatestParametersGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EpochParamContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsLatestParametersGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsLatestParametersGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the blocks minted for the epoch specified.
     * @summary Block distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberBlocksGet(
      number: number,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberBlocksGet(
        number,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberBlocksGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the block minted for the epoch specified by stake pool.
     * @summary Block distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksPoolIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberBlocksPoolIdGet(
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksPoolIdGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberBlocksPoolIdGet(
        number,
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberBlocksPoolIdGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the content of the requested epoch.
     * @summary Specific epoch
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberGet(
      number: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EpochContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberGet(number, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the list of epochs following a specific epoch.
     * @summary Listing of next epochs
     * @param {number} number Number of the requested epoch.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberNextGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EpochContent>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberNextGet(
        number,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberNextGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the protocol parameters for the epoch specified.
     * @summary Protocol parameters
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberParametersGet(
      number: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EpochParamContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberParametersGet(
        number,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberParametersGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the list of epochs preceding a specific epoch.
     * @summary Listing of previous epochs
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberPreviousGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EpochContent>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberPreviousGet(
        number,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberPreviousGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the active stake distribution for the specified epoch.
     * @summary Stake distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberStakesGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EpochStakeContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberStakesGet(
        number,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberStakesGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the active stake distribution for the epoch specified by stake pool.
     * @summary Stake distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async epochsNumberStakesPoolIdGet(
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EpochStakePoolContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.epochsNumberStakesPoolIdGet(
        number,
        poolId,
        count,
        page,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoEpochsApi.epochsNumberStakesPoolIdGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoEpochsApi - factory interface
 * @export
 */
export const CardanoEpochsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoEpochsApiFp(configuration);
  return {
    /**
     * Return the information about the latest, therefore current, epoch.
     * @summary Latest epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsLatestGet(options?: RawAxiosRequestConfig): AxiosPromise<EpochContent> {
      return localVarFp.epochsLatestGet(options).then((request) => request(axios, basePath));
    },
    /**
     * Return the protocol parameters for the latest epoch.
     * @summary Latest epoch protocol parameters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsLatestParametersGet(options?: RawAxiosRequestConfig): AxiosPromise<EpochParamContent> {
      return localVarFp
        .epochsLatestParametersGet(options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the blocks minted for the epoch specified.
     * @summary Block distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberBlocksGet(
      number: number,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .epochsNumberBlocksGet(number, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the block minted for the epoch specified by stake pool.
     * @summary Block distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {EpochsNumberBlocksPoolIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberBlocksPoolIdGet(
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      order?: EpochsNumberBlocksPoolIdGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .epochsNumberBlocksPoolIdGet(number, poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the content of the requested epoch.
     * @summary Specific epoch
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberGet(number: number, options?: RawAxiosRequestConfig): AxiosPromise<EpochContent> {
      return localVarFp
        .epochsNumberGet(number, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the list of epochs following a specific epoch.
     * @summary Listing of next epochs
     * @param {number} number Number of the requested epoch.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberNextGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<EpochContent>> {
      return localVarFp
        .epochsNumberNextGet(number, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the protocol parameters for the epoch specified.
     * @summary Protocol parameters
     * @param {number} number Number of the epoch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberParametersGet(
      number: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<EpochParamContent> {
      return localVarFp
        .epochsNumberParametersGet(number, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the list of epochs preceding a specific epoch.
     * @summary Listing of previous epochs
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberPreviousGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<EpochContent>> {
      return localVarFp
        .epochsNumberPreviousGet(number, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the active stake distribution for the specified epoch.
     * @summary Stake distribution
     * @param {number} number Number of the epoch
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberStakesGet(
      number: number,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<EpochStakeContentInner>> {
      return localVarFp
        .epochsNumberStakesGet(number, count, page, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the active stake distribution for the epoch specified by stake pool.
     * @summary Stake distribution by pool
     * @param {number} number Number of the epoch
     * @param {string} poolId Stake pool ID to filter
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    epochsNumberStakesPoolIdGet(
      number: number,
      poolId: string,
      count?: number,
      page?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<EpochStakePoolContentInner>> {
      return localVarFp
        .epochsNumberStakesPoolIdGet(number, poolId, count, page, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoEpochsApi - object-oriented interface
 * @export
 * @class CardanoEpochsApi
 * @extends {BaseAPI}
 */
export class CardanoEpochsApi extends BaseAPI {
  /**
   * Return the information about the latest, therefore current, epoch.
   * @summary Latest epoch
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsLatestGet(options?: RawAxiosRequestConfig) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsLatestGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the protocol parameters for the latest epoch.
   * @summary Latest epoch protocol parameters
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsLatestParametersGet(options?: RawAxiosRequestConfig) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsLatestParametersGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the blocks minted for the epoch specified.
   * @summary Block distribution
   * @param {number} number Number of the epoch
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {EpochsNumberBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberBlocksGet(
    number: number,
    count?: number,
    page?: number,
    order?: EpochsNumberBlocksGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberBlocksGet(number, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the block minted for the epoch specified by stake pool.
   * @summary Block distribution by pool
   * @param {number} number Number of the epoch
   * @param {string} poolId Stake pool ID to filter
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {EpochsNumberBlocksPoolIdGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberBlocksPoolIdGet(
    number: number,
    poolId: string,
    count?: number,
    page?: number,
    order?: EpochsNumberBlocksPoolIdGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberBlocksPoolIdGet(number, poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the content of the requested epoch.
   * @summary Specific epoch
   * @param {number} number Number of the epoch
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberGet(number: number, options?: RawAxiosRequestConfig) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberGet(number, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the list of epochs following a specific epoch.
   * @summary Listing of next epochs
   * @param {number} number Number of the requested epoch.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberNextGet(
    number: number,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberNextGet(number, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the protocol parameters for the epoch specified.
   * @summary Protocol parameters
   * @param {number} number Number of the epoch
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberParametersGet(number: number, options?: RawAxiosRequestConfig) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberParametersGet(number, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the list of epochs preceding a specific epoch.
   * @summary Listing of previous epochs
   * @param {number} number Number of the epoch
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberPreviousGet(
    number: number,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberPreviousGet(number, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the active stake distribution for the specified epoch.
   * @summary Stake distribution
   * @param {number} number Number of the epoch
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberStakesGet(
    number: number,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberStakesGet(number, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the active stake distribution for the epoch specified by stake pool.
   * @summary Stake distribution by pool
   * @param {number} number Number of the epoch
   * @param {string} poolId Stake pool ID to filter
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoEpochsApi
   */
  public epochsNumberStakesPoolIdGet(
    number: number,
    poolId: string,
    count?: number,
    page?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoEpochsApiFp(this.configuration)
      .epochsNumberStakesPoolIdGet(number, poolId, count, page, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const EpochsNumberBlocksGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type EpochsNumberBlocksGetOrderEnum =
  (typeof EpochsNumberBlocksGetOrderEnum)[keyof typeof EpochsNumberBlocksGetOrderEnum];
/**
 * @export
 */
export const EpochsNumberBlocksPoolIdGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type EpochsNumberBlocksPoolIdGetOrderEnum =
  (typeof EpochsNumberBlocksPoolIdGetOrderEnum)[keyof typeof EpochsNumberBlocksPoolIdGetOrderEnum];

/**
 * CardanoGovernanceApi - axios parameter creator
 * @export
 */
export const CardanoGovernanceApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List of Drep delegators.
     * @summary DRep delegators
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdDelegatorsGet: async (
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdDelegatorsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'drepId' is not null or undefined
      assertParamExists('governanceDrepsDrepIdDelegatorsGet', 'drepId', drepId);
      const localVarPath = `/governance/dreps/{drep_id}/delegators`.replace(
        `{${'drep_id'}}`,
        encodeURIComponent(String(drepId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * DRep information.
     * @summary Specific DRep
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdGet: async (
      drepId: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'drepId' is not null or undefined
      assertParamExists('governanceDrepsDrepIdGet', 'drepId', drepId);
      const localVarPath = `/governance/dreps/{drep_id}`.replace(
        `{${'drep_id'}}`,
        encodeURIComponent(String(drepId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * DRep metadata information.
     * @summary DRep metadata
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdMetadataGet: async (
      drepId: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'drepId' is not null or undefined
      assertParamExists('governanceDrepsDrepIdMetadataGet', 'drepId', drepId);
      const localVarPath = `/governance/dreps/{drep_id}/metadata`.replace(
        `{${'drep_id'}}`,
        encodeURIComponent(String(drepId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of certificate updates to the DRep.
     * @summary DRep updates
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdUpdatesGet: async (
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdUpdatesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'drepId' is not null or undefined
      assertParamExists('governanceDrepsDrepIdUpdatesGet', 'drepId', drepId);
      const localVarPath = `/governance/dreps/{drep_id}/updates`.replace(
        `{${'drep_id'}}`,
        encodeURIComponent(String(drepId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of Drep votes.
     * @summary DRep votes
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdVotesGet: async (
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdVotesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'drepId' is not null or undefined
      assertParamExists('governanceDrepsDrepIdVotesGet', 'drepId', drepId);
      const localVarPath = `/governance/dreps/{drep_id}/votes`.replace(
        `{${'drep_id'}}`,
        encodeURIComponent(String(drepId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the information about Delegate Representatives (DReps)
     * @summary Delegate Representatives (DReps)
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsGet: async (
      count?: number,
      page?: number,
      order?: GovernanceDrepsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/governance/dreps`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the information about Proposals
     * @summary Proposals
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsGet: async (
      count?: number,
      page?: number,
      order?: GovernanceProposalsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/governance/proposals`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Proposal information.
     * @summary Specific proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexGet: async (
      txHash: string,
      certIndex: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'txHash' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexGet', 'txHash', txHash);
      // verify required parameter 'certIndex' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexGet', 'certIndex', certIndex);
      const localVarPath = `/governance/proposals/{tx_hash}/{cert_index}`
        .replace(`{${'tx_hash'}}`, encodeURIComponent(String(txHash)))
        .replace(`{${'cert_index'}}`, encodeURIComponent(String(certIndex)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Proposal metadata information.
     * @summary Specific proposal metadata
     * @param {string} txHash Transaction hash of the proposal.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexMetadataGet: async (
      txHash: string,
      certIndex: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'txHash' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexMetadataGet', 'txHash', txHash);
      // verify required parameter 'certIndex' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexMetadataGet', 'certIndex', certIndex);
      const localVarPath = `/governance/proposals/{tx_hash}/{cert_index}/metadata`
        .replace(`{${'tx_hash'}}`, encodeURIComponent(String(txHash)))
        .replace(`{${'cert_index'}}`, encodeURIComponent(String(certIndex)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Parameters proposal details.
     * @summary Specific parameters proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexParametersGet: async (
      txHash: string,
      certIndex: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'txHash' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexParametersGet', 'txHash', txHash);
      // verify required parameter 'certIndex' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexParametersGet', 'certIndex', certIndex);
      const localVarPath = `/governance/proposals/{tx_hash}/{cert_index}/parameters`
        .replace(`{${'tx_hash'}}`, encodeURIComponent(String(txHash)))
        .replace(`{${'cert_index'}}`, encodeURIComponent(String(certIndex)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of Proposal votes.
     * @summary Proposal votes
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsTxHashCertIndexVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexVotesGet: async (
      txHash: string,
      certIndex: number,
      count?: number,
      page?: number,
      order?: GovernanceProposalsTxHashCertIndexVotesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'txHash' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexVotesGet', 'txHash', txHash);
      // verify required parameter 'certIndex' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexVotesGet', 'certIndex', certIndex);
      const localVarPath = `/governance/proposals/{tx_hash}/{cert_index}/votes`
        .replace(`{${'tx_hash'}}`, encodeURIComponent(String(txHash)))
        .replace(`{${'cert_index'}}`, encodeURIComponent(String(certIndex)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Withdrawal proposal details.
     * @summary Specific withdrawals proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexWithdrawalsGet: async (
      txHash: string,
      certIndex: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'txHash' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexWithdrawalsGet', 'txHash', txHash);
      // verify required parameter 'certIndex' is not null or undefined
      assertParamExists('governanceProposalsTxHashCertIndexWithdrawalsGet', 'certIndex', certIndex);
      const localVarPath = `/governance/proposals/{tx_hash}/{cert_index}/withdrawals`
        .replace(`{${'tx_hash'}}`, encodeURIComponent(String(txHash)))
        .replace(`{${'cert_index'}}`, encodeURIComponent(String(certIndex)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoGovernanceApi - functional programming interface
 * @export
 */
export const CardanoGovernanceApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoGovernanceApiAxiosParamCreator(configuration);
  return {
    /**
     * List of Drep delegators.
     * @summary DRep delegators
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsDrepIdDelegatorsGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdDelegatorsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DrepDelegatorsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsDrepIdDelegatorsGet(
        drepId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsDrepIdDelegatorsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * DRep information.
     * @summary Specific DRep
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsDrepIdGet(
      drepId: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Drep>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsDrepIdGet(
        drepId,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsDrepIdGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * DRep metadata information.
     * @summary DRep metadata
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsDrepIdMetadataGet(
      drepId: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DrepMetadata>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsDrepIdMetadataGet(
        drepId,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsDrepIdMetadataGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of certificate updates to the DRep.
     * @summary DRep updates
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsDrepIdUpdatesGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdUpdatesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DrepUpdatesInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsDrepIdUpdatesGet(
        drepId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsDrepIdUpdatesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of Drep votes.
     * @summary DRep votes
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsDrepIdVotesGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DrepVotesInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsDrepIdVotesGet(
        drepId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsDrepIdVotesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the information about Delegate Representatives (DReps)
     * @summary Delegate Representatives (DReps)
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceDrepsGet(
      count?: number,
      page?: number,
      order?: GovernanceDrepsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DrepsInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceDrepsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceDrepsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the information about Proposals
     * @summary Proposals
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsGet(
      count?: number,
      page?: number,
      order?: GovernanceProposalsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ProposalsInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.governanceProposalsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceProposalsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Proposal information.
     * @summary Specific proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsTxHashCertIndexGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Proposal>> {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.governanceProposalsTxHashCertIndexGet(
          txHash,
          certIndex,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceProposalsTxHashCertIndexGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Proposal metadata information.
     * @summary Specific proposal metadata
     * @param {string} txHash Transaction hash of the proposal.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsTxHashCertIndexMetadataGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProposalMetadata>> {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.governanceProposalsTxHashCertIndexMetadataGet(
          txHash,
          certIndex,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceProposalsTxHashCertIndexMetadataGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Parameters proposal details.
     * @summary Specific parameters proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsTxHashCertIndexParametersGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ProposalParameters>> {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.governanceProposalsTxHashCertIndexParametersGet(
          txHash,
          certIndex,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap[
          'CardanoGovernanceApi.governanceProposalsTxHashCertIndexParametersGet'
        ]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of Proposal votes.
     * @summary Proposal votes
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsTxHashCertIndexVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsTxHashCertIndexVotesGet(
      txHash: string,
      certIndex: number,
      count?: number,
      page?: number,
      order?: GovernanceProposalsTxHashCertIndexVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ProposalVotesInner>>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.governanceProposalsTxHashCertIndexVotesGet(
          txHash,
          certIndex,
          count,
          page,
          order,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoGovernanceApi.governanceProposalsTxHashCertIndexVotesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Withdrawal proposal details.
     * @summary Specific withdrawals proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async governanceProposalsTxHashCertIndexWithdrawalsGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ProposalWithdrawalsInner>>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.governanceProposalsTxHashCertIndexWithdrawalsGet(
          txHash,
          certIndex,
          options
        );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap[
          'CardanoGovernanceApi.governanceProposalsTxHashCertIndexWithdrawalsGet'
        ]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoGovernanceApi - factory interface
 * @export
 */
export const CardanoGovernanceApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoGovernanceApiFp(configuration);
  return {
    /**
     * List of Drep delegators.
     * @summary DRep delegators
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdDelegatorsGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdDelegatorsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<DrepDelegatorsInner>> {
      return localVarFp
        .governanceDrepsDrepIdDelegatorsGet(drepId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * DRep information.
     * @summary Specific DRep
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdGet(drepId: string, options?: RawAxiosRequestConfig): AxiosPromise<Drep> {
      return localVarFp
        .governanceDrepsDrepIdGet(drepId, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * DRep metadata information.
     * @summary DRep metadata
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdMetadataGet(
      drepId: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<DrepMetadata> {
      return localVarFp
        .governanceDrepsDrepIdMetadataGet(drepId, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of certificate updates to the DRep.
     * @summary DRep updates
     * @param {string} drepId Bech32 or hexadecimal DRep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdUpdatesGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdUpdatesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<DrepUpdatesInner>> {
      return localVarFp
        .governanceDrepsDrepIdUpdatesGet(drepId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * History of Drep votes.
     * @summary DRep votes
     * @param {string} drepId Bech32 or hexadecimal drep ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsDrepIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsDrepIdVotesGet(
      drepId: string,
      count?: number,
      page?: number,
      order?: GovernanceDrepsDrepIdVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<DrepVotesInner>> {
      return localVarFp
        .governanceDrepsDrepIdVotesGet(drepId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the information about Delegate Representatives (DReps)
     * @summary Delegate Representatives (DReps)
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceDrepsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceDrepsGet(
      count?: number,
      page?: number,
      order?: GovernanceDrepsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<DrepsInner>> {
      return localVarFp
        .governanceDrepsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return the information about Proposals
     * @summary Proposals
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsGet(
      count?: number,
      page?: number,
      order?: GovernanceProposalsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<ProposalsInner>> {
      return localVarFp
        .governanceProposalsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Proposal information.
     * @summary Specific proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Proposal> {
      return localVarFp
        .governanceProposalsTxHashCertIndexGet(txHash, certIndex, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Proposal metadata information.
     * @summary Specific proposal metadata
     * @param {string} txHash Transaction hash of the proposal.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexMetadataGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ProposalMetadata> {
      return localVarFp
        .governanceProposalsTxHashCertIndexMetadataGet(txHash, certIndex, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Parameters proposal details.
     * @summary Specific parameters proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexParametersGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ProposalParameters> {
      return localVarFp
        .governanceProposalsTxHashCertIndexParametersGet(txHash, certIndex, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * History of Proposal votes.
     * @summary Proposal votes
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {GovernanceProposalsTxHashCertIndexVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexVotesGet(
      txHash: string,
      certIndex: number,
      count?: number,
      page?: number,
      order?: GovernanceProposalsTxHashCertIndexVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<ProposalVotesInner>> {
      return localVarFp
        .governanceProposalsTxHashCertIndexVotesGet(txHash, certIndex, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Withdrawal proposal details.
     * @summary Specific withdrawals proposal
     * @param {string} txHash Transaction hash.
     * @param {number} certIndex Index of the certificate within the proposal transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    governanceProposalsTxHashCertIndexWithdrawalsGet(
      txHash: string,
      certIndex: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<ProposalWithdrawalsInner>> {
      return localVarFp
        .governanceProposalsTxHashCertIndexWithdrawalsGet(txHash, certIndex, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoGovernanceApi - object-oriented interface
 * @export
 * @class CardanoGovernanceApi
 * @extends {BaseAPI}
 */
export class CardanoGovernanceApi extends BaseAPI {
  /**
   * List of Drep delegators.
   * @summary DRep delegators
   * @param {string} drepId Bech32 or hexadecimal drep ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceDrepsDrepIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsDrepIdDelegatorsGet(
    drepId: string,
    count?: number,
    page?: number,
    order?: GovernanceDrepsDrepIdDelegatorsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsDrepIdDelegatorsGet(drepId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * DRep information.
   * @summary Specific DRep
   * @param {string} drepId Bech32 or hexadecimal DRep ID.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsDrepIdGet(drepId: string, options?: RawAxiosRequestConfig) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsDrepIdGet(drepId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * DRep metadata information.
   * @summary DRep metadata
   * @param {string} drepId Bech32 or hexadecimal DRep ID.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsDrepIdMetadataGet(drepId: string, options?: RawAxiosRequestConfig) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsDrepIdMetadataGet(drepId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of certificate updates to the DRep.
   * @summary DRep updates
   * @param {string} drepId Bech32 or hexadecimal DRep ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceDrepsDrepIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsDrepIdUpdatesGet(
    drepId: string,
    count?: number,
    page?: number,
    order?: GovernanceDrepsDrepIdUpdatesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsDrepIdUpdatesGet(drepId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of Drep votes.
   * @summary DRep votes
   * @param {string} drepId Bech32 or hexadecimal drep ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceDrepsDrepIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsDrepIdVotesGet(
    drepId: string,
    count?: number,
    page?: number,
    order?: GovernanceDrepsDrepIdVotesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsDrepIdVotesGet(drepId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the information about Delegate Representatives (DReps)
   * @summary Delegate Representatives (DReps)
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceDrepsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceDrepsGet(
    count?: number,
    page?: number,
    order?: GovernanceDrepsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceDrepsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the information about Proposals
   * @summary Proposals
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceProposalsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last. Ordering in this case is based on the time of the first mint transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsGet(
    count?: number,
    page?: number,
    order?: GovernanceProposalsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Proposal information.
   * @summary Specific proposal
   * @param {string} txHash Transaction hash.
   * @param {number} certIndex Index of the certificate within the proposal transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsTxHashCertIndexGet(
    txHash: string,
    certIndex: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsTxHashCertIndexGet(txHash, certIndex, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Proposal metadata information.
   * @summary Specific proposal metadata
   * @param {string} txHash Transaction hash of the proposal.
   * @param {number} certIndex Index of the certificate within the proposal transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsTxHashCertIndexMetadataGet(
    txHash: string,
    certIndex: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsTxHashCertIndexMetadataGet(txHash, certIndex, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Parameters proposal details.
   * @summary Specific parameters proposal
   * @param {string} txHash Transaction hash.
   * @param {number} certIndex Index of the certificate within the proposal transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsTxHashCertIndexParametersGet(
    txHash: string,
    certIndex: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsTxHashCertIndexParametersGet(txHash, certIndex, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of Proposal votes.
   * @summary Proposal votes
   * @param {string} txHash Transaction hash.
   * @param {number} certIndex Index of the certificate within the proposal transaction.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {GovernanceProposalsTxHashCertIndexVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsTxHashCertIndexVotesGet(
    txHash: string,
    certIndex: number,
    count?: number,
    page?: number,
    order?: GovernanceProposalsTxHashCertIndexVotesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsTxHashCertIndexVotesGet(txHash, certIndex, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Withdrawal proposal details.
   * @summary Specific withdrawals proposal
   * @param {string} txHash Transaction hash.
   * @param {number} certIndex Index of the certificate within the proposal transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoGovernanceApi
   */
  public governanceProposalsTxHashCertIndexWithdrawalsGet(
    txHash: string,
    certIndex: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoGovernanceApiFp(this.configuration)
      .governanceProposalsTxHashCertIndexWithdrawalsGet(txHash, certIndex, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const GovernanceDrepsDrepIdDelegatorsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceDrepsDrepIdDelegatorsGetOrderEnum =
  (typeof GovernanceDrepsDrepIdDelegatorsGetOrderEnum)[keyof typeof GovernanceDrepsDrepIdDelegatorsGetOrderEnum];
/**
 * @export
 */
export const GovernanceDrepsDrepIdUpdatesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceDrepsDrepIdUpdatesGetOrderEnum =
  (typeof GovernanceDrepsDrepIdUpdatesGetOrderEnum)[keyof typeof GovernanceDrepsDrepIdUpdatesGetOrderEnum];
/**
 * @export
 */
export const GovernanceDrepsDrepIdVotesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceDrepsDrepIdVotesGetOrderEnum =
  (typeof GovernanceDrepsDrepIdVotesGetOrderEnum)[keyof typeof GovernanceDrepsDrepIdVotesGetOrderEnum];
/**
 * @export
 */
export const GovernanceDrepsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceDrepsGetOrderEnum =
  (typeof GovernanceDrepsGetOrderEnum)[keyof typeof GovernanceDrepsGetOrderEnum];
/**
 * @export
 */
export const GovernanceProposalsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceProposalsGetOrderEnum =
  (typeof GovernanceProposalsGetOrderEnum)[keyof typeof GovernanceProposalsGetOrderEnum];
/**
 * @export
 */
export const GovernanceProposalsTxHashCertIndexVotesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type GovernanceProposalsTxHashCertIndexVotesGetOrderEnum =
  (typeof GovernanceProposalsTxHashCertIndexVotesGetOrderEnum)[keyof typeof GovernanceProposalsTxHashCertIndexVotesGetOrderEnum];

/**
 * CardanoLedgerApi - axios parameter creator
 * @export
 */
export const CardanoLedgerApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Return the information about blockchain genesis.
     * @summary Blockchain genesis
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    genesisGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/genesis`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoLedgerApi - functional programming interface
 * @export
 */
export const CardanoLedgerApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoLedgerApiAxiosParamCreator(configuration);
  return {
    /**
     * Return the information about blockchain genesis.
     * @summary Blockchain genesis
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async genesisGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GenesisContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.genesisGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoLedgerApi.genesisGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoLedgerApi - factory interface
 * @export
 */
export const CardanoLedgerApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoLedgerApiFp(configuration);
  return {
    /**
     * Return the information about blockchain genesis.
     * @summary Blockchain genesis
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    genesisGet(options?: RawAxiosRequestConfig): AxiosPromise<GenesisContent> {
      return localVarFp.genesisGet(options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoLedgerApi - object-oriented interface
 * @export
 * @class CardanoLedgerApi
 * @extends {BaseAPI}
 */
export class CardanoLedgerApi extends BaseAPI {
  /**
   * Return the information about blockchain genesis.
   * @summary Blockchain genesis
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoLedgerApi
   */
  public genesisGet(options?: RawAxiosRequestConfig) {
    return CardanoLedgerApiFp(this.configuration)
      .genesisGet(options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * CardanoMempoolApi - axios parameter creator
 * @export
 */
export const CardanoMempoolApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List of mempool transactions where at least one of the transaction inputs or outputs belongs to the address. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool by address
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolAddressesAddressGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolAddressesAddressGet: async (
      address: string,
      count?: number,
      page?: number,
      order?: MempoolAddressesAddressGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('mempoolAddressesAddressGet', 'address', address);
      const localVarPath = `/mempool/addresses/{address}`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return transactions that are currently stored in Blockfrost mempool, waiting to be included in a newly minted block. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolGet: async (
      count?: number,
      page?: number,
      order?: MempoolGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/mempool`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return content of the requested transaction.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Specific transaction in the mempool
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolHashGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('mempoolHashGet', 'hash', hash);
      const localVarPath = `/mempool/{hash}`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoMempoolApi - functional programming interface
 * @export
 */
export const CardanoMempoolApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoMempoolApiAxiosParamCreator(configuration);
  return {
    /**
     * List of mempool transactions where at least one of the transaction inputs or outputs belongs to the address. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool by address
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolAddressesAddressGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async mempoolAddressesAddressGet(
      address: string,
      count?: number,
      page?: number,
      order?: MempoolAddressesAddressGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MempoolContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.mempoolAddressesAddressGet(
        address,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMempoolApi.mempoolAddressesAddressGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return transactions that are currently stored in Blockfrost mempool, waiting to be included in a newly minted block. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async mempoolGet(
      count?: number,
      page?: number,
      order?: MempoolGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MempoolContentInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.mempoolGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMempoolApi.mempoolGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return content of the requested transaction.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Specific transaction in the mempool
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async mempoolHashGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<MempoolTxContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.mempoolHashGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMempoolApi.mempoolHashGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoMempoolApi - factory interface
 * @export
 */
export const CardanoMempoolApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoMempoolApiFp(configuration);
  return {
    /**
     * List of mempool transactions where at least one of the transaction inputs or outputs belongs to the address. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool by address
     * @param {string} address Bech32 address.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolAddressesAddressGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolAddressesAddressGet(
      address: string,
      count?: number,
      page?: number,
      order?: MempoolAddressesAddressGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<MempoolContentInner>> {
      return localVarFp
        .mempoolAddressesAddressGet(address, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return transactions that are currently stored in Blockfrost mempool, waiting to be included in a newly minted block. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Mempool
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MempoolGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolGet(
      count?: number,
      page?: number,
      order?: MempoolGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<MempoolContentInner>> {
      return localVarFp
        .mempoolGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return content of the requested transaction.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Specific transaction in the mempool
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    mempoolHashGet(hash: string, options?: RawAxiosRequestConfig): AxiosPromise<MempoolTxContent> {
      return localVarFp.mempoolHashGet(hash, options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoMempoolApi - object-oriented interface
 * @export
 * @class CardanoMempoolApi
 * @extends {BaseAPI}
 */
export class CardanoMempoolApi extends BaseAPI {
  /**
   * List of mempool transactions where at least one of the transaction inputs or outputs belongs to the address. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Mempool by address
   * @param {string} address Bech32 address.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {MempoolAddressesAddressGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMempoolApi
   */
  public mempoolAddressesAddressGet(
    address: string,
    count?: number,
    page?: number,
    order?: MempoolAddressesAddressGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoMempoolApiFp(this.configuration)
      .mempoolAddressesAddressGet(address, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return transactions that are currently stored in Blockfrost mempool, waiting to be included in a newly minted block. Shows only transactions submitted via Blockfrost.io.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Mempool
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {MempoolGetOrderEnum} [order] Ordered by the time of transaction submission. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMempoolApi
   */
  public mempoolGet(
    count?: number,
    page?: number,
    order?: MempoolGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoMempoolApiFp(this.configuration)
      .mempoolGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return content of the requested transaction.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Specific transaction in the mempool
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMempoolApi
   */
  public mempoolHashGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoMempoolApiFp(this.configuration)
      .mempoolHashGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const MempoolAddressesAddressGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type MempoolAddressesAddressGetOrderEnum =
  (typeof MempoolAddressesAddressGetOrderEnum)[keyof typeof MempoolAddressesAddressGetOrderEnum];
/**
 * @export
 */
export const MempoolGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type MempoolGetOrderEnum = (typeof MempoolGetOrderEnum)[keyof typeof MempoolGetOrderEnum];

/**
 * CardanoMetadataApi - axios parameter creator
 * @export
 */
export const CardanoMetadataApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List of all used transaction metadata labels.
     * @summary Transaction metadata labels
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsGet: async (
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/metadata/txs/labels`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in CBOR
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelCborGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsLabelCborGet: async (
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelCborGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'label' is not null or undefined
      assertParamExists('metadataTxsLabelsLabelCborGet', 'label', label);
      const localVarPath = `/metadata/txs/labels/{label}/cbor`.replace(
        `{${'label'}}`,
        encodeURIComponent(String(label))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in JSON
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsLabelGet: async (
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'label' is not null or undefined
      assertParamExists('metadataTxsLabelsLabelGet', 'label', label);
      const localVarPath = `/metadata/txs/labels/{label}`.replace(
        `{${'label'}}`,
        encodeURIComponent(String(label))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoMetadataApi - functional programming interface
 * @export
 */
export const CardanoMetadataApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoMetadataApiAxiosParamCreator(configuration);
  return {
    /**
     * List of all used transaction metadata labels.
     * @summary Transaction metadata labels
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async metadataTxsLabelsGet(
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxMetadataLabelsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.metadataTxsLabelsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMetadataApi.metadataTxsLabelsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in CBOR
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelCborGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async metadataTxsLabelsLabelCborGet(
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxMetadataLabelCborInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.metadataTxsLabelsLabelCborGet(
        label,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMetadataApi.metadataTxsLabelsLabelCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in JSON
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async metadataTxsLabelsLabelGet(
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxMetadataLabelJsonInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.metadataTxsLabelsLabelGet(
        label,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoMetadataApi.metadataTxsLabelsLabelGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoMetadataApi - factory interface
 * @export
 */
export const CardanoMetadataApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoMetadataApiFp(configuration);
  return {
    /**
     * List of all used transaction metadata labels.
     * @summary Transaction metadata labels
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsGet(
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxMetadataLabelsInner>> {
      return localVarFp
        .metadataTxsLabelsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in CBOR
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelCborGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsLabelCborGet(
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelCborGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxMetadataLabelCborInner>> {
      return localVarFp
        .metadataTxsLabelsLabelCborGet(label, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Transaction metadata per label.
     * @summary Transaction metadata content in JSON
     * @param {string} label Metadata label
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {MetadataTxsLabelsLabelGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metadataTxsLabelsLabelGet(
      label: string,
      count?: number,
      page?: number,
      order?: MetadataTxsLabelsLabelGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxMetadataLabelJsonInner>> {
      return localVarFp
        .metadataTxsLabelsLabelGet(label, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoMetadataApi - object-oriented interface
 * @export
 * @class CardanoMetadataApi
 * @extends {BaseAPI}
 */
export class CardanoMetadataApi extends BaseAPI {
  /**
   * List of all used transaction metadata labels.
   * @summary Transaction metadata labels
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {MetadataTxsLabelsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMetadataApi
   */
  public metadataTxsLabelsGet(
    count?: number,
    page?: number,
    order?: MetadataTxsLabelsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoMetadataApiFp(this.configuration)
      .metadataTxsLabelsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Transaction metadata per label.
   * @summary Transaction metadata content in CBOR
   * @param {string} label Metadata label
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {MetadataTxsLabelsLabelCborGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMetadataApi
   */
  public metadataTxsLabelsLabelCborGet(
    label: string,
    count?: number,
    page?: number,
    order?: MetadataTxsLabelsLabelCborGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoMetadataApiFp(this.configuration)
      .metadataTxsLabelsLabelCborGet(label, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Transaction metadata per label.
   * @summary Transaction metadata content in JSON
   * @param {string} label Metadata label
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {MetadataTxsLabelsLabelGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoMetadataApi
   */
  public metadataTxsLabelsLabelGet(
    label: string,
    count?: number,
    page?: number,
    order?: MetadataTxsLabelsLabelGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoMetadataApiFp(this.configuration)
      .metadataTxsLabelsLabelGet(label, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const MetadataTxsLabelsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type MetadataTxsLabelsGetOrderEnum =
  (typeof MetadataTxsLabelsGetOrderEnum)[keyof typeof MetadataTxsLabelsGetOrderEnum];
/**
 * @export
 */
export const MetadataTxsLabelsLabelCborGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type MetadataTxsLabelsLabelCborGetOrderEnum =
  (typeof MetadataTxsLabelsLabelCborGetOrderEnum)[keyof typeof MetadataTxsLabelsLabelCborGetOrderEnum];
/**
 * @export
 */
export const MetadataTxsLabelsLabelGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type MetadataTxsLabelsLabelGetOrderEnum =
  (typeof MetadataTxsLabelsLabelGetOrderEnum)[keyof typeof MetadataTxsLabelsLabelGetOrderEnum];

/**
 * CardanoNetworkApi - axios parameter creator
 * @export
 */
export const CardanoNetworkApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Returns start and end of each era along with parameters that can vary between hard forks.
     * @summary Query summary of blockchain eras
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    networkErasGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/network/eras`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return detailed network information.
     * @summary Network information
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    networkGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/network`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoNetworkApi - functional programming interface
 * @export
 */
export const CardanoNetworkApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoNetworkApiAxiosParamCreator(configuration);
  return {
    /**
     * Returns start and end of each era along with parameters that can vary between hard forks.
     * @summary Query summary of blockchain eras
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async networkErasGet(
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NetworkErasInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.networkErasGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoNetworkApi.networkErasGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return detailed network information.
     * @summary Network information
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async networkGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Network>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.networkGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoNetworkApi.networkGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoNetworkApi - factory interface
 * @export
 */
export const CardanoNetworkApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoNetworkApiFp(configuration);
  return {
    /**
     * Returns start and end of each era along with parameters that can vary between hard forks.
     * @summary Query summary of blockchain eras
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    networkErasGet(options?: RawAxiosRequestConfig): AxiosPromise<Array<NetworkErasInner>> {
      return localVarFp.networkErasGet(options).then((request) => request(axios, basePath));
    },
    /**
     * Return detailed network information.
     * @summary Network information
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    networkGet(options?: RawAxiosRequestConfig): AxiosPromise<Network> {
      return localVarFp.networkGet(options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoNetworkApi - object-oriented interface
 * @export
 * @class CardanoNetworkApi
 * @extends {BaseAPI}
 */
export class CardanoNetworkApi extends BaseAPI {
  /**
   * Returns start and end of each era along with parameters that can vary between hard forks.
   * @summary Query summary of blockchain eras
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoNetworkApi
   */
  public networkErasGet(options?: RawAxiosRequestConfig) {
    return CardanoNetworkApiFp(this.configuration)
      .networkErasGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return detailed network information.
   * @summary Network information
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoNetworkApi
   */
  public networkGet(options?: RawAxiosRequestConfig) {
    return CardanoNetworkApiFp(this.configuration)
      .networkGet(options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * CardanoPoolsApi - axios parameter creator
 * @export
 */
export const CardanoPoolsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List of registered stake pools with additional information.
     * @summary List of stake pools with additional information
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsExtendedGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsExtendedGet: async (
      count?: number,
      page?: number,
      order?: PoolsExtendedGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/pools/extended`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of registered stake pools.
     * @summary List of stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsGet: async (
      count?: number,
      page?: number,
      order?: PoolsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/pools`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of stake pools blocks.
     * @summary Stake pool blocks
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdBlocksGet: async (
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdBlocksGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdBlocksGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/blocks`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of current stake pools delegators.
     * @summary Stake pool delegators
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdDelegatorsGet: async (
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdDelegatorsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdDelegatorsGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/delegators`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Pool information.
     * @summary Specific stake pool
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdGet: async (
      poolId: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of stake pool parameters over epochs.
     * @summary Stake pool history
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {PoolsPoolIdHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdHistoryGet: async (
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdHistoryGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdHistoryGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/history`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Stake pool registration metadata.
     * @summary Stake pool metadata
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdMetadataGet: async (
      poolId: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdMetadataGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/metadata`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Relays of a stake pool.
     * @summary Stake pool relays
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdRelaysGet: async (
      poolId: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdRelaysGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/relays`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of certificate updates to the stake pool.
     * @summary Stake pool updates
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdUpdatesGet: async (
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdUpdatesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdUpdatesGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/updates`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of stake pools votes.
     * @summary Stake pool votes
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdVotesGet: async (
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdVotesGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'poolId' is not null or undefined
      assertParamExists('poolsPoolIdVotesGet', 'poolId', poolId);
      const localVarPath = `/pools/{pool_id}/votes`.replace(
        `{${'pool_id'}}`,
        encodeURIComponent(String(poolId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of already retired pools.
     * @summary List of retired stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiredGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsRetiredGet: async (
      count?: number,
      page?: number,
      order?: PoolsRetiredGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/pools/retired`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of stake pools retiring in the upcoming epochs
     * @summary List of retiring stake pools
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiringGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsRetiringGet: async (
      count?: number,
      page?: number,
      order?: PoolsRetiringGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/pools/retiring`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoPoolsApi - functional programming interface
 * @export
 */
export const CardanoPoolsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoPoolsApiAxiosParamCreator(configuration);
  return {
    /**
     * List of registered stake pools with additional information.
     * @summary List of stake pools with additional information
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsExtendedGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsExtendedGet(
      count?: number,
      page?: number,
      order?: PoolsExtendedGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolListExtendedInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsExtendedGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsExtendedGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of registered stake pools.
     * @summary List of stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsGet(
      count?: number,
      page?: number,
      order?: PoolsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of stake pools blocks.
     * @summary Stake pool blocks
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdBlocksGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdBlocksGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdBlocksGet(
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdBlocksGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of current stake pools delegators.
     * @summary Stake pool delegators
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdDelegatorsGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdDelegatorsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolDelegatorsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdDelegatorsGet(
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdDelegatorsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Pool information.
     * @summary Specific stake pool
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdGet(
      poolId: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Pool>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdGet(poolId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of stake pool parameters over epochs.
     * @summary Stake pool history
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {PoolsPoolIdHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdHistoryGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolHistoryInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdHistoryGet(
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdHistoryGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Stake pool registration metadata.
     * @summary Stake pool metadata
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdMetadataGet(
      poolId: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<PoolsPoolIdMetadataGet200Response>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdMetadataGet(
        poolId,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdMetadataGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Relays of a stake pool.
     * @summary Stake pool relays
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdRelaysGet(
      poolId: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<TxContentPoolCertsInnerRelaysInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdRelaysGet(
        poolId,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdRelaysGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of certificate updates to the stake pool.
     * @summary Stake pool updates
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdUpdatesGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdUpdatesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolUpdatesInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdUpdatesGet(
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdUpdatesGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of stake pools votes.
     * @summary Stake pool votes
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsPoolIdVotesGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DrepVotesInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsPoolIdVotesGet(
        poolId,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsPoolIdVotesGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of already retired pools.
     * @summary List of retired stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiredGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsRetiredGet(
      count?: number,
      page?: number,
      order?: PoolsRetiredGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolListRetireInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsRetiredGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsRetiredGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of stake pools retiring in the upcoming epochs
     * @summary List of retiring stake pools
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiringGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async poolsRetiringGet(
      count?: number,
      page?: number,
      order?: PoolsRetiringGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PoolListRetireInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.poolsRetiringGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoPoolsApi.poolsRetiringGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoPoolsApi - factory interface
 * @export
 */
export const CardanoPoolsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoPoolsApiFp(configuration);
  return {
    /**
     * List of registered stake pools with additional information.
     * @summary List of stake pools with additional information
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsExtendedGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsExtendedGet(
      count?: number,
      page?: number,
      order?: PoolsExtendedGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolListExtendedInner>> {
      return localVarFp
        .poolsExtendedGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of registered stake pools.
     * @summary List of stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsGet(
      count?: number,
      page?: number,
      order?: PoolsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .poolsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of stake pools blocks.
     * @summary Stake pool blocks
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdBlocksGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdBlocksGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<string>> {
      return localVarFp
        .poolsPoolIdBlocksGet(poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of current stake pools delegators.
     * @summary Stake pool delegators
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdDelegatorsGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdDelegatorsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolDelegatorsInner>> {
      return localVarFp
        .poolsPoolIdDelegatorsGet(poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Pool information.
     * @summary Specific stake pool
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdGet(poolId: string, options?: RawAxiosRequestConfig): AxiosPromise<Pool> {
      return localVarFp.poolsPoolIdGet(poolId, options).then((request) => request(axios, basePath));
    },
    /**
     * History of stake pool parameters over epochs.
     * @summary Stake pool history
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results
     * @param {PoolsPoolIdHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdHistoryGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdHistoryGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolHistoryInner>> {
      return localVarFp
        .poolsPoolIdHistoryGet(poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Stake pool registration metadata.
     * @summary Stake pool metadata
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdMetadataGet(
      poolId: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<PoolsPoolIdMetadataGet200Response> {
      return localVarFp
        .poolsPoolIdMetadataGet(poolId, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Relays of a stake pool.
     * @summary Stake pool relays
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdRelaysGet(
      poolId: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentPoolCertsInnerRelaysInner>> {
      return localVarFp
        .poolsPoolIdRelaysGet(poolId, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of certificate updates to the stake pool.
     * @summary Stake pool updates
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdUpdatesGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdUpdatesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolUpdatesInner>> {
      return localVarFp
        .poolsPoolIdUpdatesGet(poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * History of stake pools votes.
     * @summary Stake pool votes
     * @param {string} poolId Bech32 or hexadecimal pool ID.
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsPoolIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsPoolIdVotesGet(
      poolId: string,
      count?: number,
      page?: number,
      order?: PoolsPoolIdVotesGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<DrepVotesInner>> {
      return localVarFp
        .poolsPoolIdVotesGet(poolId, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of already retired pools.
     * @summary List of retired stake pools
     * @param {number} [count] The number of pools per page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiredGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsRetiredGet(
      count?: number,
      page?: number,
      order?: PoolsRetiredGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolListRetireInner>> {
      return localVarFp
        .poolsRetiredGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of stake pools retiring in the upcoming epochs
     * @summary List of retiring stake pools
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {PoolsRetiringGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    poolsRetiringGet(
      count?: number,
      page?: number,
      order?: PoolsRetiringGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<PoolListRetireInner>> {
      return localVarFp
        .poolsRetiringGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoPoolsApi - object-oriented interface
 * @export
 * @class CardanoPoolsApi
 * @extends {BaseAPI}
 */
export class CardanoPoolsApi extends BaseAPI {
  /**
   * List of registered stake pools with additional information.
   * @summary List of stake pools with additional information
   * @param {number} [count] The number of pools per page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsExtendedGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsExtendedGet(
    count?: number,
    page?: number,
    order?: PoolsExtendedGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsExtendedGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of registered stake pools.
   * @summary List of stake pools
   * @param {number} [count] The number of pools per page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsGet(
    count?: number,
    page?: number,
    order?: PoolsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of stake pools blocks.
   * @summary Stake pool blocks
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsPoolIdBlocksGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdBlocksGet(
    poolId: string,
    count?: number,
    page?: number,
    order?: PoolsPoolIdBlocksGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdBlocksGet(poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of current stake pools delegators.
   * @summary Stake pool delegators
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsPoolIdDelegatorsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdDelegatorsGet(
    poolId: string,
    count?: number,
    page?: number,
    order?: PoolsPoolIdDelegatorsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdDelegatorsGet(poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Pool information.
   * @summary Specific stake pool
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdGet(poolId: string, options?: RawAxiosRequestConfig) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdGet(poolId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of stake pool parameters over epochs.
   * @summary Stake pool history
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results
   * @param {PoolsPoolIdHistoryGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdHistoryGet(
    poolId: string,
    count?: number,
    page?: number,
    order?: PoolsPoolIdHistoryGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdHistoryGet(poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Stake pool registration metadata.
   * @summary Stake pool metadata
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdMetadataGet(poolId: string, options?: RawAxiosRequestConfig) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdMetadataGet(poolId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Relays of a stake pool.
   * @summary Stake pool relays
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdRelaysGet(poolId: string, options?: RawAxiosRequestConfig) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdRelaysGet(poolId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of certificate updates to the stake pool.
   * @summary Stake pool updates
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsPoolIdUpdatesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdUpdatesGet(
    poolId: string,
    count?: number,
    page?: number,
    order?: PoolsPoolIdUpdatesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdUpdatesGet(poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of stake pools votes.
   * @summary Stake pool votes
   * @param {string} poolId Bech32 or hexadecimal pool ID.
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsPoolIdVotesGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsPoolIdVotesGet(
    poolId: string,
    count?: number,
    page?: number,
    order?: PoolsPoolIdVotesGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsPoolIdVotesGet(poolId, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of already retired pools.
   * @summary List of retired stake pools
   * @param {number} [count] The number of pools per page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsRetiredGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsRetiredGet(
    count?: number,
    page?: number,
    order?: PoolsRetiredGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsRetiredGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of stake pools retiring in the upcoming epochs
   * @summary List of retiring stake pools
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {PoolsRetiringGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoPoolsApi
   */
  public poolsRetiringGet(
    count?: number,
    page?: number,
    order?: PoolsRetiringGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoPoolsApiFp(this.configuration)
      .poolsRetiringGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const PoolsExtendedGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsExtendedGetOrderEnum =
  (typeof PoolsExtendedGetOrderEnum)[keyof typeof PoolsExtendedGetOrderEnum];
/**
 * @export
 */
export const PoolsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsGetOrderEnum = (typeof PoolsGetOrderEnum)[keyof typeof PoolsGetOrderEnum];
/**
 * @export
 */
export const PoolsPoolIdBlocksGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsPoolIdBlocksGetOrderEnum =
  (typeof PoolsPoolIdBlocksGetOrderEnum)[keyof typeof PoolsPoolIdBlocksGetOrderEnum];
/**
 * @export
 */
export const PoolsPoolIdDelegatorsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsPoolIdDelegatorsGetOrderEnum =
  (typeof PoolsPoolIdDelegatorsGetOrderEnum)[keyof typeof PoolsPoolIdDelegatorsGetOrderEnum];
/**
 * @export
 */
export const PoolsPoolIdHistoryGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsPoolIdHistoryGetOrderEnum =
  (typeof PoolsPoolIdHistoryGetOrderEnum)[keyof typeof PoolsPoolIdHistoryGetOrderEnum];
/**
 * @export
 */
export const PoolsPoolIdUpdatesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsPoolIdUpdatesGetOrderEnum =
  (typeof PoolsPoolIdUpdatesGetOrderEnum)[keyof typeof PoolsPoolIdUpdatesGetOrderEnum];
/**
 * @export
 */
export const PoolsPoolIdVotesGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsPoolIdVotesGetOrderEnum =
  (typeof PoolsPoolIdVotesGetOrderEnum)[keyof typeof PoolsPoolIdVotesGetOrderEnum];
/**
 * @export
 */
export const PoolsRetiredGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsRetiredGetOrderEnum =
  (typeof PoolsRetiredGetOrderEnum)[keyof typeof PoolsRetiredGetOrderEnum];
/**
 * @export
 */
export const PoolsRetiringGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type PoolsRetiringGetOrderEnum =
  (typeof PoolsRetiringGetOrderEnum)[keyof typeof PoolsRetiringGetOrderEnum];

/**
 * CardanoScriptsApi - axios parameter creator
 * @export
 */
export const CardanoScriptsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Query CBOR serialised datum by its hash
     * @summary Datum CBOR value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsDatumDatumHashCborGet: async (
      datumHash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'datumHash' is not null or undefined
      assertParamExists('scriptsDatumDatumHashCborGet', 'datumHash', datumHash);
      const localVarPath = `/scripts/datum/{datum_hash}/cbor`.replace(
        `{${'datum_hash'}}`,
        encodeURIComponent(String(datumHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Query JSON value of a datum by its hash
     * @summary Datum value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsDatumDatumHashGet: async (
      datumHash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'datumHash' is not null or undefined
      assertParamExists('scriptsDatumDatumHashGet', 'datumHash', datumHash);
      const localVarPath = `/scripts/datum/{datum_hash}`.replace(
        `{${'datum_hash'}}`,
        encodeURIComponent(String(datumHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of scripts.
     * @summary Scripts
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsGet: async (
      count?: number,
      page?: number,
      order?: ScriptsGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/scripts`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * CBOR representation of a `plutus` script
     * @summary Script CBOR
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashCborGet: async (
      scriptHash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'scriptHash' is not null or undefined
      assertParamExists('scriptsScriptHashCborGet', 'scriptHash', scriptHash);
      const localVarPath = `/scripts/{script_hash}/cbor`.replace(
        `{${'script_hash'}}`,
        encodeURIComponent(String(scriptHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Information about a specific script
     * @summary Specific script
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashGet: async (
      scriptHash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'scriptHash' is not null or undefined
      assertParamExists('scriptsScriptHashGet', 'scriptHash', scriptHash);
      const localVarPath = `/scripts/{script_hash}`.replace(
        `{${'script_hash'}}`,
        encodeURIComponent(String(scriptHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * JSON representation of a `timelock` script
     * @summary Script JSON
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashJsonGet: async (
      scriptHash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'scriptHash' is not null or undefined
      assertParamExists('scriptsScriptHashJsonGet', 'scriptHash', scriptHash);
      const localVarPath = `/scripts/{script_hash}/json`.replace(
        `{${'script_hash'}}`,
        encodeURIComponent(String(scriptHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of redeemers of a specific script
     * @summary Redeemers of a specific script
     * @param {string} scriptHash Hash of the script
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsScriptHashRedeemersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashRedeemersGet: async (
      scriptHash: string,
      count?: number,
      page?: number,
      order?: ScriptsScriptHashRedeemersGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'scriptHash' is not null or undefined
      assertParamExists('scriptsScriptHashRedeemersGet', 'scriptHash', scriptHash);
      const localVarPath = `/scripts/{script_hash}/redeemers`.replace(
        `{${'script_hash'}}`,
        encodeURIComponent(String(scriptHash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoScriptsApi - functional programming interface
 * @export
 */
export const CardanoScriptsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoScriptsApiAxiosParamCreator(configuration);
  return {
    /**
     * Query CBOR serialised datum by its hash
     * @summary Datum CBOR value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsDatumDatumHashCborGet(
      datumHash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ScriptDatumCbor>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsDatumDatumHashCborGet(
        datumHash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsDatumDatumHashCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Query JSON value of a datum by its hash
     * @summary Datum value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsDatumDatumHashGet(
      datumHash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ScriptDatum>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsDatumDatumHashGet(
        datumHash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsDatumDatumHashGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of scripts.
     * @summary Scripts
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsGet(
      count?: number,
      page?: number,
      order?: ScriptsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ScriptsInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * CBOR representation of a `plutus` script
     * @summary Script CBOR
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsScriptHashCborGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ScriptCbor>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsScriptHashCborGet(
        scriptHash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsScriptHashCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Information about a specific script
     * @summary Specific script
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsScriptHashGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Script>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsScriptHashGet(
        scriptHash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsScriptHashGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * JSON representation of a `timelock` script
     * @summary Script JSON
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsScriptHashJsonGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ScriptJson>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsScriptHashJsonGet(
        scriptHash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsScriptHashJsonGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of redeemers of a specific script
     * @summary Redeemers of a specific script
     * @param {string} scriptHash Hash of the script
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsScriptHashRedeemersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async scriptsScriptHashRedeemersGet(
      scriptHash: string,
      count?: number,
      page?: number,
      order?: ScriptsScriptHashRedeemersGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ScriptRedeemersInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.scriptsScriptHashRedeemersGet(
        scriptHash,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoScriptsApi.scriptsScriptHashRedeemersGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoScriptsApi - factory interface
 * @export
 */
export const CardanoScriptsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoScriptsApiFp(configuration);
  return {
    /**
     * Query CBOR serialised datum by its hash
     * @summary Datum CBOR value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsDatumDatumHashCborGet(
      datumHash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ScriptDatumCbor> {
      return localVarFp
        .scriptsDatumDatumHashCborGet(datumHash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Query JSON value of a datum by its hash
     * @summary Datum value
     * @param {string} datumHash Hash of the datum
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsDatumDatumHashGet(
      datumHash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ScriptDatum> {
      return localVarFp
        .scriptsDatumDatumHashGet(datumHash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of scripts.
     * @summary Scripts
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsGet(
      count?: number,
      page?: number,
      order?: ScriptsGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<ScriptsInner>> {
      return localVarFp
        .scriptsGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * CBOR representation of a `plutus` script
     * @summary Script CBOR
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashCborGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ScriptCbor> {
      return localVarFp
        .scriptsScriptHashCborGet(scriptHash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Information about a specific script
     * @summary Specific script
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Script> {
      return localVarFp
        .scriptsScriptHashGet(scriptHash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * JSON representation of a `timelock` script
     * @summary Script JSON
     * @param {string} scriptHash Hash of the script
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashJsonGet(
      scriptHash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<ScriptJson> {
      return localVarFp
        .scriptsScriptHashJsonGet(scriptHash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of redeemers of a specific script
     * @summary Redeemers of a specific script
     * @param {string} scriptHash Hash of the script
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {ScriptsScriptHashRedeemersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    scriptsScriptHashRedeemersGet(
      scriptHash: string,
      count?: number,
      page?: number,
      order?: ScriptsScriptHashRedeemersGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<ScriptRedeemersInner>> {
      return localVarFp
        .scriptsScriptHashRedeemersGet(scriptHash, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoScriptsApi - object-oriented interface
 * @export
 * @class CardanoScriptsApi
 * @extends {BaseAPI}
 */
export class CardanoScriptsApi extends BaseAPI {
  /**
   * Query CBOR serialised datum by its hash
   * @summary Datum CBOR value
   * @param {string} datumHash Hash of the datum
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsDatumDatumHashCborGet(datumHash: string, options?: RawAxiosRequestConfig) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsDatumDatumHashCborGet(datumHash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Query JSON value of a datum by its hash
   * @summary Datum value
   * @param {string} datumHash Hash of the datum
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsDatumDatumHashGet(datumHash: string, options?: RawAxiosRequestConfig) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsDatumDatumHashGet(datumHash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of scripts.
   * @summary Scripts
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {ScriptsGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsGet(
    count?: number,
    page?: number,
    order?: ScriptsGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * CBOR representation of a `plutus` script
   * @summary Script CBOR
   * @param {string} scriptHash Hash of the script
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsScriptHashCborGet(scriptHash: string, options?: RawAxiosRequestConfig) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsScriptHashCborGet(scriptHash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Information about a specific script
   * @summary Specific script
   * @param {string} scriptHash Hash of the script
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsScriptHashGet(scriptHash: string, options?: RawAxiosRequestConfig) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsScriptHashGet(scriptHash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * JSON representation of a `timelock` script
   * @summary Script JSON
   * @param {string} scriptHash Hash of the script
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsScriptHashJsonGet(scriptHash: string, options?: RawAxiosRequestConfig) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsScriptHashJsonGet(scriptHash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of redeemers of a specific script
   * @summary Redeemers of a specific script
   * @param {string} scriptHash Hash of the script
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {ScriptsScriptHashRedeemersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoScriptsApi
   */
  public scriptsScriptHashRedeemersGet(
    scriptHash: string,
    count?: number,
    page?: number,
    order?: ScriptsScriptHashRedeemersGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoScriptsApiFp(this.configuration)
      .scriptsScriptHashRedeemersGet(scriptHash, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const ScriptsGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type ScriptsGetOrderEnum = (typeof ScriptsGetOrderEnum)[keyof typeof ScriptsGetOrderEnum];
/**
 * @export
 */
export const ScriptsScriptHashRedeemersGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type ScriptsScriptHashRedeemersGetOrderEnum =
  (typeof ScriptsScriptHashRedeemersGetOrderEnum)[keyof typeof ScriptsScriptHashRedeemersGetOrderEnum];

/**
 * CardanoTransactionsApi - axios parameter creator
 * @export
 */
export const CardanoTransactionsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Submit an already serialized transaction to the network.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txSubmitPost: async (
      body: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'body' is not null or undefined
      assertParamExists('txSubmitPost', 'body', body);
      const localVarPath = `/tx/submit`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      localVarHeaderParameter['Content-Type'] = 'application/cbor';

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        body,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain the CBOR serialized transaction
     * @summary Transaction CBOR
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashCborGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashCborGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/cbor`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about delegation certificates of a specific transaction.
     * @summary Transaction delegation certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashDelegationsGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashDelegationsGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/delegations`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return content of the requested transaction.
     * @summary Specific transaction
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashGet: async (hash: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashGet', 'hash', hash);
      const localVarPath = `/txs/{hash}`.replace(`{${'hash'}}`, encodeURIComponent(String(hash)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain the transaction metadata in CBOR.
     * @summary Transaction metadata in CBOR
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMetadataCborGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashMetadataCborGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/metadata/cbor`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain the transaction metadata.
     * @summary Transaction metadata
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMetadataGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashMetadataGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/metadata`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about Move Instantaneous Rewards (MIRs) of a specific transaction.
     * @summary Transaction MIRs
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMirsGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashMirsGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/mirs`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about stake pool retirements within a specific transaction.
     * @summary Transaction stake pool retirement certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashPoolRetiresGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashPoolRetiresGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/pool_retires`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about stake pool registration and update certificates of a specific transaction.
     * @summary Transaction stake pool registration and update certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashPoolUpdatesGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashPoolUpdatesGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/pool_updates`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain the transaction redeemers.
     * @summary Transaction redeemers
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashRedeemersGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashRedeemersGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/redeemers`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain the extra transaction witnesses.
     * @summary Transaction required signers
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashRequiredSignersGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashRequiredSignersGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/required_signers`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about (de)registration of stake addresses within a transaction.
     * @summary Transaction stake addresses certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashStakesGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashStakesGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/stakes`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return the inputs and UTXOs of the specific transaction.
     * @summary Transaction UTXOs
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashUtxosGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashUtxosGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/utxos`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Obtain information about withdrawals of a specific transaction.
     * @summary Transaction withdrawal
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashWithdrawalsGet: async (
      hash: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'hash' is not null or undefined
      assertParamExists('txsHashWithdrawalsGet', 'hash', hash);
      const localVarPath = `/txs/{hash}/withdrawals`.replace(
        `{${'hash'}}`,
        encodeURIComponent(String(hash))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoTransactionsApi - functional programming interface
 * @export
 */
export const CardanoTransactionsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoTransactionsApiAxiosParamCreator(configuration);
  return {
    /**
     * Submit an already serialized transaction to the network.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txSubmitPost(
      body: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txSubmitPost(body, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txSubmitPost']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain the CBOR serialized transaction
     * @summary Transaction CBOR
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashCborGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TxContentCbor>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashCborGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashCborGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about delegation certificates of a specific transaction.
     * @summary Transaction delegation certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashDelegationsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentDelegationsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashDelegationsGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashDelegationsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return content of the requested transaction.
     * @summary Specific transaction
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TxContent>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain the transaction metadata in CBOR.
     * @summary Transaction metadata in CBOR
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashMetadataCborGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentMetadataCborInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashMetadataCborGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashMetadataCborGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain the transaction metadata.
     * @summary Transaction metadata
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashMetadataGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentMetadataInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashMetadataGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashMetadataGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about Move Instantaneous Rewards (MIRs) of a specific transaction.
     * @summary Transaction MIRs
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashMirsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentMirsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashMirsGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashMirsGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about stake pool retirements within a specific transaction.
     * @summary Transaction stake pool retirement certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashPoolRetiresGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentPoolRetiresInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashPoolRetiresGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashPoolRetiresGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about stake pool registration and update certificates of a specific transaction.
     * @summary Transaction stake pool registration and update certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashPoolUpdatesGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentPoolCertsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashPoolUpdatesGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashPoolUpdatesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain the transaction redeemers.
     * @summary Transaction redeemers
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashRedeemersGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentRedeemersInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashRedeemersGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashRedeemersGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain the extra transaction witnesses.
     * @summary Transaction required signers
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashRequiredSignersGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<TxContentRequiredSignersInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashRequiredSignersGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashRequiredSignersGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about (de)registration of stake addresses within a transaction.
     * @summary Transaction stake addresses certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashStakesGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentStakeAddrInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashStakesGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashStakesGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return the inputs and UTXOs of the specific transaction.
     * @summary Transaction UTXOs
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashUtxosGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TxContentUtxo>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashUtxosGet(hash, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashUtxosGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Obtain information about withdrawals of a specific transaction.
     * @summary Transaction withdrawal
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async txsHashWithdrawalsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TxContentWithdrawalsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.txsHashWithdrawalsGet(
        hash,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoTransactionsApi.txsHashWithdrawalsGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoTransactionsApi - factory interface
 * @export
 */
export const CardanoTransactionsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoTransactionsApiFp(configuration);
  return {
    /**
     * Submit an already serialized transaction to the network.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txSubmitPost(body: string, options?: RawAxiosRequestConfig): AxiosPromise<string> {
      return localVarFp.txSubmitPost(body, options).then((request) => request(axios, basePath));
    },
    /**
     * Obtain the CBOR serialized transaction
     * @summary Transaction CBOR
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashCborGet(hash: string, options?: RawAxiosRequestConfig): AxiosPromise<TxContentCbor> {
      return localVarFp.txsHashCborGet(hash, options).then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about delegation certificates of a specific transaction.
     * @summary Transaction delegation certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashDelegationsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentDelegationsInner>> {
      return localVarFp
        .txsHashDelegationsGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Return content of the requested transaction.
     * @summary Specific transaction
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashGet(hash: string, options?: RawAxiosRequestConfig): AxiosPromise<TxContent> {
      return localVarFp.txsHashGet(hash, options).then((request) => request(axios, basePath));
    },
    /**
     * Obtain the transaction metadata in CBOR.
     * @summary Transaction metadata in CBOR
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMetadataCborGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentMetadataCborInner>> {
      return localVarFp
        .txsHashMetadataCborGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain the transaction metadata.
     * @summary Transaction metadata
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMetadataGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentMetadataInner>> {
      return localVarFp
        .txsHashMetadataGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about Move Instantaneous Rewards (MIRs) of a specific transaction.
     * @summary Transaction MIRs
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashMirsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentMirsInner>> {
      return localVarFp.txsHashMirsGet(hash, options).then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about stake pool retirements within a specific transaction.
     * @summary Transaction stake pool retirement certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashPoolRetiresGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentPoolRetiresInner>> {
      return localVarFp
        .txsHashPoolRetiresGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about stake pool registration and update certificates of a specific transaction.
     * @summary Transaction stake pool registration and update certificates
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashPoolUpdatesGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentPoolCertsInner>> {
      return localVarFp
        .txsHashPoolUpdatesGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain the transaction redeemers.
     * @summary Transaction redeemers
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashRedeemersGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentRedeemersInner>> {
      return localVarFp
        .txsHashRedeemersGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain the extra transaction witnesses.
     * @summary Transaction required signers
     * @param {string} hash Hash of the transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashRequiredSignersGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentRequiredSignersInner>> {
      return localVarFp
        .txsHashRequiredSignersGet(hash, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about (de)registration of stake addresses within a transaction.
     * @summary Transaction stake addresses certificates
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashStakesGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentStakeAddrInner>> {
      return localVarFp.txsHashStakesGet(hash, options).then((request) => request(axios, basePath));
    },
    /**
     * Return the inputs and UTXOs of the specific transaction.
     * @summary Transaction UTXOs
     * @param {string} hash Hash of the requested transaction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashUtxosGet(hash: string, options?: RawAxiosRequestConfig): AxiosPromise<TxContentUtxo> {
      return localVarFp.txsHashUtxosGet(hash, options).then((request) => request(axios, basePath));
    },
    /**
     * Obtain information about withdrawals of a specific transaction.
     * @summary Transaction withdrawal
     * @param {string} hash Hash of the requested transaction.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    txsHashWithdrawalsGet(
      hash: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<TxContentWithdrawalsInner>> {
      return localVarFp
        .txsHashWithdrawalsGet(hash, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoTransactionsApi - object-oriented interface
 * @export
 * @class CardanoTransactionsApi
 * @extends {BaseAPI}
 */
export class CardanoTransactionsApi extends BaseAPI {
  /**
   * Submit an already serialized transaction to the network.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Submit a transaction
   * @param {string} body The transaction to submit, serialized in CBOR.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txSubmitPost(body: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txSubmitPost(body, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain the CBOR serialized transaction
   * @summary Transaction CBOR
   * @param {string} hash Hash of the transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashCborGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashCborGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about delegation certificates of a specific transaction.
   * @summary Transaction delegation certificates
   * @param {string} hash Hash of the requested transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashDelegationsGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashDelegationsGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return content of the requested transaction.
   * @summary Specific transaction
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain the transaction metadata in CBOR.
   * @summary Transaction metadata in CBOR
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashMetadataCborGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashMetadataCborGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain the transaction metadata.
   * @summary Transaction metadata
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashMetadataGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashMetadataGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about Move Instantaneous Rewards (MIRs) of a specific transaction.
   * @summary Transaction MIRs
   * @param {string} hash Hash of the requested transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashMirsGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashMirsGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about stake pool retirements within a specific transaction.
   * @summary Transaction stake pool retirement certificates
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashPoolRetiresGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashPoolRetiresGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about stake pool registration and update certificates of a specific transaction.
   * @summary Transaction stake pool registration and update certificates
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashPoolUpdatesGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashPoolUpdatesGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain the transaction redeemers.
   * @summary Transaction redeemers
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashRedeemersGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashRedeemersGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain the extra transaction witnesses.
   * @summary Transaction required signers
   * @param {string} hash Hash of the transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashRequiredSignersGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashRequiredSignersGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about (de)registration of stake addresses within a transaction.
   * @summary Transaction stake addresses certificates
   * @param {string} hash Hash of the requested transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashStakesGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashStakesGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return the inputs and UTXOs of the specific transaction.
   * @summary Transaction UTXOs
   * @param {string} hash Hash of the requested transaction
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashUtxosGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashUtxosGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Obtain information about withdrawals of a specific transaction.
   * @summary Transaction withdrawal
   * @param {string} hash Hash of the requested transaction.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoTransactionsApi
   */
  public txsHashWithdrawalsGet(hash: string, options?: RawAxiosRequestConfig) {
    return CardanoTransactionsApiFp(this.configuration)
      .txsHashWithdrawalsGet(hash, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * CardanoUtilitiesApi - axios parameter creator
 * @export
 */
export const CardanoUtilitiesApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Derive Shelley address from an xpub
     * @summary Derive an address
     * @param {string} xpub Hex xpub
     * @param {number} role Account role
     * @param {number} index Address index
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsAddressesXpubXpubRoleIndexGet: async (
      xpub: string,
      role: number,
      index: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'xpub' is not null or undefined
      assertParamExists('utilsAddressesXpubXpubRoleIndexGet', 'xpub', xpub);
      // verify required parameter 'role' is not null or undefined
      assertParamExists('utilsAddressesXpubXpubRoleIndexGet', 'role', role);
      // verify required parameter 'index' is not null or undefined
      assertParamExists('utilsAddressesXpubXpubRoleIndexGet', 'index', index);
      const localVarPath = `/utils/addresses/xpub/{xpub}/{role}/{index}`
        .replace(`{${'xpub'}}`, encodeURIComponent(String(xpub)))
        .replace(`{${'role'}}`, encodeURIComponent(String(role)))
        .replace(`{${'index'}}`, encodeURIComponent(String(index)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Submit an already serialized transaction to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation
     * @param {UtilsTxsEvaluatePostContentTypeEnum} contentType
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsTxsEvaluatePost: async (
      contentType: UtilsTxsEvaluatePostContentTypeEnum,
      body: string,
      version?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'contentType' is not null or undefined
      assertParamExists('utilsTxsEvaluatePost', 'contentType', contentType);
      // verify required parameter 'body' is not null or undefined
      assertParamExists('utilsTxsEvaluatePost', 'body', body);
      const localVarPath = `/utils/txs/evaluate`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (version !== undefined) {
        localVarQueryParameter['version'] = version;
      }

      localVarHeaderParameter['Content-Type'] = 'application/cbor';

      if (contentType != null) {
        localVarHeaderParameter['Content-Type'] = String(contentType);
      }
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        body,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Submit a JSON payload with transaction CBOR and additional UTXO set to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation (additional UTXO set)
     * @param {UtilsTxsEvaluateUtxosPostContentTypeEnum} contentType
     * @param {UtilsTxsEvaluateUtxosPostRequest} utilsTxsEvaluateUtxosPostRequest JSON payload
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsTxsEvaluateUtxosPost: async (
      contentType: UtilsTxsEvaluateUtxosPostContentTypeEnum,
      utilsTxsEvaluateUtxosPostRequest: UtilsTxsEvaluateUtxosPostRequest,
      version?: number,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'contentType' is not null or undefined
      assertParamExists('utilsTxsEvaluateUtxosPost', 'contentType', contentType);
      // verify required parameter 'utilsTxsEvaluateUtxosPostRequest' is not null or undefined
      assertParamExists(
        'utilsTxsEvaluateUtxosPost',
        'utilsTxsEvaluateUtxosPostRequest',
        utilsTxsEvaluateUtxosPostRequest
      );
      const localVarPath = `/utils/txs/evaluate/utxos`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (version !== undefined) {
        localVarQueryParameter['version'] = version;
      }

      localVarHeaderParameter['Content-Type'] = 'application/json';

      if (contentType != null) {
        localVarHeaderParameter['Content-Type'] = String(contentType);
      }
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        utilsTxsEvaluateUtxosPostRequest,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * CardanoUtilitiesApi - functional programming interface
 * @export
 */
export const CardanoUtilitiesApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = CardanoUtilitiesApiAxiosParamCreator(configuration);
  return {
    /**
     * Derive Shelley address from an xpub
     * @summary Derive an address
     * @param {string} xpub Hex xpub
     * @param {number} role Account role
     * @param {number} index Address index
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async utilsAddressesXpubXpubRoleIndexGet(
      xpub: string,
      role: number,
      index: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UtilsAddressesXpub>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.utilsAddressesXpubXpubRoleIndexGet(
        xpub,
        role,
        index,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoUtilitiesApi.utilsAddressesXpubXpubRoleIndexGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Submit an already serialized transaction to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation
     * @param {UtilsTxsEvaluatePostContentTypeEnum} contentType
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async utilsTxsEvaluatePost(
      contentType: UtilsTxsEvaluatePostContentTypeEnum,
      body: string,
      version?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<{ [key: string]: any }>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.utilsTxsEvaluatePost(
        contentType,
        body,
        version,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoUtilitiesApi.utilsTxsEvaluatePost']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Submit a JSON payload with transaction CBOR and additional UTXO set to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation (additional UTXO set)
     * @param {UtilsTxsEvaluateUtxosPostContentTypeEnum} contentType
     * @param {UtilsTxsEvaluateUtxosPostRequest} utilsTxsEvaluateUtxosPostRequest JSON payload
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async utilsTxsEvaluateUtxosPost(
      contentType: UtilsTxsEvaluateUtxosPostContentTypeEnum,
      utilsTxsEvaluateUtxosPostRequest: UtilsTxsEvaluateUtxosPostRequest,
      version?: number,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<{ [key: string]: any }>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.utilsTxsEvaluateUtxosPost(
        contentType,
        utilsTxsEvaluateUtxosPostRequest,
        version,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['CardanoUtilitiesApi.utilsTxsEvaluateUtxosPost']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * CardanoUtilitiesApi - factory interface
 * @export
 */
export const CardanoUtilitiesApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CardanoUtilitiesApiFp(configuration);
  return {
    /**
     * Derive Shelley address from an xpub
     * @summary Derive an address
     * @param {string} xpub Hex xpub
     * @param {number} role Account role
     * @param {number} index Address index
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsAddressesXpubXpubRoleIndexGet(
      xpub: string,
      role: number,
      index: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<UtilsAddressesXpub> {
      return localVarFp
        .utilsAddressesXpubXpubRoleIndexGet(xpub, role, index, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Submit an already serialized transaction to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation
     * @param {UtilsTxsEvaluatePostContentTypeEnum} contentType
     * @param {string} body The transaction to submit, serialized in CBOR.
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsTxsEvaluatePost(
      contentType: UtilsTxsEvaluatePostContentTypeEnum,
      body: string,
      version?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<{ [key: string]: any }> {
      return localVarFp
        .utilsTxsEvaluatePost(contentType, body, version, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Submit a JSON payload with transaction CBOR and additional UTXO set to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Submit a transaction for execution units evaluation (additional UTXO set)
     * @param {UtilsTxsEvaluateUtxosPostContentTypeEnum} contentType
     * @param {UtilsTxsEvaluateUtxosPostRequest} utilsTxsEvaluateUtxosPostRequest JSON payload
     * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    utilsTxsEvaluateUtxosPost(
      contentType: UtilsTxsEvaluateUtxosPostContentTypeEnum,
      utilsTxsEvaluateUtxosPostRequest: UtilsTxsEvaluateUtxosPostRequest,
      version?: number,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<{ [key: string]: any }> {
      return localVarFp
        .utilsTxsEvaluateUtxosPost(contentType, utilsTxsEvaluateUtxosPostRequest, version, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * CardanoUtilitiesApi - object-oriented interface
 * @export
 * @class CardanoUtilitiesApi
 * @extends {BaseAPI}
 */
export class CardanoUtilitiesApi extends BaseAPI {
  /**
   * Derive Shelley address from an xpub
   * @summary Derive an address
   * @param {string} xpub Hex xpub
   * @param {number} role Account role
   * @param {number} index Address index
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoUtilitiesApi
   */
  public utilsAddressesXpubXpubRoleIndexGet(
    xpub: string,
    role: number,
    index: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoUtilitiesApiFp(this.configuration)
      .utilsAddressesXpubXpubRoleIndexGet(xpub, role, index, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Submit an already serialized transaction to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Submit a transaction for execution units evaluation
   * @param {UtilsTxsEvaluatePostContentTypeEnum} contentType
   * @param {string} body The transaction to submit, serialized in CBOR.
   * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoUtilitiesApi
   */
  public utilsTxsEvaluatePost(
    contentType: UtilsTxsEvaluatePostContentTypeEnum,
    body: string,
    version?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoUtilitiesApiFp(this.configuration)
      .utilsTxsEvaluatePost(contentType, body, version, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Submit a JSON payload with transaction CBOR and additional UTXO set to evaluate how much execution units it requires.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Submit a transaction for execution units evaluation (additional UTXO set)
   * @param {UtilsTxsEvaluateUtxosPostContentTypeEnum} contentType
   * @param {UtilsTxsEvaluateUtxosPostRequest} utilsTxsEvaluateUtxosPostRequest JSON payload
   * @param {number} [version] Optional parameter to specify the version of the Ogmios service to use. Default is &#x60;5&#x60;. Set to &#x60;6&#x60; to use Ogmios version 6.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CardanoUtilitiesApi
   */
  public utilsTxsEvaluateUtxosPost(
    contentType: UtilsTxsEvaluateUtxosPostContentTypeEnum,
    utilsTxsEvaluateUtxosPostRequest: UtilsTxsEvaluateUtxosPostRequest,
    version?: number,
    options?: RawAxiosRequestConfig
  ) {
    return CardanoUtilitiesApiFp(this.configuration)
      .utilsTxsEvaluateUtxosPost(contentType, utilsTxsEvaluateUtxosPostRequest, version, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const UtilsTxsEvaluatePostContentTypeEnum = {
  ApplicationCbor: 'application/cbor'
} as const;
export type UtilsTxsEvaluatePostContentTypeEnum =
  (typeof UtilsTxsEvaluatePostContentTypeEnum)[keyof typeof UtilsTxsEvaluatePostContentTypeEnum];
/**
 * @export
 */
export const UtilsTxsEvaluateUtxosPostContentTypeEnum = {
  ApplicationJson: 'application/json'
} as const;
export type UtilsTxsEvaluateUtxosPostContentTypeEnum =
  (typeof UtilsTxsEvaluateUtxosPostContentTypeEnum)[keyof typeof UtilsTxsEvaluateUtxosPostContentTypeEnum];

/**
 * HealthApi - axios parameter creator
 * @export
 */
export const HealthApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * This endpoint provides the current UNIX time. Your application might use this to verify if the client clock is not out of sync.
     * @summary Current backend time
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthClockGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/health/clock`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Return backend status as a boolean. Your application should handle situations when backend for the given chain is unavailable.
     * @summary Backend health status
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/health`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Root endpoint has no other function than to point end users to documentation.
     * @summary Root endpoint
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    rootGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * HealthApi - functional programming interface
 * @export
 */
export const HealthApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = HealthApiAxiosParamCreator(configuration);
  return {
    /**
     * This endpoint provides the current UNIX time. Your application might use this to verify if the client clock is not out of sync.
     * @summary Current backend time
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async healthClockGet(
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<HealthClockGet200Response>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.healthClockGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['HealthApi.healthClockGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Return backend status as a boolean. Your application should handle situations when backend for the given chain is unavailable.
     * @summary Backend health status
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async healthGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<HealthGet200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.healthGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['HealthApi.healthGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Root endpoint has no other function than to point end users to documentation.
     * @summary Root endpoint
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async rootGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Get200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.rootGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['HealthApi.rootGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * HealthApi - factory interface
 * @export
 */
export const HealthApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = HealthApiFp(configuration);
  return {
    /**
     * This endpoint provides the current UNIX time. Your application might use this to verify if the client clock is not out of sync.
     * @summary Current backend time
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthClockGet(options?: RawAxiosRequestConfig): AxiosPromise<HealthClockGet200Response> {
      return localVarFp.healthClockGet(options).then((request) => request(axios, basePath));
    },
    /**
     * Return backend status as a boolean. Your application should handle situations when backend for the given chain is unavailable.
     * @summary Backend health status
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    healthGet(options?: RawAxiosRequestConfig): AxiosPromise<HealthGet200Response> {
      return localVarFp.healthGet(options).then((request) => request(axios, basePath));
    },
    /**
     * Root endpoint has no other function than to point end users to documentation.
     * @summary Root endpoint
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    rootGet(options?: RawAxiosRequestConfig): AxiosPromise<Get200Response> {
      return localVarFp.rootGet(options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * HealthApi - object-oriented interface
 * @export
 * @class HealthApi
 * @extends {BaseAPI}
 */
export class HealthApi extends BaseAPI {
  /**
   * This endpoint provides the current UNIX time. Your application might use this to verify if the client clock is not out of sync.
   * @summary Current backend time
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof HealthApi
   */
  public healthClockGet(options?: RawAxiosRequestConfig) {
    return HealthApiFp(this.configuration)
      .healthClockGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Return backend status as a boolean. Your application should handle situations when backend for the given chain is unavailable.
   * @summary Backend health status
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof HealthApi
   */
  public healthGet(options?: RawAxiosRequestConfig) {
    return HealthApiFp(this.configuration)
      .healthGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Root endpoint has no other function than to point end users to documentation.
   * @summary Root endpoint
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof HealthApi
   */
  public rootGet(options?: RawAxiosRequestConfig) {
    return HealthApiFp(this.configuration)
      .rootGet(options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * IPFSAddApi - axios parameter creator
 * @export
 */
export const IPFSAddApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * You need to `/ipfs/pin/add` an object to avoid it being garbage collected. This usage is being counted in your user account quota.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Add a file to IPFS
     * @param {File} [file]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsAdd: async (file?: File, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/ipfs/add`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;
      const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (file !== undefined) {
        localVarFormParams.append('file', file as any);
      }

      localVarHeaderParameter['Content-Type'] = 'multipart/form-data';

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };
      localVarRequestOptions.data = localVarFormParams;

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * IPFSAddApi - functional programming interface
 * @export
 */
export const IPFSAddApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = IPFSAddApiAxiosParamCreator(configuration);
  return {
    /**
     * You need to `/ipfs/pin/add` an object to avoid it being garbage collected. This usage is being counted in your user account quota.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Add a file to IPFS
     * @param {File} [file]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsAdd(
      file?: File,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<IpfsAdd200Response>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsAdd(file, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSAddApi.ipfsAdd']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * IPFSAddApi - factory interface
 * @export
 */
export const IPFSAddApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = IPFSAddApiFp(configuration);
  return {
    /**
     * You need to `/ipfs/pin/add` an object to avoid it being garbage collected. This usage is being counted in your user account quota.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Add a file to IPFS
     * @param {File} [file]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsAdd(file?: File, options?: RawAxiosRequestConfig): AxiosPromise<IpfsAdd200Response> {
      return localVarFp.ipfsAdd(file, options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * IPFSAddApi - object-oriented interface
 * @export
 * @class IPFSAddApi
 * @extends {BaseAPI}
 */
export class IPFSAddApi extends BaseAPI {
  /**
   * You need to `/ipfs/pin/add` an object to avoid it being garbage collected. This usage is being counted in your user account quota.  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Add a file to IPFS
   * @param {File} [file]
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSAddApi
   */
  public ipfsAdd(file?: File, options?: RawAxiosRequestConfig) {
    return IPFSAddApiFp(this.configuration)
      .ipfsAdd(file, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * IPFSGatewayApi - axios parameter creator
 * @export
 */
export const IPFSGatewayApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Retrieve an object from the IPFS gateway (useful if you do not want to rely on a public gateway, such as `ipfs.blockfrost.dev`).  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Relay to an IPFS gateway
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsGatewayIPFSPathGet: async (
      iPFSPath: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'iPFSPath' is not null or undefined
      assertParamExists('ipfsGatewayIPFSPathGet', 'iPFSPath', iPFSPath);
      const localVarPath = `/ipfs/gateway/{IPFS_path}`.replace(
        `{${'IPFS_path'}}`,
        encodeURIComponent(String(iPFSPath))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * IPFSGatewayApi - functional programming interface
 * @export
 */
export const IPFSGatewayApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = IPFSGatewayApiAxiosParamCreator(configuration);
  return {
    /**
     * Retrieve an object from the IPFS gateway (useful if you do not want to rely on a public gateway, such as `ipfs.blockfrost.dev`).  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Relay to an IPFS gateway
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsGatewayIPFSPathGet(
      iPFSPath: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<File>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsGatewayIPFSPathGet(
        iPFSPath,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSGatewayApi.ipfsGatewayIPFSPathGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * IPFSGatewayApi - factory interface
 * @export
 */
export const IPFSGatewayApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = IPFSGatewayApiFp(configuration);
  return {
    /**
     * Retrieve an object from the IPFS gateway (useful if you do not want to rely on a public gateway, such as `ipfs.blockfrost.dev`).  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Relay to an IPFS gateway
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsGatewayIPFSPathGet(iPFSPath: string, options?: RawAxiosRequestConfig): AxiosPromise<File> {
      return localVarFp
        .ipfsGatewayIPFSPathGet(iPFSPath, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * IPFSGatewayApi - object-oriented interface
 * @export
 * @class IPFSGatewayApi
 * @extends {BaseAPI}
 */
export class IPFSGatewayApi extends BaseAPI {
  /**
   * Retrieve an object from the IPFS gateway (useful if you do not want to rely on a public gateway, such as `ipfs.blockfrost.dev`).  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Relay to an IPFS gateway
   * @param {string} iPFSPath
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSGatewayApi
   */
  public ipfsGatewayIPFSPathGet(iPFSPath: string, options?: RawAxiosRequestConfig) {
    return IPFSGatewayApiFp(this.configuration)
      .ipfsGatewayIPFSPathGet(iPFSPath, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * IPFSPinsApi - axios parameter creator
 * @export
 */
export const IPFSPinsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * Pinning is necessary to avoid regular garbage collection (deletion) of IPFS objects. Non-pinned objects are regularly being removed without prior notice. Pinned objects are counted in your user storage quota.  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Pin an object
     * @param {string} iPFSPath
     * @param {boolean} [filecoin] If set to true, the object will be pinned to Filecoin as well. If not specified, the object will only be pinned to IPFS. Objects pinned to Filecoin cannot be unpinned due to its long-term storage guarantees.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinAddIPFSPathPost: async (
      iPFSPath: string,
      filecoin?: boolean,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'iPFSPath' is not null or undefined
      assertParamExists('ipfsPinAddIPFSPathPost', 'iPFSPath', iPFSPath);
      const localVarPath = `/ipfs/pin/add/{IPFS_path}`.replace(
        `{${'IPFS_path'}}`,
        encodeURIComponent(String(iPFSPath))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (filecoin !== undefined) {
        localVarQueryParameter['filecoin'] = filecoin;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List objects pinned to local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary List pinned objects
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {IpfsPinListGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinListGet: async (
      count?: number,
      page?: number,
      order?: IpfsPinListGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/ipfs/pin/list`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Get information about locally pinned IPFS object  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Get details about pinned object
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinListIPFSPathGet: async (
      iPFSPath: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'iPFSPath' is not null or undefined
      assertParamExists('ipfsPinListIPFSPathGet', 'iPFSPath', iPFSPath);
      const localVarPath = `/ipfs/pin/list/{IPFS_path}`.replace(
        `{${'IPFS_path'}}`,
        encodeURIComponent(String(iPFSPath))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Remove pinned objects from local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Remove a IPFS pin
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinRemoveIPFSPathPost: async (
      iPFSPath: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'iPFSPath' is not null or undefined
      assertParamExists('ipfsPinRemoveIPFSPathPost', 'iPFSPath', iPFSPath);
      const localVarPath = `/ipfs/pin/remove/{IPFS_path}`.replace(
        `{${'IPFS_path'}}`,
        encodeURIComponent(String(iPFSPath))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * IPFSPinsApi - functional programming interface
 * @export
 */
export const IPFSPinsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = IPFSPinsApiAxiosParamCreator(configuration);
  return {
    /**
     * Pinning is necessary to avoid regular garbage collection (deletion) of IPFS objects. Non-pinned objects are regularly being removed without prior notice. Pinned objects are counted in your user storage quota.  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Pin an object
     * @param {string} iPFSPath
     * @param {boolean} [filecoin] If set to true, the object will be pinned to Filecoin as well. If not specified, the object will only be pinned to IPFS. Objects pinned to Filecoin cannot be unpinned due to its long-term storage guarantees.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsPinAddIPFSPathPost(
      iPFSPath: string,
      filecoin?: boolean,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<IpfsPinAddIPFSPathPost200Response>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsPinAddIPFSPathPost(
        iPFSPath,
        filecoin,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSPinsApi.ipfsPinAddIPFSPathPost']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List objects pinned to local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary List pinned objects
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {IpfsPinListGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsPinListGet(
      count?: number,
      page?: number,
      order?: IpfsPinListGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<Array<IpfsPinListGet200ResponseInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsPinListGet(
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSPinsApi.ipfsPinListGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Get information about locally pinned IPFS object  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Get details about pinned object
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsPinListIPFSPathGet(
      iPFSPath: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<IpfsPinListIPFSPathGet200Response>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsPinListIPFSPathGet(
        iPFSPath,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSPinsApi.ipfsPinListIPFSPathGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Remove pinned objects from local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Remove a IPFS pin
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async ipfsPinRemoveIPFSPathPost(
      iPFSPath: string,
      options?: RawAxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<IpfsPinRemoveIPFSPathPost200Response>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.ipfsPinRemoveIPFSPathPost(
        iPFSPath,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['IPFSPinsApi.ipfsPinRemoveIPFSPathPost']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * IPFSPinsApi - factory interface
 * @export
 */
export const IPFSPinsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = IPFSPinsApiFp(configuration);
  return {
    /**
     * Pinning is necessary to avoid regular garbage collection (deletion) of IPFS objects. Non-pinned objects are regularly being removed without prior notice. Pinned objects are counted in your user storage quota.  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Pin an object
     * @param {string} iPFSPath
     * @param {boolean} [filecoin] If set to true, the object will be pinned to Filecoin as well. If not specified, the object will only be pinned to IPFS. Objects pinned to Filecoin cannot be unpinned due to its long-term storage guarantees.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinAddIPFSPathPost(
      iPFSPath: string,
      filecoin?: boolean,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<IpfsPinAddIPFSPathPost200Response> {
      return localVarFp
        .ipfsPinAddIPFSPathPost(iPFSPath, filecoin, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List objects pinned to local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary List pinned objects
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {IpfsPinListGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinListGet(
      count?: number,
      page?: number,
      order?: IpfsPinListGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<IpfsPinListGet200ResponseInner>> {
      return localVarFp
        .ipfsPinListGet(count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Get information about locally pinned IPFS object  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
     * @summary Get details about pinned object
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinListIPFSPathGet(
      iPFSPath: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<IpfsPinListIPFSPathGet200Response> {
      return localVarFp
        .ipfsPinListIPFSPathGet(iPFSPath, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Remove pinned objects from local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
     * @summary Remove a IPFS pin
     * @param {string} iPFSPath
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    ipfsPinRemoveIPFSPathPost(
      iPFSPath: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<IpfsPinRemoveIPFSPathPost200Response> {
      return localVarFp
        .ipfsPinRemoveIPFSPathPost(iPFSPath, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * IPFSPinsApi - object-oriented interface
 * @export
 * @class IPFSPinsApi
 * @extends {BaseAPI}
 */
export class IPFSPinsApi extends BaseAPI {
  /**
   * Pinning is necessary to avoid regular garbage collection (deletion) of IPFS objects. Non-pinned objects are regularly being removed without prior notice. Pinned objects are counted in your user storage quota.  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
   * @summary Pin an object
   * @param {string} iPFSPath
   * @param {boolean} [filecoin] If set to true, the object will be pinned to Filecoin as well. If not specified, the object will only be pinned to IPFS. Objects pinned to Filecoin cannot be unpinned due to its long-term storage guarantees.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSPinsApi
   */
  public ipfsPinAddIPFSPathPost(
    iPFSPath: string,
    filecoin?: boolean,
    options?: RawAxiosRequestConfig
  ) {
    return IPFSPinsApiFp(this.configuration)
      .ipfsPinAddIPFSPathPost(iPFSPath, filecoin, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List objects pinned to local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary List pinned objects
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {IpfsPinListGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSPinsApi
   */
  public ipfsPinListGet(
    count?: number,
    page?: number,
    order?: IpfsPinListGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return IPFSPinsApiFp(this.configuration)
      .ipfsPinListGet(count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Get information about locally pinned IPFS object  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>
   * @summary Get details about pinned object
   * @param {string} iPFSPath
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSPinsApi
   */
  public ipfsPinListIPFSPathGet(iPFSPath: string, options?: RawAxiosRequestConfig) {
    return IPFSPinsApiFp(this.configuration)
      .ipfsPinListIPFSPathGet(iPFSPath, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Remove pinned objects from local storage  <p>   <span class=\"hosted\">Hosted</span> Endpoint only available for hosted variant. </p>  **Note:** If the object was pinned to Filecoin (using `filecoin=true`), it cannot be removed or unpinned due to Filecoin\'s immutable and persistent storage guarantees. Please ensure careful consideration when pinning objects to Filecoin, as the action is irreversible.
   * @summary Remove a IPFS pin
   * @param {string} iPFSPath
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof IPFSPinsApi
   */
  public ipfsPinRemoveIPFSPathPost(iPFSPath: string, options?: RawAxiosRequestConfig) {
    return IPFSPinsApiFp(this.configuration)
      .ipfsPinRemoveIPFSPathPost(iPFSPath, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const IpfsPinListGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type IpfsPinListGetOrderEnum =
  (typeof IpfsPinListGetOrderEnum)[keyof typeof IpfsPinListGetOrderEnum];

/**
 * MetricsApi - axios parameter creator
 * @export
 */
export const MetricsApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * History of your Blockfrost usage metrics per endpoint in the past 30 days.
     * @summary Blockfrost endpoint usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metricsEndpointsGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/metrics/endpoints`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * History of your Blockfrost usage metrics in the past 30 days.
     * @summary Blockfrost usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metricsGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
      const localVarPath = `/metrics`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * MetricsApi - functional programming interface
 * @export
 */
export const MetricsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = MetricsApiAxiosParamCreator(configuration);
  return {
    /**
     * History of your Blockfrost usage metrics per endpoint in the past 30 days.
     * @summary Blockfrost endpoint usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async metricsEndpointsGet(
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MetricsEndpointsInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.metricsEndpointsGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['MetricsApi.metricsEndpointsGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * History of your Blockfrost usage metrics in the past 30 days.
     * @summary Blockfrost usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async metricsGet(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<MetricsInner>>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.metricsGet(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['MetricsApi.metricsGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * MetricsApi - factory interface
 * @export
 */
export const MetricsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = MetricsApiFp(configuration);
  return {
    /**
     * History of your Blockfrost usage metrics per endpoint in the past 30 days.
     * @summary Blockfrost endpoint usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metricsEndpointsGet(
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<MetricsEndpointsInner>> {
      return localVarFp.metricsEndpointsGet(options).then((request) => request(axios, basePath));
    },
    /**
     * History of your Blockfrost usage metrics in the past 30 days.
     * @summary Blockfrost usage metrics
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    metricsGet(options?: RawAxiosRequestConfig): AxiosPromise<Array<MetricsInner>> {
      return localVarFp.metricsGet(options).then((request) => request(axios, basePath));
    }
  };
};

/**
 * MetricsApi - object-oriented interface
 * @export
 * @class MetricsApi
 * @extends {BaseAPI}
 */
export class MetricsApi extends BaseAPI {
  /**
   * History of your Blockfrost usage metrics per endpoint in the past 30 days.
   * @summary Blockfrost endpoint usage metrics
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof MetricsApi
   */
  public metricsEndpointsGet(options?: RawAxiosRequestConfig) {
    return MetricsApiFp(this.configuration)
      .metricsEndpointsGet(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * History of your Blockfrost usage metrics in the past 30 days.
   * @summary Blockfrost usage metrics
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof MetricsApi
   */
  public metricsGet(options?: RawAxiosRequestConfig) {
    return MetricsApiFp(this.configuration)
      .metricsGet(options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * NutLinkApi - axios parameter creator
 * @export
 */
export const NutLinkApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     * List metadata about specific address
     * @summary Specific nut.link address
     * @param {string} address
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressGet: async (
      address: string,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('nutlinkAddressGet', 'address', address);
      const localVarPath = `/nutlink/{address}`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of records of a specific oracle
     * @summary List of tickers of an oracle
     * @param {string} address
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressTickersGet: async (
      address: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('nutlinkAddressTickersGet', 'address', address);
      const localVarPath = `/nutlink/{address}/tickers`.replace(
        `{${'address'}}`,
        encodeURIComponent(String(address))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker for an address
     * @param {string} address
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressTickersTickerGet: async (
      address: string,
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersTickerGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists('nutlinkAddressTickersTickerGet', 'address', address);
      // verify required parameter 'ticker' is not null or undefined
      assertParamExists('nutlinkAddressTickersTickerGet', 'ticker', ticker);
      const localVarPath = `/nutlink/{address}/tickers/{ticker}`
        .replace(`{${'address'}}`, encodeURIComponent(String(address)))
        .replace(`{${'ticker'}}`, encodeURIComponent(String(ticker)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkTickersTickerGet: async (
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkTickersTickerGetOrderEnum,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'ticker' is not null or undefined
      assertParamExists('nutlinkTickersTickerGet', 'ticker', ticker);
      const localVarPath = `/nutlink/tickers/{ticker}`.replace(
        `{${'ticker'}}`,
        encodeURIComponent(String(ticker))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication project_id required
      await setApiKeyToObject(localVarHeaderParameter, 'project_id', configuration);

      if (count !== undefined) {
        localVarQueryParameter['count'] = count;
      }

      if (page !== undefined) {
        localVarQueryParameter['page'] = page;
      }

      if (order !== undefined) {
        localVarQueryParameter['order'] = order;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};

/**
 * NutLinkApi - functional programming interface
 * @export
 */
export const NutLinkApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = NutLinkApiAxiosParamCreator(configuration);
  return {
    /**
     * List metadata about specific address
     * @summary Specific nut.link address
     * @param {string} address
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async nutlinkAddressGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NutlinkAddress>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.nutlinkAddressGet(address, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['NutLinkApi.nutlinkAddressGet']?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of records of a specific oracle
     * @summary List of tickers of an oracle
     * @param {string} address
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async nutlinkAddressTickersGet(
      address: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NutlinkAddressTickersInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.nutlinkAddressTickersGet(
        address,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['NutLinkApi.nutlinkAddressTickersGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker for an address
     * @param {string} address
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async nutlinkAddressTickersTickerGet(
      address: string,
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersTickerGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NutlinkAddressTickerInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.nutlinkAddressTickersTickerGet(
        address,
        ticker,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['NutLinkApi.nutlinkAddressTickersTickerGet']?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async nutlinkTickersTickerGet(
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkTickersTickerGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NutlinkTickersTickerInner>>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.nutlinkTickersTickerGet(
        ticker,
        count,
        page,
        order,
        options
      );
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap['NutLinkApi.nutlinkTickersTickerGet']?.[localVarOperationServerIndex]
          ?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    }
  };
};

/**
 * NutLinkApi - factory interface
 * @export
 */
export const NutLinkApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = NutLinkApiFp(configuration);
  return {
    /**
     * List metadata about specific address
     * @summary Specific nut.link address
     * @param {string} address
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressGet(
      address: string,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<NutlinkAddress> {
      return localVarFp
        .nutlinkAddressGet(address, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of records of a specific oracle
     * @summary List of tickers of an oracle
     * @param {string} address
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressTickersGet(
      address: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<NutlinkAddressTickersInner>> {
      return localVarFp
        .nutlinkAddressTickersGet(address, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker for an address
     * @param {string} address
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkAddressTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkAddressTickersTickerGet(
      address: string,
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkAddressTickersTickerGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<NutlinkAddressTickerInner>> {
      return localVarFp
        .nutlinkAddressTickersTickerGet(address, ticker, count, page, order, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * List of records of a specific ticker
     * @summary Specific ticker
     * @param {string} ticker
     * @param {number} [count] The number of results displayed on one page.
     * @param {number} [page] The page number for listing the results.
     * @param {NutlinkTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    nutlinkTickersTickerGet(
      ticker: string,
      count?: number,
      page?: number,
      order?: NutlinkTickersTickerGetOrderEnum,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<Array<NutlinkTickersTickerInner>> {
      return localVarFp
        .nutlinkTickersTickerGet(ticker, count, page, order, options)
        .then((request) => request(axios, basePath));
    }
  };
};

/**
 * NutLinkApi - object-oriented interface
 * @export
 * @class NutLinkApi
 * @extends {BaseAPI}
 */
export class NutLinkApi extends BaseAPI {
  /**
   * List metadata about specific address
   * @summary Specific nut.link address
   * @param {string} address
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NutLinkApi
   */
  public nutlinkAddressGet(address: string, options?: RawAxiosRequestConfig) {
    return NutLinkApiFp(this.configuration)
      .nutlinkAddressGet(address, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of records of a specific oracle
   * @summary List of tickers of an oracle
   * @param {string} address
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {NutlinkAddressTickersGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NutLinkApi
   */
  public nutlinkAddressTickersGet(
    address: string,
    count?: number,
    page?: number,
    order?: NutlinkAddressTickersGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return NutLinkApiFp(this.configuration)
      .nutlinkAddressTickersGet(address, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of records of a specific ticker
   * @summary Specific ticker for an address
   * @param {string} address
   * @param {string} ticker
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {NutlinkAddressTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NutLinkApi
   */
  public nutlinkAddressTickersTickerGet(
    address: string,
    ticker: string,
    count?: number,
    page?: number,
    order?: NutlinkAddressTickersTickerGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return NutLinkApiFp(this.configuration)
      .nutlinkAddressTickersTickerGet(address, ticker, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * List of records of a specific ticker
   * @summary Specific ticker
   * @param {string} ticker
   * @param {number} [count] The number of results displayed on one page.
   * @param {number} [page] The page number for listing the results.
   * @param {NutlinkTickersTickerGetOrderEnum} [order] The ordering of items from the point of view of the blockchain, not the page listing itself. By default, we return oldest first, newest last.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NutLinkApi
   */
  public nutlinkTickersTickerGet(
    ticker: string,
    count?: number,
    page?: number,
    order?: NutlinkTickersTickerGetOrderEnum,
    options?: RawAxiosRequestConfig
  ) {
    return NutLinkApiFp(this.configuration)
      .nutlinkTickersTickerGet(ticker, count, page, order, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * @export
 */
export const NutlinkAddressTickersGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type NutlinkAddressTickersGetOrderEnum =
  (typeof NutlinkAddressTickersGetOrderEnum)[keyof typeof NutlinkAddressTickersGetOrderEnum];
/**
 * @export
 */
export const NutlinkAddressTickersTickerGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type NutlinkAddressTickersTickerGetOrderEnum =
  (typeof NutlinkAddressTickersTickerGetOrderEnum)[keyof typeof NutlinkAddressTickersTickerGetOrderEnum];
/**
 * @export
 */
export const NutlinkTickersTickerGetOrderEnum = {
  Asc: 'asc',
  Desc: 'desc'
} as const;
export type NutlinkTickersTickerGetOrderEnum =
  (typeof NutlinkTickersTickerGetOrderEnum)[keyof typeof NutlinkTickersTickerGetOrderEnum];
