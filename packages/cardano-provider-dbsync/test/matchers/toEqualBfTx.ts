import { Address, cardano, HexString, hexToBech32, isBase58, DatumType } from '@alexandria/types';
import { TxContentUtxoInputsInner, TxContentUtxoOutputsInner } from '@alexandria/blockfrost-sdk';
import { BfComprehensiveTx } from '../setup';

type BfUtxoLike = TxContentUtxoInputsInner | TxContentUtxoOutputsInner;

/**
 * Creates an outRef key for matching UTxOs between sources
 */
function makeOutRefKey(hash: string, index: number | bigint): string {
  return `${hash}#${index}`;
}

/**
 * Converts Blockfrost amount array to a value object with coin and assets
 */
function bfAmountToValue(amount: { unit: string; quantity: string }[]) {
  const coin = BigInt(amount.find((a) => a.unit === 'lovelace')?.quantity || '0');
  const assets: Record<string, bigint> = {};
  amount
    .filter((a) => a.unit !== 'lovelace')
    .forEach((a) => {
      assets[a.unit] = BigInt(a.quantity);
    });
  return { coin, assets };
}

/**
 * Compares two addresses, normalizing them to the same format
 */
function addressesEqual(received: string, expected: string): boolean {
  return Address(received) === Address(expected);
}

/**
 * Compares asset values between received and expected
 */
function compareAssets(
  receivedValue: Record<string, bigint>,
  expectedAssets: Record<string, bigint>,
  prefix: string,
  failures: string[]
): void {
  const receivedKeys = new Set(Object.keys(receivedValue));
  const expectedKeys = new Set(Object.keys(expectedAssets));

  for (const unit of expectedKeys) {
    if (!receivedKeys.has(unit)) {
      failures.push(
        `${prefix}.assets[${unit}]: expected ${expectedAssets[unit]}, received undefined`
      );
    } else if (receivedValue[unit] !== expectedAssets[unit]) {
      failures.push(
        `${prefix}.assets[${unit}]: expected ${expectedAssets[unit]}, received ${receivedValue[unit]}`
      );
    }
  }

  for (const unit of receivedKeys) {
    if (!expectedKeys.has(unit)) {
      failures.push(
        `${prefix}.assets[${unit}]: unexpected asset with value ${receivedValue[unit]}`
      );
    }
  }
}

/**
 * Compares datum information between received and expected
 */
function compareDatum(
  received: cardano.UTxO,
  expected: BfUtxoLike,
  prefix: string,
  failures: string[]
): void {
  const hasReceivedDatum = received.datum !== undefined;
  const hasExpectedInlineDatum =
    expected.inline_datum !== null && expected.inline_datum !== undefined;
  const hasExpectedDatumHash = expected.data_hash !== null && expected.data_hash !== undefined;

  if (hasExpectedInlineDatum) {
    if (!hasReceivedDatum) {
      failures.push(`${prefix}.datum: expected inline datum, received none`);
    } else if (received.datum?.type !== DatumType.INLINE) {
      failures.push(`${prefix}.datum.type: expected inline, received hash`);
    }
  } else if (hasExpectedDatumHash) {
    if (!hasReceivedDatum) {
      failures.push(`${prefix}.datum: expected datum hash ${expected.data_hash}, received none`);
    } else if (received.datum?.type !== DatumType.HASH) {
      failures.push(`${prefix}.datum.type: expected hash, received inline`);
    } else if (received.datum.datumHashHex !== expected.data_hash) {
      failures.push(
        `${prefix}.datum.hash: expected ${expected.data_hash}, received ${received.datum.datumHashHex}`
      );
    }
  } else if (hasReceivedDatum) {
    failures.push(`${prefix}.datum: expected none, received datum`);
  }
}

/**
 * Compares a single UTxO (input or output)
 */
function compareUtxo(
  received: cardano.UTxO,
  expected: BfUtxoLike,
  prefix: string,
  failures: string[]
): void {
  const bfVal = bfAmountToValue(expected.amount);

  if (!addressesEqual(received.address, expected.address)) {
    failures.push(`${prefix}.address: expected ${expected.address}, received ${received.address}`);
  }

  if (received.coin !== bfVal.coin) {
    failures.push(`${prefix}.coin: expected ${bfVal.coin}, received ${received.coin}`);
  }

  compareAssets(received.value, bfVal.assets, prefix, failures);

  compareDatum(received, expected, prefix, failures);
}

/**
 * Compares UTxO lists by matching on outRef (hash#index) for more robust comparison
 */
