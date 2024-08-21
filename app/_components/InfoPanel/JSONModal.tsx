import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { PropsWithChildren } from "react";

interface IJSONModal {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}

export const JSONModal = ({
  isOpen,
  onOpenChange,
  title,
  children
}: PropsWithChildren<IJSONModal>) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent className="p-2 bg-content2">
        <ModalHeader className="flex flex-col gap-1 bg-content2">
          {title}
        </ModalHeader>
        <ModalBody className="p-4 bg-content2">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
