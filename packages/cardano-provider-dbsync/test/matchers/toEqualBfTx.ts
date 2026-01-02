import { Address, cardano, HexString, hexToBech32, isBase58 } from '@alexandria/types';
import { BfComprehensiveTx } from '../setup';

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

export function toEqualBfTx(
  received: cardano.Tx,
  expected: BfComprehensiveTx
): { pass: boolean; message: () => string } {
  const { tx: bfTx, utxos: bfUtxo } = expected;

  const failures: string[] = [];

  if (received.hash !== bfTx.hash) {
    failures.push(`hash: expected ${bfTx.hash}, received ${received.hash}`);
  }
  if (received.fee.toString() !== bfTx.fees) {
    failures.push(`fee: expected ${bfTx.fees}, received ${received.fee.toString()}`);
  }
  if (received.block?.hash !== bfTx.block) {
    failures.push(`blockHash: expected ${bfTx.block}, received ${received.block?.hash}`);
  }

  const bfInputs = bfUtxo.inputs.filter((x) => !x.reference && !x.collateral);
  if (received.inputs.length !== bfInputs.length) {
    failures.push(
      `inputs count: expected ${bfUtxo.inputs.length}, received ${received.inputs.length}`
    );
  } else {
    received.inputs.forEach((input, i) => {
      const bfIn = bfInputs[i];
      const bfVal = bfAmountToValue(bfIn.amount);

      if (input.address !== Address(bfIn.address)) {
        failures.push(`input[${i}].address: expected ${bfIn.address}, received ${input.address}`);
      }
      if (input.coin !== bfVal.coin) {
        failures.push(`input[${i}].coin: expected ${bfVal.coin}, received ${input.coin}`);
      }

      for (const [unit, qty] of Object.entries(bfVal.assets)) {
        if (input.value[unit as any] !== qty) {
          failures.push(
            `input[${i}].assets[${unit}]: expected ${qty}, received ${input.value[unit as any]}`
          );
        }
      }
    });
  }

  if (received.outputs.length !== bfUtxo.outputs.length) {
    failures.push(
      `outputs count: expected ${bfUtxo.outputs.length}, received ${received.outputs.length}`
    );
  } else {
    received.outputs.forEach((output, i) => {
      const bfOut = bfUtxo.outputs[i];
      const bfVal = bfAmountToValue(bfOut.amount);

      if (output.address !== Address(bfOut.address)) {
        failures.push(
          `output[${i}].address: expected ${bfOut.address}, received ${output.address}`
        );
      }
      if (output.coin !== bfVal.coin) {
        failures.push(`output[${i}].coin: expected ${bfVal.coin}, received ${output.coin}`);
      }
      for (const [unit, qty] of Object.entries(bfVal.assets)) {
        if (output.value[unit as any] !== qty) {
          failures.push(
            `output[${i}].assets[${unit}]: expected ${qty}, received ${output.value[unit as any]}`
          );
        }
      }
    });
  }

  const pass = failures.length === 0;

  return {
    pass,
    message: () =>
      pass ? 'Expected values not to be equal' : `Transaction mismatch:\n${failures.join('\n')}`
  };
}
