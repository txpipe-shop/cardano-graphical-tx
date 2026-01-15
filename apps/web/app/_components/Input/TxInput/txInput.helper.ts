import { type Dispatch, type SetStateAction } from "react";
import type {
  IGraphicalTransaction,
  ITransaction,
  TransactionsBox,
  UtxoObject,
} from "~/app/_interfaces";
import {
  KONVA_COLORS,
  OPTIONS,
  POINT_SIZE,
  POLICY_LENGTH,
  TX_HEIGHT,
  TX_WIDTH,
  UTXO_LINE_GAP,
  defaultPosition,
  getCborFromHash,
  getTransaction,
  getTxFromCbor,
  getUtxo,
  isEmpty,
  isHexa,
  type NETWORK,
} from "~/app/_utils";

import type { Utxo } from "@laceanatomy/napi-pallas";
import { bech32 } from "bech32";
import type { Vector2d } from "konva/lib/types";
import toast from "react-hot-toast";
import type { Address, IGraphicalUtxo } from "~/app/_interfaces";

interface IGenerateUTXO extends Utxo {
  existingTxs: TransactionsBox;
  pos?: Vector2d;
  isReferenceInput?: boolean;
  distance?: Vector2d;
}

/**
 * Given a bech32 address, returns an object with the full address information.
 *
 * @param address - A string representing an address in bech32 format.
 * @returns - An object containing the bech32 address, the header type, the network type,
 * the payment part, and the kind of address (key or script).
 */
const formatAddress = (address: string): Address | undefined => {
  let hexAddress = "";
  if (!isEmpty(address)) {
    // TODO: Add base58 address decoding for byron addresses
    const result = bech32.decodeUnsafe(address, 108);
    if (!result) return undefined;
    const unwords = bech32.fromWords(result.words);
    hexAddress = Buffer.from(unwords).toString("hex");
  }
  return isEmpty(address) || !hexAddress[0] || !hexAddress[1]
    ? undefined
    : {
        bech32: address,
        headerType: hexAddress[0],
        netType: hexAddress[1],
        payment: hexAddress.slice(2, POLICY_LENGTH),
        kind: Number(hexAddress[0]) % 2 === 0 ? "key" : "script",
      };
};

const generateGraphicalUTXO = ({
  txHash,
  index,
  bytes,
  address,
  lovelace,
  datum,
  assets,
  scriptRef,
  existingTxs,
  pos = defaultPosition,
  distance = defaultPosition,
  isReferenceInput = false,
}: IGenerateUTXO): IGraphicalUtxo => {
  const exist = getUtxo(existingTxs)(txHash + "#" + index);
  if (exist) return exist;

  return {
    txHash: txHash + "#" + index,
    index,
    bytes,
    address: formatAddress(address),
    lovelace,
    datum,
    assets,
    scriptRef,
    lines: [],
    pos,
    distance,
    isReferenceInput,
  };
};

const parseTxToGraphical = (
  txFromCbors: ITransaction[],
  existingTxs: TransactionsBox,
): IGraphicalTransaction[] =>
  txFromCbors.map((cbor) => {
    const inputs: IGraphicalUtxo[] = cbor.referenceInputs
      .concat(cbor.inputs)
      .map((input) =>
        generateGraphicalUTXO({
          ...input,
          existingTxs,
          isReferenceInput: cbor.referenceInputs.some(
            (referenceInput) => referenceInput === input,
          ),
        }),
      );

    const outputs = cbor.outputs.map((output) =>
      generateGraphicalUTXO({
        ...output,
        existingTxs,
      }),
    );
    const existsTx = getTransaction(existingTxs)(cbor.txHash);
    const alias = existsTx ? existsTx.alias : "";

    return {
      ...cbor,
      pos: defaultPosition,
      outputs,
      inputs,
      producedLines: [],
      consumedLines: [],
      alias,
    };
  });

/**
 * Calculates the positions of the UTXOs in a transaction.
 * @returns An array of UTXO items with their positions updated.
 */
const setUtxoPosition = (
  utxoList: IGraphicalUtxo[],
  txPos: Vector2d,
  isOutput: boolean,
): IGraphicalUtxo[] => {
  const length = utxoList.length;
  // hasSpace checks if there is enough space to fit all utxos in the tx_height
  const hasSpace = (length - 1) * UTXO_LINE_GAP > TX_HEIGHT;
  // margin is the space between the first (top) utxo and the top of the tx when utxos dont fit in the tx_height
  const margin = hasSpace ? ((length - 1) * UTXO_LINE_GAP - TX_HEIGHT) / 2 : 0;

  return utxoList.map((utxo, index) => {
    const distanceBetweenPoints = TX_HEIGHT / (length + 1);

    const y = hasSpace
      ? txPos.y - margin + index * UTXO_LINE_GAP
      : txPos.y + distanceBetweenPoints * (index + 1);

    const x = isOutput ? txPos.x + 2 * TX_WIDTH : txPos.x - TX_WIDTH;

    return {
      ...utxo,
      pos: { x, y },
      distance: { x: isOutput ? 2 * TX_WIDTH : -TX_WIDTH, y: y - txPos.y },
      isReferenceInput: utxo.isReferenceInput,
    };
  });
};

