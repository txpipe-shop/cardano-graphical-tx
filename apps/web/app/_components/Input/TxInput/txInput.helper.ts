import { type Utxo } from "@laceanatomy/napi-pallas";
import type { cardano } from '@laceanatomy/types';
import { DatumType, Hash, HexString, hexToBech32 } from "@laceanatomy/types";
import { bech32 } from "bech32";
import type { Vector2d } from "konva/lib/types";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type {
  Address,
  IGraphicalTransaction,
  IGraphicalUtxo,
  ITransaction,
  TransactionsBox,
  UtxoObject,
} from "~/app/_interfaces";
import {
  defaultPosition,
  getCborFromHash,
  getTransaction,
  getTxFromCbor,
  getTxFromDevnetCBOR,
  getUtxo,
  isEmpty,
  isHexa,
  KONVA_COLORS,
  NETWORK,
  OPTIONS,
  POINT_SIZE,
  POLICY_LENGTH,
  TX_HEIGHT,
  TX_WIDTH,
  UTXO_LINE_GAP
} from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

interface IGenerateUTXO extends Utxo {
  existingTxs: TransactionsBox;
  pos?: Vector2d;
  isReferenceInput?: boolean;
  distance?: Vector2d;
}

/**
 * Given a bech32|hex address, returns an object with the full address information.
 *
 * @param address - A string representing an address in bech32|hex format.
 * @returns - An object containing the bech32|hex address, the header type, the network type,
 * the payment part, and the kind of address (key or script).
 */
const formatAddress = (address: string, prefix?: string): Address | undefined => {
  if (isEmpty(address)) return undefined;

  let hexAddress = "";
  if (isHexa(address)) {
    hexAddress = address;
  } else {
    // TODO: Add base58 address decoding for byron addresses
    const result = bech32.decodeUnsafe(address, 108);
    if (!result) return undefined;
    const unwords = bech32.fromWords(result.words);
    hexAddress = Buffer.from(unwords).toString("hex");
  }

  const headerType = hexAddress[0];
  const netType = hexAddress[1];
  if (!headerType || !netType) return undefined;

  return {
    bech32: isHexa(address) && prefix ? hexToBech32(HexString(address), prefix) : address,
    headerType,
    netType,
    payment: hexAddress.slice(2, POLICY_LENGTH),
    kind: Number(headerType) % 2 === 0 ? "key" : "script",
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

export async function addDevnetCBORsToContext(
  devnetPort: number,
  uniqueInputs: string[],
  setError: Dispatch<SetStateAction<string>>,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) {
  try {
    setLoading(true);
    const u5c = getU5CProviderWeb(devnetPort);
    const existingTxs = new Map<string, { tx: any; cbor: string }>();

    const getTxAndCbor = async (hash: string): Promise<{ tx: cardano.Tx, cbor: string }> => {
      const exist = existingTxs.get(hash);
      if (exist) return exist;

      const [tx, cbor] = await Promise.all([
        u5c.getTx({ hash: Hash(hash) }),
        u5c.getCBOR({ hash: Hash(hash) }),
      ]);

      const entry = { tx, cbor };
      existingTxs.set(hash, entry);
      return entry;
    };

    const cborAndTx = await Promise.all(
      uniqueInputs.map(async (hash) => getTxAndCbor(hash)),
    );

    console.dir(cborAndTx, { depth: null });

    const parsedTxs: ITransaction[] = await Promise.all(
      cborAndTx.map(async ({ cbor, tx }) => {
        const { tx: txResponse } = await getTxFromDevnetCBOR(cbor);

        const buildUtxos = async (ioArray: cardano.UTxO[]) =>
          Promise.all(
            ioArray.map(async (i) => {
              const hash = i.outRef.hash.toString();
              const { tx: sourceTx, cbor } = await getTxAndCbor(hash);
              const asOutput = sourceTx.outputs.find(
                (o) => o.outRef.index === i.outRef.index,
              );

              return {
                txHash: hash,
                index: Number(i.outRef.index),
                bytes: cbor,
                address: asOutput?.address || "",
                lovelace: Number(asOutput?.coin || 0),
                assets: Object.entries(asOutput?.value || {}).map(
                  ([unit, amount]) => ({
                    policyId: unit.slice(0, POLICY_LENGTH),
                    assetsPolicy: [
                      {
                        assetName: unit.slice(POLICY_LENGTH),
                        assetNameAscii: unit.slice(POLICY_LENGTH),
                        amount: Number(amount),
                      },
                    ],
                  }),
                ),
                datum: asOutput?.datum?.type === DatumType.INLINE ? { bytes: asOutput.datum.datumHex } : undefined,
                scriptRef: typeof asOutput?.referenceScript === 'string' ? asOutput.referenceScript : undefined,
              } as Utxo;
            }),
          );

        const [inputs, referenceInputs] = await Promise.all([
          buildUtxos(tx.inputs),
          buildUtxos(tx.referenceInputs),
        ]);

        return {
          ...txResponse,
          inputs,
          referenceInputs,
          blockHash: tx.block.hash,
          blockHeight: Number(tx.block.height),
          blockTxIndex: Number(tx.indexInBlock),
          blockAbsoluteSlot: Number(tx.block.slot),
        } as ITransaction;
      })
    );

    const graphicalTxs = parseTxToGraphical(parsedTxs, transactions);
    const positionedTxs = setPositions([
      ...graphicalTxs,
      ...transactions.transactions,
    ]);

    let newUtxosObject: UtxoObject = { ...transactions.utxos };
    let newTransactionsList: IGraphicalTransaction[] = [
      ...transactions.transactions,
    ];

    positionedTxs.forEach((tx) => {
      const newUtxos = [...tx.inputs, ...tx.outputs];
      const exists = getTransaction(transactions)(tx.txHash);

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
    console.error(error);
    if (error instanceof Error) {
      setError(error.name === "ConnectError" ? "Could not connect to the devnet" : error.message);
    } else {
      setError(error.statusText);
    }
  } finally {
    setLoading(false);
  }
}

export async function addCBORsToContext(
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
