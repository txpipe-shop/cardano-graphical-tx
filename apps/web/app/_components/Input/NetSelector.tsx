import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { useConfigs } from "~/app/_contexts";
import { NETWORK, USER_CONFIGS } from "~/app/_utils";

interface NetSelectorProps {
  network: NETWORK;
}

interface PortInputProps {
  port: string;
  onPortChange: (port: string) => void;
}

const PortInput = ({ port, onPortChange }: PortInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      onPortChange(value);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) =>
    e.stopPropagation();
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.stopPropagation();

  return (
    <div className="flex-1 text-inherit font-normal pl-2 min-h-max capitalize border-l-2 border-gray-300 h-full">
      <input
        type="text"
        inputMode="numeric"
        className="min-w-[4ch] w-[5ch] text-center bg-transparent tabular-nums outline-none h-full"
        value={port}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={handleFocus}
      />
    </div>
  );
};

export const NetSelector = ({ network }: NetSelectorProps) => {
  const { configs, updateConfigs } = useConfigs();
  const { isOpen, onClose, onOpenChange } = useDisclosure();

  const handleClick = (network: NETWORK) => () => {
    updateConfigs(USER_CONFIGS.NET, network);
    onClose();
  };

  const handlePortChange = (port: string) => {
    updateConfigs(USER_CONFIGS.PORT, port);
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
          size="lg"
          classNames={{
            base: "py-0 flex items-center overflow-clip cursor-pointer",
            content: "px-2 min-h-max capitalize",
          }}
          endContent={
            configs.net === NETWORK.DEVNET ? <PortInput port={configs.port || "50051"} onPortChange={handlePortChange} /> : null
          }
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
    </Popover >
  );
};
