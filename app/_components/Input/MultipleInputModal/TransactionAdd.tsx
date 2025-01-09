import { Input, Select, SelectItem } from "@nextui-org/react";
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
  const [tx, setTx] = useState("");
  const [option, setOption] = useState<OPTIONS>(OPTIONS.HASH);
  const { setError, error } = useUI();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setError("");
    setTx(e.target.value);
  };

  const handleAddInput = () => {
    switch (option) {
      case OPTIONS.HASH:
        if (inputs.find((i) => i.value === tx)) {
          setError("Transaction already added");
          return;
        }
        if (!tx || !checkIfHash(tx)) {
          setError(!tx ? "Tx Id should not be empty" : "Invalid Tx Id");
          return;
        }
        setTx("");
        break;
      case OPTIONS.CBOR:
        if (inputs.find((i) => i.value === tx)) {
          setError("Cbor already added");
          return;
        }
        if (!tx || !isHexa(tx)) {
          setError(!tx ? "Cbor should not be empty" : "Invalid Cbor");
          return;
        }
        setTx("");
        break;
      default:
        break;
    }
    setInputs((prev) => {
      if (prev.find((input) => input.value === tx)) return prev;
      return [...prev, { type: option, value: tx, isNew: true }];
    });
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
          value={tx}
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
