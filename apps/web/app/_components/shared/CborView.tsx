"use client";

import { Card, CardBody, Textarea } from "@heroui/react";
import * as cbor2 from "cbor2";
import { useEffect, useState } from "react";

interface CborViewProps {
  cbor: string | null;
  emptyMessage?: string;
}

const textareaClassNames = {
  base: "min-h-0 flex-1",
  mainWrapper: "min-h-0 flex-1",
  inputWrapper: "min-h-0 h-full flex-1 items-stretch",
  innerWrapper: "min-h-0 h-full flex-1",
  input: "min-h-0 h-full flex-1 resize-none overflow-auto font-mono text-sm",
} as const;

export function useCborDiagnostic(cbor: string | null | undefined): string {
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

  return decoded;
}

export default function CborView({
  cbor,
  emptyMessage = "CBOR not available",
}: CborViewProps) {
  const decoded = useCborDiagnostic(cbor);

  if (!cbor) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          {emptyMessage}
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-0 border border-border bg-surface shadow-none">
      <CardBody className="grid h-full min-h-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="font-medium text-p-secondary">Decoded</div>
          <Textarea
            readOnly
            value={decoded}
            placeholder="No decoded CBOR available"
            minRows={12}
            disableAutosize
            classNames={textareaClassNames}
            variant="bordered"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="font-medium text-p-secondary">CBOR</div>
          <Textarea
            readOnly
            value={cbor}
            placeholder="CBOR not available"
            minRows={12}
            disableAutosize
            classNames={textareaClassNames}
            variant="bordered"
          />
        </div>
      </CardBody>
    </Card>
  );
}
