# Summary
The **utxo-explorer** is a web app that allows users to explore transactions on UTxO model based blockchain networks. To do this it retrieves information from a UTxORPC compatible node- initially, this will be a locally running instance of Dolos or a deployed instance of Dolos. The web app initially provides the deployed instance of Dolos for preview and preprod.
It has two pages: the main page (Home) and a page to view transaction details (Tx View).
# Interface
## Home
The main page will show a list of the last 10 transactions registered where each item will contain the following information (if available):
- Date of creation
- Hash (which redirects to the TxView of the corresponding transaction)
- Inputs: with the address (and maybe the utxo-ref)
- Outputs: with the address
- Fee

It will also display an option to add the local provider. To do so, the user will need to complete the following:
- The port that exposes the endpoints from dolos
- The port where the UTxORPC node runs
- The corresponding devnet (Preprod or Preview)
## Tx View
This page displays the transaction details, organized into the following tabs.
### Overview
This is the default tab, which provides details (if available) about:
- Date of creation
- Hash
- Epoch
- Block hash, height and slot
- Fee
- Mint amount
- Burn amount
- Reference inputs: UTxO-ref, address
- Inputs: UTxO-ref, address, value, if it has datum, and if it has a script associated with it.
- Outputs: index, address, value, if it has datum; and if it has a script address, a reference to the script tab where the script info is displayed.
### Diagram
This tab displays the transaction as a diagram, similar to how LaceAnatomy does. Both the transaction and its inputs and outputs are draggable. Icons indicate whether the transaction involves minting or burning. By clicking on any input or output, information about their address and value (if available) becomes visible.
### Dissect
This tab displays the dissected transaction, similar to how LaceAnatomy does, with collapsible sections.
### CBOR
This tab displays the transaction in CBOR and diagnostic notation (later CBOR can be edited to obtain the diagnostic notation and vice versa).
### Datum
This tab displays, for every datum in the inputs/outputs (in different tabs), it displays the datum hash, cbor, and its diagnostic notation.
### Scripts
This tab displays scripts that were executed and scripts that are related to any output, each in a different tab.
For every executed script it displays the script hash, mem and cpu, redeemer and purpose and if it has datum. If it was executed on an input, it displays the utxo-ref where it was executed.
For every script associated with an output, it displays the hash and the cbor, and the utxo-ref of the output it is associated with.