/** Calculates the position of the transaction on the canvas. */
const setPositions = (
  transactions: IGraphicalTransaction[],
): IGraphicalTransaction[] => {
  const blockWidth = 3 * TX_WIDTH;
  const blocks = new Set(transactions.map((tx) => tx.blockHeight).sort()); // Blocks containing the txs
  const normalizedBlockIndex = transactions.reduce(
    // Txs grouped by block
    (acc: { [key: number]: string[] }, tx) => {
      if (tx.blockHeight && acc[tx.blockHeight])
        acc[tx.blockHeight]!.push(tx.txHash);
      else if (tx.blockHeight && !acc[tx.blockHeight])
        acc[tx.blockHeight] = [tx.txHash];
      // For transactions without block
      else if (acc[-1]) acc[-1]!.push(tx.txHash);
      else acc[-1] = [tx.txHash];
      return acc;
    },
    {},
  );
  const maxAmountOfTxsInBLock = Math.max(
    ...Object.values(normalizedBlockIndex).map((txs) => txs.length),
  );
  const boxSizeX = blockWidth * blocks.size - (1 / 2) * blockWidth;
  const boxSizeY =
    TX_HEIGHT * maxAmountOfTxsInBLock + 0.05 * window.innerHeight;
  // Position of the first tx
  const initialX = window.innerWidth / 2 - boxSizeX / 2;
  const initialY = window.innerHeight / 2 - boxSizeY / 2;

  return transactions.map((tx) => {
    const blockIndex =
      blocks.size === 1
        ? 0
        : Array.from(blocks).findIndex((block) => block === tx.blockHeight);
    let indexInBlock = normalizedBlockIndex[tx.blockHeight ?? -1]!.findIndex(
      (txHash) => txHash === tx.txHash,
    );
    // Gap between blocks. Its zero if the tx is the first in the block
    const blockGap = blockIndex % blocks.size ? POINT_SIZE * 5 : 0;
    const pos = {
      x: initialX + (blockWidth + blockGap) * blockIndex,
      y: initialY + TX_HEIGHT * 1.5 * indexInBlock,
    };

    const inputs = setUtxoPosition(tx.inputs, pos, false);

    const sortedOutputs = tx.outputs.sort((a, b) => a.index - b.index);
    const outputs = setUtxoPosition(sortedOutputs, pos, true);

    return { ...tx, inputs, outputs, pos };
  });
};

const setCBORs = async (
  network: NETWORK,
  uniqueInputs: string[],
  existingTxs: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  fromHash?: boolean,
) => {
  try {
    setLoading(true);
    uniqueInputs.map((cbor) => {
      if (!isHexa(cbor)) throw new Error("Invalid CBOR: " + cbor);
    });

    const cborPromises = uniqueInputs.map((cbor) =>
      getTxFromCbor(cbor, network),
    );

    const repeatedTxs: ITransaction[] = [];
    const cborTxs = await Promise.all(cborPromises);
    cborTxs.forEach((cbor) =>
      existingTxs.transactions.forEach((tx) => {
        if (cbor.txHash === tx.txHash) repeatedTxs.push(cbor);
      }),
    );

    const filteredCbors = cborTxs.filter((cbor) => !repeatedTxs.includes(cbor));
    const graphicalTxs = parseTxToGraphical(filteredCbors, existingTxs);
    const positionedTxs = setPositions([
      ...graphicalTxs,
      ...existingTxs.transactions,
    ]);

    let newUtxosObject: UtxoObject = { ...existingTxs.utxos };
    let newTransactionsList: IGraphicalTransaction[] = [
      ...existingTxs.transactions,
    ];

    positionedTxs.forEach((tx) => {
      const newUtxos = [...tx.inputs, ...tx.outputs];
      const exists = getTransaction(existingTxs)(tx.txHash);

      if (exists) {
        // If the transaction already exists, update the position and add the new UTXOs
        const txIndex = newTransactionsList.findIndex(
          (txMap) => txMap.txHash === exists.txHash,
        );
        if (txIndex !== -1)
          newTransactionsList[txIndex] = { ...tx, pos: tx.pos };
      } else {
        // If the transaction doesn't exist, add it and the new UTXOs
        newTransactionsList.push(tx);
      }

      newUtxos.forEach((utxo) => (newUtxosObject[utxo.txHash] = utxo));
    });
    setTransactionBox({
      transactions: newTransactionsList,
      utxos: newUtxosObject,
    });
  } catch (error: Response | any) {
    console.error(`Error processing ${fromHash ? "hash" : "CBOR"}:`, error);
    setError(error.statusText);
  } finally {
    setLoading(false);
  }
};

export default async function addCBORsToContext(
  option: OPTIONS,
  uniqueInputs: string[],
  net: NETWORK,
  setError: Dispatch<SetStateAction<string>>,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) {
  if (option === OPTIONS.HASH) {
    const hashesPromises = uniqueInputs.map((hash) =>
      getCborFromHash(hash, net, setError),
    );
    const cbors = await Promise.all(hashesPromises);
    const cborsToSet: string[] = [];
    cbors.map(({ warning, cbor }) => {
      if (warning) {
        toast.error(warning, {
          icon: "🚫",
          style: { fontWeight: "bold", color: KONVA_COLORS.RED_WARNING },
          duration: 5000,
        });
        return;
      }
      cborsToSet.push(cbor);
    });
    await setCBORs(
      net,
      cborsToSet,
      transactions,
      setTransactionBox,
      setError,
      setLoading,
      true,
    );
  } else {
    await setCBORs(
      net,
      uniqueInputs,
      transactions,
      setTransactionBox,
      setError,
      setLoading,
      false,
    );
  }
}
