# Introduction

The DSL aims to intuitively represent a transaction. Through this representation, the goal is to generate a CBOR.
As an example, we can show how to build a simple transaction with this DSL. The following transaction represents a transfer of 9 ADA from "wallet-A" to "wallet-B", paying a fee of 1 ADA.

```json
{
  "transaction": {
    "name": "example",
    "fee": 1,
    "inputs": [
      {
        "name": "wallet-A",
        "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
        "txHash": "32252D31C9C9D49DC3326FC29343E63F180FDB3872C72BF36658C915E8B81BA3",
        "index": 0,
        "value": [{ "amount": 10, "name": "ADA" }]
      }
    ],
    "outputs": [
      {
        "name": "wallet-B",
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "value": [
          {
            "amount": 9,
            "name": "ADA"
          }
        ]
      }
    ]
  }
}
```

The CBOR generated from this structure written in the DSL would be the following:

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

## Specification of the DSL

The representation of the CBOR consists of a JSON structure that specifies the sections of the transaction with additional (descriptive) fields that aid in its comprehension.
The minimal structure must specify the keywords “transaction”, “inputs”, and “outputs” in the following format:

```json
{
  "transaction": {
    "inputs": [],
    "outputs": []
  }
}
```

## Inputs/Outputs

Within the inputs and outputs, one or more structures can be specified with some (optional) fields as following:

```yaml
{
 "name": "descriptive name for input",
 "address": "address",
 "value": [],
 "script_ref": "string_hexa",
 "datum": *
}
```

Inputs have some extra (also optional) fields that can be added:

```yaml
{
 ...
 "txHash": "hash of UTxO-Ref",
 "index": 0, // index in UTxO-Ref
 "redeemer": { "name": "r", ... },
}
```

The following explains the mentioned fields that can be added to inputs and outputs.

### Datum

For datums, there are 3 variants:

- As bytes:

```yaml
{
 "name": "descriptive name for input",
 . . .,
 "datum": "bytes"
}
```

- As a JSON:

```yaml
{
 "name": "descriptive name for input",
 . . .,
 "datum": { "key": "value",... },
}
```

- As an inline datum:

```yaml
{
 "name": "descriptive name for input",
 . . .,
 "datum": "hash",
}
```

### Value

This field is completed with one or more structures as follows:

```yaml
{
  "amount": "amount",
  "name": "name of token"
}
```

The token name can be expressed either as an ASCII name or in the format [PolicyID].[HexaName], for example:

```json
{
  "amount": "amount",
  "name": "391589af6db9d9008e3e0952563f8d1d5c18cdb8ea0c300bfc1e60b6.414e4f4e3066396466613433"
}
```

For outputs, the optional extra field "minted" can be specified:

```json
{
  "amount": "amount",
  "name": "name of token",
  "minted": "True"
}
```

Alternatively, without specifying it in the output, another section can be added to the `transaction` structure (outside of the output section) where the minted tokens are specified (detailed below).

## Minting

This section consists of a list of token names that were minted in the transaction. It has the same structure as the value field in the inputs and outputs, indicating the amount and the name of the token, as follows:

```json
{
  "transaction": {
    "inputs": [
      {
        "name": "from x",
        "value": [
          { "amount": "N", "name": "ADA" },
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

---

In addition to the inputs, outputs (with their respective internal fields), and minting sections (the latter being optional), the following optional sections can also be added to the transaction:

## Name

```json
{
  "transaction": {
    "name": "descriptive name for transaction",
    "inputs": [],
    "outputs": []
  }
}
```

## Fee

```json
{
  "transaction": {
    "fee": 0,
    "inputs": [],
    "outputs": []
  }
}
```

## Start

```json
{
  "transaction": {
    "start": 0,
    "inputs": [],
    "outputs": []
  }
}
```

## TTL

```json
{
  "transaction": {
    "ttl": 0,
    "inputs": [],
    "outputs": []
  }
}
```

## Reference inputs

```json
{
  "transaction": {
    "inputs": [],
    "ref_inputs": [],
    "outputs": []
  }
}
```

## Withdrawals

```json
{
  "transaction": {
    "inputs": [],
    "outputs": [],
    "withdrawals": []
  }
}
```

## Metadata

```yaml
{
 "transaction":
  {
    "inputs": [],
    "outputs": [],
    "auxiliary_data": {“json”: “value”, …}
  }
}
```

---

The full specification of the DSL is in the following file: [Transaction Schema](tx.json)
