"use client";

import { Card, CardBody, Textarea } from "@heroui/react";
import * as cbor2 from "cbor2";
import { useEffect, useState } from "react";

export default function TxCbor({ cbor }: { cbor: string }) {
  const [decoded, setDecoded] = useState("");

  useEffect(() => {
    if (!cbor) {
      setDecoded("");
      return;
    }
    try {
      const diag = cbor2.diagnose(cbor);
      setDecoded(
        typeof diag === "string" ? diag : JSON.stringify(diag, null, 2),
      );
    } catch (e) {
      if (e instanceof Error) {
        setDecoded(`Diagnostic error: ${e.message}`);
      } else {
        setDecoded("Unknown diagnostic error");
      }
    }
  }, [cbor]);

  return (
    <Card className="h-full min-h-0 border border-default-200 shadow-none">
      <CardBody className="grid h-full min-h-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="font-medium text-gray-700">Decoded</div>
          <Textarea
            readOnly
            value={decoded}
            placeholder="No decoded CBOR available"
            minRows={12}
            disableAutosize
            classNames={{
              base: "min-h-0 flex-1",
              mainWrapper: "min-h-0 flex-1",
              inputWrapper: "min-h-0 h-full flex-1 items-stretch",
              innerWrapper: "min-h-0 h-full flex-1",
              input:
                "min-h-0 h-full flex-1 resize-none overflow-auto font-mono text-sm",
            }}
            variant="bordered"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="font-medium text-gray-700">CBOR</div>
          <Textarea
            readOnly
            value={cbor}
            placeholder="CBOR not available"
            minRows={12}
            disableAutosize
            classNames={{
              base: "min-h-0 flex-1",
              mainWrapper: "min-h-0 flex-1",
              inputWrapper: "min-h-0 h-full flex-1 items-stretch",
              innerWrapper: "min-h-0 h-full flex-1",
              input:
                "min-h-0 h-full flex-1 resize-none overflow-auto font-mono text-sm",
            }}
            variant="bordered"
          />
        </div>
      </CardBody>
    </Card>
  );
}
