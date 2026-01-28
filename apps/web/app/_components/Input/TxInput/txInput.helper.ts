import {
  Asset,
  Assets,
  CborResponse,
  Input,
  type Utxo
} from "@laceanatomy/napi-pallas";
import {
  assetNameFromUnit,
  cardano,
  DatumType,
  Hash,
  HexString,
  hexToAscii,
  hexToBech32,
  policyFromUnit,
  Unit
} from "@laceanatomy/types";
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
  getU5CProviderWeb,
  getUtxo,
  isEmpty,
  isHexa,
  KONVA_COLORS,
  OPTIONS,
  POINT_SIZE,
  POLICY_LENGTH,
  TX_HEIGHT,
  TX_WIDTH,
  UTXO_LINE_GAP,
  type Network
} from "~/app/_utils";

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
const formatAddress = (
  address: string,
  prefix?: string,
): Address | undefined => {
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
    bech32:
      isHexa(address) && prefix
        ? hexToBech32(HexString(address), prefix)
        : address,
    headerType,
    netType,
    payment: hexAddress.slice(2, POLICY_LENGTH),
    kind: Number(headerType) % 2 === 0 ? "key" : "script",
  };
};

export const generateGraphicalUTXO = ({
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

export const parseTxToGraphical = (
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
export const setPositions = (
  transactions: IGraphicalTransaction[],
  dimensions: { x: number; y: number },
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

  const totalWidth =
    blocks.size * blockWidth +
    (blocks.size > 1 ? (blocks.size - 1) * POINT_SIZE * 5 : 0);
  const totalHeight = (maxAmountOfTxsInBLock - 1) * TX_HEIGHT * 1.5 + TX_HEIGHT;

  // Position of the first tx
  const initialX = (dimensions.x - totalWidth) / 2 + TX_WIDTH;
  const initialY = (dimensions.y - totalHeight) / 2;

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

export const setITransaction = (
  cborTxs: ITransaction[],
  existingTxs: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  dimensions: { x: number; y: number },
) => {
  try {
    setLoading(true);

    const graphicalTxs = parseTxToGraphical(cborTxs, existingTxs);
    const positionedTxs = setPositions(
      [...graphicalTxs, ...existingTxs.transactions],
      dimensions,
    );

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
    console.error(`Error processing CBOR`, error);
    setError(error.statusText);
  } finally {
    setLoading(false);
  }
};

const setCBORs = async (
  network: Network,
  uniqueInputs: string[],
  existingTxs: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setError: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  dimensions: { x: number; y: number },
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
    const positionedTxs = setPositions(
      [...graphicalTxs, ...existingTxs.transactions],
      dimensions,
    );

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

const cardanoUtxoToITransactionInput = (i: cardano.UTxO, assets: Assets[]): Utxo => {
  return {
    txHash: i.outRef.hash.toString(),
    index: Number(i.outRef.index),
    bytes: "",
    address: i.address.toString(),
    lovelace: Number(i.coin),
    assets,
    datum:
      i.datum && i.datum.type === DatumType.INLINE
        ? {
          bytes: i.datum.datumHex.toString(),
          hash: "",
          json: ""
        }
        : undefined,
    scriptRef: i.referenceScript && i.referenceScript.bytes ? i.referenceScript.bytes.toString() : undefined,
  }
}

const buildUtxo = (inputs: cardano.UTxO[] | Input[]): ITransaction['inputs'] => {
  return inputs.map((i) => {
    if ("outRef" in i) {
      const assets: Assets[] = [];
      for (const [unit, amount] of Object.entries(i.value)) {
        const policyId = policyFromUnit(Unit(unit));
        const assetName = assetNameFromUnit(Unit(unit));
        const asset: Asset = {
          assetName,
          amount: Number(amount),
          assetNameAscii: hexToAscii(assetName),
        };

        const multiasset = assets.find((a) => a.policyId === policyId);
        if (multiasset) {
          multiasset.assetsPolicy.push(asset);
        } else {
          assets.push({
            policyId,
            assetsPolicy: [asset],
          });
        }
      }

      return cardanoUtxoToITransactionInput(i, assets);
    } else {
      return {
        txHash: i.txHash,
        index: Number(i.index),
        address: "",
        assets: [],
        lovelace: 0,
        bytes: ""
      }
    }
  });
};

export async function addDevnetCBORsToContext(
  option: OPTIONS,
  devnetPort: number,
  uniqueInputs: string[],
  setError: Dispatch<SetStateAction<string>>,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  dimensions: { x: number; y: number },
) {
  try {
    setLoading(true);
    const u5c = getU5CProviderWeb(devnetPort);
    const existingTxs = new Map<string, { tx: cardano.Tx; cbor: string }>();

    const getTxAndCbor = async (
      hash: string,
    ): Promise<{ tx: cardano.Tx; cbor: string }> => {
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

    const cborAndTx: {
      cbor: string;
      tx?: cardano.Tx;
      cborParsed?: CborResponse;
    }[] = [];
    if (option === OPTIONS.CBOR) {
      const incompleteTxs = await Promise.all(
        uniqueInputs.map(async (cbor) => {
          const { tx } = await getTxFromDevnetCBOR(cbor);
          return { tx, cbor };
        }),
      );

      const completedTxs = await Promise.all(
        incompleteTxs.map(async ({ tx, cbor }) => {
          const fullTx = await u5c
            .getTx({ hash: Hash(tx.txHash) })
            .catch(() => undefined);
          return { cbor, tx: fullTx, cborParsed: tx };
        }),
      );
      cborAndTx.push(...completedTxs);
    } else {
      cborAndTx.push(
        ...(await Promise.all(
          uniqueInputs.map(async (hash) => getTxAndCbor(hash)),
        )),
      );
    }

    const parsedTxs: ITransaction[] = await Promise.all(
      cborAndTx.map(async ({ cbor, tx, cborParsed }) => {
        const txResponse = cborParsed
          ? cborParsed
          : (await getTxFromDevnetCBOR(cbor)).tx;

        return {
          ...txResponse,
          fee: txResponse.fee || 0,
          inputs: buildUtxo(tx ? tx.inputs : cborParsed?.inputs || []),
          referenceInputs: buildUtxo(tx ? tx.referenceInputs : cborParsed?.referenceInputs || []),
          blockHash: tx ? tx.block.hash : undefined,
          blockHeight: tx ? Number(tx.block.height) : undefined,
          blockTxIndex: tx ? Number(tx.indexInBlock) : undefined,
          blockAbsoluteSlot: tx ? Number(tx.block.slot) : undefined,
        };
      }),
    );

    const graphicalTxs = parseTxToGraphical(parsedTxs, transactions);
    const positionedTxs = setPositions(
      [...graphicalTxs, ...transactions.transactions],
      dimensions,
    );

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
      setError(
        error.name === "ConnectError"
          ? "Could not connect to the devnet"
          : error.message,
      );
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
  net: Network,
  setError: Dispatch<SetStateAction<string>>,
  transactions: TransactionsBox,
  setTransactionBox: Dispatch<SetStateAction<TransactionsBox>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  dimensions: { x: number; y: number },
) {
  setLoading(true);
  try {
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
        dimensions,
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
        dimensions,
        false,
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
