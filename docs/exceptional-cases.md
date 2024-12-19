# Exceptional cases that are not translatable to a transaction type

Given the flexibility offered by DSL when writing transactions, there are cases where the information is not sufficient or directly translatable to the type of a transaction.
For these cases, we have handled the following considerations:

| Case                                 | Solution/Handling                                             |
|--------------------------------------|---------------------------------------------------------------|
| Names (of Tx, Input, Output)         | Ignored                                                       |
| No Fee                               | Use a fixed fee of zero                                       |
| AssetClass NOT defined (outputs)     | Use a fixed Policy (all 0's) + "name" field converted in hex  |
| No UTxO-Ref (inputs)                 | Use a fixed Hash and define an index                          |
