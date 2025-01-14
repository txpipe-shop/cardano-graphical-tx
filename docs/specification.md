# Introduction

Our DSL (domain-specific language) is designed to provide an intuitive representation of transactions, allowing users to define certain elements in flexible ways. Through this representation, the goal is to generate CBOR that may not be fully compliant with standard CBOR. This is because our DSL does not require users to specify every item in the CDDL (Concise Data Definition Language), meaning that the resulting CBOR might lack certain information necessary to construct a complete, precise transaction.
For example, input references (UTxO-refs) are the primary identifiers for inputs in CBORs. This means that any additional information about these inputs, is not directly represented in the generated CBOR. This limitation is inherent to the nature of CBOR and how transactions are structured in blockchain systems. The DSL is designed to provide a more human-readable and intuitive way to represent transactions, but it is not a one-to-one mapping to the generated CBOR.
The full specification of the DSL can be found [here](schema.json), and [here](tx_example.json) is a complete compliance example with the especification.

---

As an example, we can show how to build a simple transaction with this DSL. The following transaction represents a transfer of 9 ADA from "wallet-A" to "wallet-B", paying a fee of 1 ADA (e.g 1.000.000 lovelace).

```json
{
  "transaction": {
    "name": "example",
    "fee": 1000000,
    "inputs": [
      {
        "name": "wallet-A",
        "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
        "txHash": "32252D31C9C9D49DC3326FC29343E63F180FDB3872C72BF36658C915E8B81BA3",
        "index": 0,
        "values": [{ "amount": 10000000, "name": "lovelace" }]
      }
    ],
    "outputs": [
      {
        "name": "wallet-B",
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "values": [
          {
            "amount": 9000000,
            "name": "lovelace"
          }
        ]
      }
    ]
  }
}
```

For our example, the CBOR generated from this structure written in the DSL would be the following:

```shell
[{ 0: [[h'32252D31C9C9D49DC3326FC29343E63F180FDB3872C72BF36658C915E8B81BA3', 0]]
 , 1: [{0: h'0022EA12505A9E0B4319497725B9E64E3C99EA510AFE0281CF474704557C7B61CDEC747EF0ED973673295F4FE4A4CA7A4E2E8B80E520FC0DDF', 1: 9000000}]
 , 2: 1000000
 }
, {}
, true
, null
]
```

Notice that in this CBOR, the information about the address, or the values are not reflected on the CBOR.

We can also take in count the following examples:

```json
{
  "transaction": {
    "name": "example",
    "inputs": [
      {
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk"
      }
    ],
    "outputs": [
      {
        "name": "A",
        "values": [{ "amount": 10000000, "name": "lovelace" }]
      },
      {
        "name": "B",
        "values": [{ "amount": 10000000, "name": "lovelace" }]
      }
    ]
  }
}
```

The transaction "example" will have the following resulting CBOR:

```shell
[{0: 258([[h'0000000000000000000000000000000000000000000000000000000000000000', 1]])
, 1: [{0: h'', 1: 10000000}, {0: h'', 1: 10000000}]
, 2: 0}
, {}
, true
, null
]
```

In this case, none of the specified field are contemplated on the resulting CBOR.

## Specification of the DSL

The representation of a transaction consists of a JSON structure that specifies its fields together with additional (descriptive) fields that aid in its comprehension.
The minimal structure must specify the keywords `transaction`, `inputs`, and `outputs` in the following format:

```json
{
  "transaction": {
    "inputs": [],
    "outputs": []
  }
}
```