function compareUtxoLists(
  received: cardano.UTxO[],
  expected: BfUtxoLike[],
  listName: string,
  failures: string[],
  getExpectedOutRef: (utxo: BfUtxoLike) => { hash: string; index: number }
): void {
  if (received.length !== expected.length) {
    failures.push(`${listName} count: expected ${expected.length}, received ${received.length}`);
  }

  const receivedByOutRef = new Map<string, cardano.UTxO>();
  const receivedByIndex = new Map<number, cardano.UTxO>();

  received.forEach((utxo, idx) => {
    const key = makeOutRefKey(utxo.outRef.hash, utxo.outRef.index);
    receivedByOutRef.set(key, utxo);
    receivedByIndex.set(idx, utxo);
  });

  const expectedByOutRef = new Map<string, { utxo: BfUtxoLike; index: number }>();
  expected.forEach((utxo, idx) => {
    const outRef = getExpectedOutRef(utxo);
    const key = makeOutRefKey(outRef.hash, outRef.index);
    expectedByOutRef.set(key, { utxo, index: idx });
  });

  const matchedReceivedKeys = new Set<string>();
  const matchedExpectedKeys = new Set<string>();

  for (const [key, expectedEntry] of expectedByOutRef) {
    const receivedUtxo = receivedByOutRef.get(key);
    if (receivedUtxo) {
      matchedReceivedKeys.add(key);
      matchedExpectedKeys.add(key);
      compareUtxo(
        receivedUtxo,
        expectedEntry.utxo,
        `${listName}[${expectedEntry.index}]`,
        failures
      );
    }
  }

  for (const [key, expectedEntry] of expectedByOutRef) {
    if (!matchedExpectedKeys.has(key)) {
      failures.push(`${listName}[${expectedEntry.index}]: missing UTxO with outRef ${key}`);
    }
  }

  for (const [key, receivedUtxo] of receivedByOutRef) {
    if (!matchedReceivedKeys.has(key)) {
      failures.push(`${listName}: unexpected UTxO with outRef ${key}`);
    }
  }

  if (received.length === expected.length && failures.length === 0) {
    for (let i = 0; i < received.length; i++) {
      const receivedOutRef = makeOutRefKey(received[i].outRef.hash, received[i].outRef.index);
      const expectedOutRef = getExpectedOutRef(expected[i]);
      const expectedKey = makeOutRefKey(expectedOutRef.hash, expectedOutRef.index);

      if (receivedOutRef !== expectedKey) {
        failures.push(
          `${listName}[${i}] order mismatch: expected outRef ${expectedKey}, received ${receivedOutRef}`
        );
      }
    }
  }
}

export function toEqualBfTx(
  received: cardano.Tx,
  expected: BfComprehensiveTx
): { pass: boolean; message: () => string } {
  const { tx: bfTx, utxos: bfUtxo } = expected;
  const failures: string[] = [];

  // === Basic Transaction Fields ===
  if (received.hash !== bfTx.hash) {
    failures.push(`hash: expected ${bfTx.hash}, received ${received.hash}`);
  }

  if (received.fee.toString() !== bfTx.fees) {
    failures.push(`fee: expected ${bfTx.fees}, received ${received.fee.toString()}`);
  }

  // === Block Info ===
  if (received.block?.hash !== bfTx.block) {
    failures.push(`block.hash: expected ${bfTx.block}, received ${received.block?.hash}`);
  }

  if (received.block?.height !== undefined && received.block.height !== BigInt(bfTx.block_height)) {
    failures.push(`block.height: expected ${bfTx.block_height}, received ${received.block.height}`);
  }

  // === Validity Interval ===
  const receivedInvalidBefore = received.validityInterval?.invalidBefore?.toString() ?? null;
  const expectedInvalidBefore = bfTx.invalid_before;
  if (receivedInvalidBefore !== expectedInvalidBefore) {
    failures.push(
      `validityInterval.invalidBefore: expected ${expectedInvalidBefore}, received ${receivedInvalidBefore}`
    );
  }

  const receivedInvalidHereafter = received.validityInterval?.invalidHereafter?.toString() ?? null;
  const expectedInvalidHereafter = bfTx.invalid_hereafter;
  if (receivedInvalidHereafter !== expectedInvalidHereafter) {
    failures.push(
      `validityInterval.invalidHereafter: expected ${expectedInvalidHereafter}, received ${receivedInvalidHereafter}`
    );
  }

  // === Inputs (excluding reference and collateral) ===
  const bfInputs = bfUtxo.inputs.filter((x) => !x.reference && !x.collateral);
  compareUtxoLists(received.inputs, bfInputs, 'inputs', failures, (utxo) => ({
    hash: (utxo as TxContentUtxoInputsInner).tx_hash,
    index: utxo.output_index
  }));

  // === Reference Inputs ===
  const bfReferenceInputs = bfUtxo.inputs.filter((x) => x.reference === true);
  compareUtxoLists(
    received.referenceInputs,
    bfReferenceInputs,
    'referenceInputs',
    failures,
    (utxo) => ({ hash: (utxo as TxContentUtxoInputsInner).tx_hash, index: utxo.output_index })
  );

  // === Outputs (excluding collateral outputs) ===
  const bfOutputs = bfUtxo.outputs.filter((x) => !x.collateral);
  compareUtxoLists(
    received.outputs,
    bfOutputs,
    'outputs',
    failures,
    // For outputs, the outRef hash is the transaction hash itself
    (utxo) => ({ hash: bfTx.hash, index: (utxo as TxContentUtxoOutputsInner).output_index })
  );

  // === Mint ===
  const receivedMintCount = Object.keys(received.mint || {}).length;
  const expectedMintCount = bfTx.asset_mint_or_burn_count;
  if (receivedMintCount !== expectedMintCount) {
    failures.push(`mint count: expected ${expectedMintCount}, received ${receivedMintCount}`);
  }

  // === Redeemers ===
  const receivedRedeemerCount = received.witnesses?.redeemers?.length ?? 0;
  const expectedRedeemerCount = bfTx.redeemer_count;
  if (receivedRedeemerCount !== expectedRedeemerCount) {
    failures.push(
      `redeemer count: expected ${expectedRedeemerCount}, received ${receivedRedeemerCount}`
    );
  }

  const pass = failures.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? 'Expected transaction values not to be equal'
        : `Transaction mismatch for ${bfTx.hash}:\n${failures.join('\n')}`
  };
}
