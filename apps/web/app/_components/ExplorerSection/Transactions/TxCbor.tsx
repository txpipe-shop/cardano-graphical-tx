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
    <Card className="h-full shadow-none border border-default-200">
      <CardBody className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-gray-700">Decoded</div>
          <Textarea
            readOnly
            value={decoded}
            placeholder="No decoded CBOR available"
            minRows={20}
            className="font-mono text-sm max-h-[600px] overflow-y-auto"
            variant="bordered"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-gray-700">CBOR</div>
          <Textarea
            readOnly
            value={cbor}
            placeholder="CBOR not available"
            minRows={20}
            className="font-mono text-sm max-h-[600px] overflow-y-auto"
            variant="bordered"
          />
        </div>
      </CardBody>
    </Card>
  );
}
