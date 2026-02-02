import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import type { PropsWithChildren } from "react";

interface IJSONModal {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}

export const JSONModal = ({
  isOpen,
  onOpenChange,
  title,
  children,
}: PropsWithChildren<IJSONModal>) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent className="modal-content bg-surface p-2">
        <ModalHeader className="flex flex-col gap-1 bg-surface">
          {title}
        </ModalHeader>
        <ModalBody className="bg-surface p-4">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
