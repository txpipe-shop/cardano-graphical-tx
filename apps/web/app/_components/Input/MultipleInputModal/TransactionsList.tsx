import { Button, Input } from "@heroui/react";
import { Hash } from "@laceanatomy/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { useConfigs, useGraphical, useUI } from "~/app/_contexts";
import {
  getCborFromHash,
  getTransaction,
  getU5CProviderWeb,
  isInputUtxo,
  isOutputUtxo,
  NETWORK,
  OPTIONS,
  ROUTES,
} from "~/app/_utils";
import TrashRedIcon from "~/public/delete-red.svg";
import NoContractsIcon from "~/public/no-contract.svg";
import {
  addCBORsToContext,
  addDevnetCBORsToContext,
} from "../TxInput/txInput.helper";
import { type INewTx } from "./multipleInputModal.interface";

export interface TransactionsListProps {
  newTxs: INewTx[];
  setNewTxs: Dispatch<SetStateAction<INewTx[]>>;
  onOpenChange: () => void;
}

export const TransactionsList = ({
  newTxs,
  setNewTxs,
  onOpenChange,
}: TransactionsListProps) => {
  const { transactions, setTransactionBox, dimensions } = useGraphical();
  const { setError, setLoading } = useUI();
  const { configs } = useConfigs();
  const router = useRouter();

  const handleRemove = (txHash: string) => () => {
    const values = [...newTxs];
    const toDelete = values.splice(
      values.findIndex((input) => input.value === txHash),
      1,
    )[0];
    if (!toDelete) toast.error("Transaction not found");
    if (!toDelete!.isNew) {
      const transactionToRemove = getTransaction(transactions)(
        toDelete!.value,
      )!;
      setTransactionBox((prev) => {
        const inputsToRemove = transactionToRemove.inputs.filter(
          ({ txHash }) => !isOutputUtxo(transactions)(txHash),
        );
        const outputsToRemove = transactionToRemove.outputs.filter(
          ({ txHash }) => !isInputUtxo(transactions)(txHash),
        );

        [...inputsToRemove, ...outputsToRemove].forEach(({ txHash }) => {
          delete prev.utxos[txHash];
        });

        return {
          ...prev,
          transactions: prev.transactions.filter(
            (t) => t.txHash !== transactionToRemove.txHash,
          ),
        };
      });
    } else {
      setNewTxs(values);
    }
  };

  const handleSubmit = async () => {
    try {
      const newCbors = newTxs
        .filter((i) => i.type === OPTIONS.CBOR && i.isNew)
        .map((i) => i.value);
      const newHashes = newTxs.filter(
        (i) => i.type === OPTIONS.HASH && i.isNew,
      );

      if (configs.net === NETWORK.DEVNET) {
        const u5c = getU5CProviderWeb(Number(configs.port));
        const hashesPromises = newHashes.map((hash) =>
          u5c.getCBOR({ hash: Hash(hash.value) }),
        );
        const cbors = await Promise.all(hashesPromises);
        await addDevnetCBORsToContext(
          OPTIONS.CBOR,
          Number(configs.port),
          [...newCbors, ...cbors],
          setError,
          transactions,
          setTransactionBox,
          setLoading,
          { x: dimensions.width, y: dimensions.height },
        );
      } else {
        const hashesPromises = newHashes.map((hash) =>
          getCborFromHash(hash.value, configs.net, setError),
        );
        const cbors = (await Promise.all(hashesPromises)).map(
          ({ cbor }) => cbor,
        );
        await addCBORsToContext(
          OPTIONS.CBOR,
          [...newCbors, ...cbors],
          configs.net,
          setError,
          transactions,
          setTransactionBox,
          setLoading,
          { x: dimensions.width, y: dimensions.height },
        );
      }
      setError("");
      router.push(ROUTES.GRAPHER);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      onOpenChange();
    }
  };

  const newTransactions = newTxs.filter((i) => i.isNew);
  const existingTransactions = newTxs.filter((i) => !i.isNew);

  if (newTxs.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-2xl font-black text-gray-500">
        <Image
          src={NoContractsIcon as string}
          alt="No transactions icon"
          height={100}
          width={100}
        />
        No Transactions Added
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col justify-between">
      <div className="flex flex-col gap-2 overflow-y-auto">
        {newTransactions.length > 0 && (
          <div className="text-xl">Transactions to add</div>
        )}
        {newTransactions.map((tx, index) => (
          <div key={tx.value} className="m-1 flex items-center gap-2">
            <Input
              disabled
              value={tx.value}
              placeholder={`Transaction #${index}`}
              size="sm"
            />
            <Button
              isIconOnly
              variant="flat"
              color="danger"
              radius="sm"
              onPress={handleRemove(tx.value)}
            >
              <Image src={TrashRedIcon} alt="X" />
            </Button>
          </div>
        ))}
        {newTransactions.length > 0 && existingTransactions.length > 0 && (
          <hr className="dark:border-slate-700" />
        )}
        {existingTransactions.length > 0 && (
          <div className="text-xl">Existing transactions</div>
        )}
        {existingTransactions.map((tx, index) => (
          <div key={tx.value} className="m-1 flex items-center gap-2">
            <Input
              disabled
              value={tx.value}
              placeholder={`Transaction #${index}`}
              size="sm"
            />
            <Button
              isIconOnly
              variant="flat"
              color="danger"
              radius="sm"
              onPress={handleRemove(tx.value)}
            >
              <Image src={TrashRedIcon} alt="X" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-4 py-4">
        <Button type="submit" variant="flat" size="md" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};
