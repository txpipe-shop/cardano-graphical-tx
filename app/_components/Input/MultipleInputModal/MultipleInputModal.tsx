import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useGraphical } from "~/app/_contexts/graphical.context";
import { OPTIONS } from "~/app/_utils";
import { TransactionAdd } from "./TransactionAdd";
import { TransactionsList } from "./TransactionsList";
import {
  type INewTx,
  type MultipleInputModalProps,
} from "./multipleInputModal.interface";

export const MultipleInputModal = ({
  isOpen,
  onOpenChange,
}: MultipleInputModalProps) => {
  const [newTxs, setNewTxs] = useState<INewTx[]>([]);
  const { transactions } = useGraphical();

  useEffect(() => {
    if (transactions.transactions.length === 0) return;
    setNewTxs(
      transactions.transactions.map((tx) => ({
        type: OPTIONS.HASH,
        value: tx.txHash,
        isNew: false,
      })),
    );
  }, [transactions]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "auto";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.scrollbarGutter = "stable";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.scrollbarGutter = "stable";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
    >
      <ModalContent>
        <ModalBody className="h-96 py-4">
          <TransactionAdd inputs={newTxs} setInputs={setNewTxs} />
          <TransactionsList
            newTxs={newTxs}
            setNewTxs={setNewTxs}
            onOpenChange={onOpenChange}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
