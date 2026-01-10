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
      <ModalContent className="modal-content bg-content2 p-2">
        <ModalHeader className="flex flex-col gap-1 bg-content2">
          {title}
        </ModalHeader>
        <ModalBody className="bg-content2 p-4">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
