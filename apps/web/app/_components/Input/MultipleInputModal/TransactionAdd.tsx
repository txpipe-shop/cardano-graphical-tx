import { Input, Select, SelectItem } from "@heroui/react";
import Image from "next/image";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useUI } from "~/app/_contexts";
import { checkIfHash, isEmpty, isHexa, OPTIONS } from "~/app/_utils";
import AddCircleIcon from "~/public/add-circle.svg";
import { Button } from "../../Button";
import { type INewTx } from "./multipleInputModal.interface";

interface TransactionAddProps {
  inputs: INewTx[];
  setInputs: Dispatch<SetStateAction<INewTx[]>>;
}

export const TransactionAdd = ({ inputs, setInputs }: TransactionAddProps) => {
  const [txs, setTxs] = useState("");
  const [option, setOption] = useState<OPTIONS>(OPTIONS.HASH);
  const { setError, error } = useUI();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setError("");
    setTxs(e.target.value);
  };

  const handleAddInput = () => {
    const multiplesInputs = txs.split(",").map((tx) => tx.trim());
    const uniqueInputs = Array.from(new Set(multiplesInputs));
    setInputs((prev) => {
      const filteredInputs = uniqueInputs.filter((tx) => {
        if (isEmpty(tx)) return false;
        if (inputs.find((i) => i.value === tx)) {
          setError("Transaction already added");
          return false;
        }
        if (
          (option == OPTIONS.HASH && !checkIfHash(tx)) ||
          (option == OPTIONS.CBOR && !isHexa(tx))
        ) {
          setError("Invalid Transaction");
          return false;
        }
        return true;
      });
      return [
        ...prev,
        ...filteredInputs.map((input) => ({
          type: option,
          value: input,
          isNew: true,
        })),
      ];
    });
    setTxs("");
  };

  const changeSelectedOption = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!isEmpty(e.target.value)) setOption(e.target.value as OPTIONS);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl">Add Transactions</div>
      <div className="flex items-start gap-2">
        <Input
          type="text"
          size="md"
          onChange={handleInputChange}
          placeholder="Enter TxHash or CBOR"
          value={txs}
          isInvalid={!isEmpty(error)}
          errorMessage={error}
          startContent={
            <Select
              aria-label="Close"
              selectedKeys={[option]}
              size="sm"
              className="w-1/6"
              onChange={changeSelectedOption}
              color="primary"
              labelPlacement="outside"
            >
              <SelectItem key={OPTIONS.HASH} value={OPTIONS.HASH}>
                TxHash
              </SelectItem>
              <SelectItem key={OPTIONS.CBOR} value={OPTIONS.CBOR}>
                CBOR
              </SelectItem>
            </Select>
          }
        />
        <Button onClick={handleAddInput} className="flex h-10 gap-2">
          Add
          <Image src={AddCircleIcon} alt="+" />
        </Button>
      </div>
    </div>
  );
};
