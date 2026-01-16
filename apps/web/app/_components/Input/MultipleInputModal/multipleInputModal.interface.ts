import type { OPTIONS } from "~/app/_utils";

export interface MultipleInputModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export interface INewTx {
  type: OPTIONS;
  value: string;
  isNew: boolean;
}
