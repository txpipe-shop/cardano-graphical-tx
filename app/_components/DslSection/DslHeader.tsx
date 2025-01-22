import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { Button } from "~/app/_components";
import { useUI } from "~/app/_contexts";
import { firstNChars, handleCopy, isEmpty } from "~/app/_utils";
import CopyIcon from "/public/copy.svg";

export const DslInputHeader = () => {
  const { error } = useUI();

  return (
    <div className="flex h-14 items-center justify-between">
      <label
        htmlFor="dsl"
        className="flex items-center gap-2 text-xl font-semibold"
      >
        Input DSL JSON
        {!isEmpty(error) && (
          <div className="flex items-center gap-2">
            <div className="text-lg text-red-500">{firstNChars(error, 20)}</div>
            <Tooltip
              placement="right"
              content={<div className="px-1 py-2">{error}</div>}
            >
              <button className="h-5 w-5 rounded-full border border-gray-500 p-0 text-xs text-gray-500">
                i
              </button>
            </Tooltip>
          </div>
        )}
      </label>
      <Button type="submit" className="h-10">
        Parse
      </Button>
    </div>
  );
};

export const DslResHeader = ({ content }: { content: string | undefined }) => {
  return (
    <div className="absolute right-8 top-[7rem]">
      <Button
        type="button"
        onClick={handleCopy(content!)}
        className="flex h-10 cursor-pointer items-center justify-center gap-2"
      >
        <div>Copy</div> <Image src={CopyIcon} alt="" />
      </Button>
    </div>
  );
};
