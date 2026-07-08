"use client";

import { Button, Textarea } from "@heroui/react";
import { useEffect } from "react";
import { useCborDiagnostic } from "~/app/_hooks/useCborDiagnostic";
import { EmptyState } from "./EmptyState";
import { InfoCard } from "./InfoCard";

interface CborViewProps {
  cbor: string | null;
  emptyMessage?: string;
  onCborChange?: (cbor: string) => void;
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
  onCborChange,
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

  useEffect(() => {
    if (cbor != null && onCborChange) {
      onCborChange(cborText);
    }
  }, [cbor, cborText, onCborChange]);

  if (cbor == null) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <InfoCard border="solid" shadow={false} className="h-full min-h-0">
      <div className="flex h-full min-h-0 flex-col gap-4 p-0">
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
              placeholder="Paste or edit CBOR"
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
      </div>
    </InfoCard>
  );
}