It is possible to verify that the JSON that represents a transaction is valid by checking some verifier, such as the following: [https://jsonschema.dev/s/CsTl1](https://jsonschema.dev/s/CsTl1).
This can help ensure that the desired transaction can be translated into CBOR later on.

## Inputs/Outputs

Given a transaction, its inputs are references to existing UTxOs (Unspent Transaction Outputs) that are being spent in the current transaction. Those references provide proof that the spender has ownership of the values specified in the input.

On the other hand, outputs are created in the transaction to specify where the values of the inputs are going. They represent new UTXOs that can be spent in future transactions.
Within the inputs and outputs lists, one or more objects can be specified with the following optional fields:

```js
{
 "name": "descriptive name for input or output",
 "address": "address of the owner of the values",
 "values": [],
 "script_ref": "string_hexa",
 "datum": *
}
```

Particularly, for the inputs there are some extra (also optional) fields that can be added:

```js
{
 ...
 "txHash": "hash of UTxO-Ref",
 "index": 0, // index in UTxO-Ref
 "redeemer": { "name": "r", ... },
}
```

The following explains the mentioned fields that can be added:

#### Name

The name is a string that can be used to have a better understanding of the input. It is not reflected on the CBOR.

#### Address

The address is a string that represents the address of the owner that has the values specified on the `values` field (explained later).

A valid address is a string that starts with a prefix, (e.g. `addr_test1` or `addr1` ), followed by a bech32 encoded string.
For example: `addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk`.

In general, any address that follows the format specified by Cardano will be valid. For a better understanding, see [here](https://cips.cardano.org/cip/CIP-19).

#### Values

This field details the tokens and their amount contained in the UTxO. It is a list filled with one or more structures as follows:

```json
{
  "amount": 0,
  "name": "name of token"
}
```

The token name can be expressed either as an ASCII or in the format [PolicyID].[HexaName], for example:

```js
{
  "amount": 10,
  "assetClass": "391589af6db9d9008e3e0952563f8d1d5c18cdb8ea0c300bfc1e60b6.414e4f4e3066396466613433" // [PolicyID].[HexaName] format
}
```

Or as an ASCII:

```json
{
  "amount": 10000000,
  "name": "lovelace"
}
```

For outputs, the `minted` field can be (optionally) specified as follows:

```json
{
  "amount": 0,
  "name": "name of token",
  "minted": "True"
}
```

Alternatively, without specifying it in the output, another section can be added to the `transaction` structure (outside of the output section) where the minted tokens are specified (detailed later).

#### Script Reference

The script reference is a string _(cbor hex)_ that represents a reference to a smart contract.

### Datum

The datum is a piece of data attached to a UTXO which provides context or information for how that UTXO can be used in future transactions.

In the DSL the datum in the inputs/outputs can have any of these 3 fields:

```js
{
 "name": "descriptive name for input",
 . . .,
 "datum": {
  "hash": "32 bytes hash", // Not inline datum
  "bytes": "bytes",        // Inline datum
  "json": {                // Inline datum
    . . .,
  }
 },
}
```

This field will be explained in more detail later.

### TxHash and Index (only for inputs)

They represent the UTxO-Ref: the original transaction that created the UTXO and the position of the UTxO in the original transaction.
It is important to notice that, the UTxO-Ref information (`txHash` and `index` fields) will be the only information relfected on the inputs of the generated CBOR.

### Redeemer (only for inputs)

The spent redeemer information that corresponds with the actual input. Is used for data validation. It is important to note that the specified redeemer will be placed in the corresponding field of the witnesses at the time of generating the CBOR.

---

In addition to the inputs and outputs (with their respective internal fields) sections, the following optional sections can also be added to the transaction:

### Name

Similar to the `name` field in `inputs` and `outputs` section, the name is a string that describes the transaction. It is also not reflected in the cbor.

```json
{
  "transaction": {
    "name": "descriptive name for transaction",
    "inputs": [],
    "outputs": []
  }
}
```

### Fee

It is a number that specifies the cost paid to the network for processing the transaction, based on size and complexity.

```json
{
  "transaction": {
    "fee": 1000000,
    "inputs": [],
    "outputs": []
  }
}
```

### Start

Number that states the earliest time or slot when the transaction is valid (a.k.a invalid before).

```json
{
  "transaction": {
    "start": 0,
    "inputs": [],
    "outputs": []
  }
}
```

### TTL (Time-to-Live)

The expiration time after which the transaction is invalid (invalid hereafter).

```json
{
  "transaction": {
    "ttl": 0,
    "inputs": [],
    "outputs": []
  }
}
```

### Reference inputs

Inputs that provide data from UTxOs without spending them. As the name indicates, it is only used for reference. It is a list field with structures, the same way inputs are filled.

```json
{
  "transaction": {
    "inputs": [],
    "ref_inputs": [],
    "outputs": []
  }
}
```

### Minting

This section consists of a list of token names that were minted in the transaction. It is the alternative way for specifying minting (and/or burning). It has the same structure as the `values` field in the `inputs` section, indicating the amount and the name of the token, as follows:

```json
{
  "transaction": {
    "inputs": [
      {
        "name": "from x",
        "values": [
          { "amount": "N", "name": "lovelace" },
          { "amount": "K", "name": "TokenA" }
        ],
        "script_ref": "string_hexa"
      }
    ],
    "outputs": [],
    "minting": [{ "amount": "K", "name": "TokenA" }]
  }
}
```

### Withdrawals

Withdrawals refer to the action of moving rewards from a staking reward account to a spendable address.
In the DSL this is specified as a list that contains one or more structures as follows:

```json
{
  "raw_address": "spendable wallet's address",
  "amount": 0
}
```

Here we can see it in the complete `transaction` structure:

```js
{
  "transaction": {
    "inputs": [],
    "outputs": [],
    "withdrawals": [
      {
        "raw_address": "spendable wallet's address",
        "amount": 0
      },
      ...
    ]
  }
}
```

### Metadata

It is the additional, arbitrary data attached to the transaction for identification, notes, or app-specific use. It is represented with a json structure:

```js
{
 "transaction":
  {
    "inputs": [],
    "outputs": [],
    "metadata": [
          {
              "label": 674,
              "json_metadata": {
                  "key": "value"
              }
          },
          ...
        ]
  }
}
```
