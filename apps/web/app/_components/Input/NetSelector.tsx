import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useConfigs, useUI } from "~/app/_contexts";
import { DEFAULT_DEVNET_PORT, NETWORK, USER_CONFIGS } from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

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
  const [netStatus, setNetStatus] = useState<"success" | "danger" | "warning">("success");
  const { configs, updateConfigs } = useConfigs();
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const { setError } = useUI();

  const handleClick = (network: NETWORK) => () => {
    updateConfigs(USER_CONFIGS.NET, network);
    onClose();
  };

  const handlePortChange = (port: string) => {
    setNetStatus("warning");
    updateConfigs(USER_CONFIGS.PORT, port);
  };

  useEffect(() => {
    setError("");
    if (configs.net !== NETWORK.DEVNET) {
      setNetStatus("success");
    } else {
      const port = configs.port || DEFAULT_DEVNET_PORT;
      setNetStatus("warning");

      const timeoutId = setTimeout(() => {
        if (!port || port === "") {
          setNetStatus("danger");
          return;
        }

        const portNumber = parseInt(port, 10);
        if (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535) {
          setNetStatus("danger");
          return;
        }

        const u5c = getU5CProviderWeb(portNumber);
        u5c.readTip().then(() => {
          setNetStatus("success");
        }).catch(() => {
          setNetStatus("danger");
          setError("Failed to connect to the devnet");
        });
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [configs.port, configs.net]);

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
          color={netStatus}
          size="lg"
          classNames={{
            base: "py-0 flex items-center overflow-clip cursor-pointer",
            content: "px-2 min-h-max capitalize",
          }}
          endContent={
            configs.net === NETWORK.DEVNET ? (
              <PortInput
                port={configs.port || DEFAULT_DEVNET_PORT}
                onPortChange={handlePortChange}
              />
            ) : null
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
    </Popover>
  );
};
