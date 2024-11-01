# Introduction

The DSL aims to intuitively represent a transaction. Through this representation, the goal is to generate a CBOR.
As an example, we can show how to build a simple transaction with this DSL. The following transaction represents a transfer of 9 ADA from "wallet-A" to "wallet-B", paying a fee of 1 ADA.

```json
{
 "transaction": {
   "name": "example",
   "fee": 1,
   "inputs":
    [
     {
       "name": "wallet-A",
       "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
       "txHash": "32252D31C9C9D49DC3326FC29343E63F180FDB3872C72BF36658C915E8B81BA3",
       "index": 0,
       "value": [ { "amount": 10, "name": "ADA" } ],
     }
   ],
   "outputs":
    [
     {
       "name": "wallet-B",
       "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
       "value": [
       {
         "amount": 9,
         "name": "ADA"
       }
 ],
     }
   ]
 }
}
```

The CBOR generated from this structure written in the DSL would be the following:

``` shell
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

``` json
{
  "transaction":
  {
    "inputs": [],
    "outputs": []
  }
}
```

The full specification of the DSL is in the following file: [Transaction Schema](tx.json)
