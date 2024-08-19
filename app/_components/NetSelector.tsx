import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { useConfigs } from "../_contexts";
import { NETWORK } from "../_utils";

interface NetSelectorProps {
  network: NETWORK;
}

export const NetSelector = ({ network }: NetSelectorProps) => {
  const { updateConfigs } = useConfigs();
  const { isOpen, onClose, onOpenChange } = useDisclosure();

  const handleClick = (network: NETWORK) => () => {
    updateConfigs("net", network);
    onClose();
  };

  return (
    <Popover
      placement="bottom"
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showArrow
    >
      <PopoverTrigger>
        <Chip
          variant="dot"
          color="success"
          className="cursor-pointer capitalize"
        >
          {network}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="flex gap-1">
        {Object.values(NETWORK).map((value, index) => (
          <Chip
            key={index}
            variant="dot"
            color={network === value ? "success" : "danger"}
            className="cursor-pointer capitalize"
            onClick={handleClick(value)}
          >
            {value}
          </Chip>
        ))}
      </PopoverContent>
    </Popover>
  );
};
