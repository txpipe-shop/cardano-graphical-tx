const TOPICS = {
  hash: "Your CBOR data was successfully interpreted as a Cardano transaction.",
  tx: "Your CBOR data was successfully interpreted as a Cardano transaction.",
  era: "Cardano transactions belong to specific eras. The structure of the transaction data is slightly different for each one. The tx payload doesn't have a specific tag to identify the era, this site uses try & error to attempt to decode the CBOR, starting from the most recent era and working are way back.",
  fee: "To execute a transaction, fees need to be paid to the protocol. Cardano transactions are deterministic, we can now in advance exactly how much fees need to be paid, even before submitting the tx. This is the amount of lovelace that this transaction is paying.",
  ttl: "Some transactions specify the maximum slot where they remain valid. If a transaction isn't added to a block before the specified slot, it will not be considered valid by any node.",
  inputs:
    "These are the inputs of the transaction. These are outputs of previous transactions that are going to be 'consumed' by this transaction. Note that instead of repeating data, inputs are expressed as pointers to the corresponding outputs.",
  inputs_hash:
    "This is the hash of the existing tx (the id of the transaction) that holds the output that we're consuming on this current transaction.",
  inputs_index:
    "Since transactions can have multiple outputs, we need to know exactly which one we're consuming. This value represents the index of the output in the source tx.",
  outputs:
    "These are the outputs of the transaction, usually referred to as UTxO. Each item specifies a set of assets (ADA or other tokens) and the address that has control over them. These outputs can be used by future transaction.",
  outputs_address:
    "This is the address that has control over the assets in this output.",
  outputs_lovelace: "This is the amount of Lovelace contained in this output.",
  metadata:
    "This is extra data that can be attached to a transactions. It's generally used to annotate the transaction as reference for further processing, but it doesn't have any effect on the state of the ledger.",
  witnesses:
    "This data presents evidence and values required for the protocol to assert the validity of the transaction.",
  vkey_witness:
    "This is a type of witness that relies on a signature of the body of the transaction by a particular private key.",
  datum:
    "A tx datum represents structured data that is attached to a specific tx output to be used as part of the validation script execution process.",
  datum_hash:
    "This is a hash of the datum to be used as identifier. Tx outputs reference datums by specifying the corresponding hash.",
  datum_json:
    "This is a JSON representation of the datum internal values. This isn't the real encoding, it's just a friendly visualization for us humans.",
  reference_inputs:
    "This is a list of inputs that are referenced by this transaction but not consumed. These inputs are a read-only way to access values from existing UTxOs, allowing transactions to reuse scripts without having to repeat them in each required tx.",
  mints:
    "This is a list of Cardano native tokens minted (or burned) by this transaction.",
};

export default TOPICS;
