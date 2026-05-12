"use client";

import { Button, Card, CardBody, Textarea } from "@heroui/react";
import { useCborDiagnostic } from "~/app/_hooks/useCborDiagnostic";

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

export default function CborView({
  cbor,
  emptyMessage = "CBOR not available",
}: CborViewProps) {
  const {
    cborText,
    setCborText,
    diagnosticText,
    setDiagnosticText,
    decodeToDiagnostic,
    encodeToCbor,
    decodeError,
    encodeError,
  } = useCborDiagnostic(cbor);

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
      <CardBody className="flex h-full min-h-0 flex-col gap-4 p-4">
        <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="font-medium text-p-secondary">Decoded</div>
            {encodeError && (
              <div className="text-xs text-red-2">{encodeError}</div>
            )}
            <Textarea
              value={diagnosticText}
              onValueChange={setDiagnosticText}
              placeholder="No decoded CBOR available"
              minRows={12}
              disableAutosize
              classNames={textareaClassNames}
              variant="bordered"
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="font-medium text-p-secondary">CBOR</div>
            {decodeError && (
              <div className="text-xs text-red-2">{decodeError}</div>
            )}
            <Textarea
              value={cborText}
              onValueChange={setCborText}
              placeholder="CBOR not available"
              minRows={12}
              disableAutosize
              classNames={textareaClassNames}
              variant="bordered"
            />
          </div>
        </div>
        <div className="flex shrink-0 justify-center gap-2">
          <Button
            size="sm"
            variant="flat"
            className="font-mono shadow-md"
            onPress={encodeToCbor}
          >
            Diagnostic → CBOR
          </Button>
          <Button
            size="sm"
            variant="flat"
            className="font-mono shadow-md"
            onPress={decodeToDiagnostic}
          >
            CBOR → Diagnostic
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
