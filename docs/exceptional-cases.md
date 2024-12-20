# Exceptional cases that are not translatable to a transaction type

Given the flexibility offered by DSL when writing transactions, there are cases where the information is not sufficient or directly translatable to the type of a transaction.
For these cases, we have handled the following considerations:

| Case                                 | Solution/Handling                                             |
|--------------------------------------|---------------------------------------------------------------|
| Names (of Tx, Input, Output)         | Ignored                                                       |
| No Fee                               | Use a fixed fee of zero                                       |
| AssetClass NOT defined (outputs)     | Use a fixed Policy (all 0's) + "name" field converted in hex  |
| No UTxO-Ref (inputs)                 | Use a fixed Hash and define an index                          |

### Names

**DSL**

```js
{
  "transaction": {
    "name": "example",
    "fee": 1000000,
    "inputs": [
        ...,
    ],
    "outputs": [
        ...,
    ]
  }
}
```

**Resulting CBOR**

```js
[{0: 258([]), 1: [], 2: 1000000}, {}, true, null]
```

### No Fee

**DSL**

```js
{
  "transaction": {
    "inputs": [
        ...,
    ],
    "outputs": [
        ...,
    ]
  }
}
```

**Resulting CBOR**

```js
[{0: 258([]), 1: [], 2: 0}, {}, true, null]
```

### AssetClass NOT defined

**DSL**

```js
{
  "transaction": {
    "inputs": [],
    "outputs": [
      {
        "values": [
          {
            "amount": 18000000,
            "name": "TokenName"
          }
        ]
      }
    ]
  }
}
```

**Resulting CBOR**

```js
[{0: 258([]), 1: [0: {h'00000000000000000000000000000000000000000000000000000000': {h'546F6B656E4E616D65': 18000000}}], 2: 0}, {}, true, null]
```

### No UTxO-Ref

**DSL**

```js
{
  "transaction": {
    "name": "example",
    "inputs": [
      {
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk"
      }
    ],
    "outputs": [
        ...,
    ]
  }
}
```

**Resulting CBOR**

```js
[{0: 258([[h'0000000000000000000000000000000000000000000000000000000000000000', 1]]), 1: [], 2: 0}, {}, true, null]
```
