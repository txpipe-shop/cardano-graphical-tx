"use client";

import { Button, Card, CardBody, Textarea } from "@heroui/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCborDiagnostic } from "~/app/_hooks/useCborDiagnostic";

interface CborViewProps {
  cbor: string | null;
  emptyMessage?: string;
  actions?: ReactNode;
  onCborTextChange?: (cborText: string) => void;
  alwaysShowEditor?: boolean;
  variant?: "dual" | "single";
}

type EditorMode = "diagnostic" | "cbor";

export default function CborView({
  cbor,
  emptyMessage = "CBOR not available",
  actions,
  onCborTextChange,
  alwaysShowEditor,
  variant = "dual",
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

  const [editorMode, setEditorMode] = useState<EditorMode>(
    variant === "single" ? "cbor" : "diagnostic",
  );

  const textareaClassNames = useMemo(
    () => ({
      base: "min-h-0 flex-1",
      mainWrapper: "min-h-0 flex-1",
      inputWrapper:
        "min-h-0 h-full flex-1 items-stretch rounded-lg !border-2 !border-border !shadow-none bg-surface data-[hover=true]:!border-border group-data-[focus=true]:!border-p-primary",
      innerWrapper: "min-h-0 h-full flex-1",
      input:
        variant === "single"
          ? "min-h-0 h-full flex-1 resize-none overflow-auto font-mono text-sm outline-none"
          : "min-h-[500px] resize-none overflow-auto font-mono text-sm outline-none",
    }),
    [variant],
  );

  useEffect(() => {
    onCborTextChange?.(cborText);
  }, [cborText, onCborTextChange]);

  const handleEncode = useCallback(() => {
    encodeToCbor();
    setEditorMode("cbor");
  }, [encodeToCbor]);

  const handleDecode = useCallback(() => {
    decodeToDiagnostic();
    setEditorMode("diagnostic");
  }, [decodeToDiagnostic]);

  if (!cbor && !alwaysShowEditor) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          {emptyMessage}
        </CardBody>
      </Card>
    );
  }

  if (variant === "single") {
    return (
      <Card className="h-full min-h-0 border border-border bg-surface shadow-none">
        <CardBody className="flex h-full min-h-0 flex-col gap-4 p-4">
          <div className="flex shrink-0 items-center gap-1">
            <button
              className={`rounded border px-3 py-1 font-mono text-sm ${
                editorMode === "diagnostic"
                  ? "border-p-primary bg-p-primary text-background"
                  : "border-border bg-surface text-p-primary"
              }`}
              onClick={() => setEditorMode("diagnostic")}
            >
              Decoded
            </button>
            <button
              className={`rounded border px-3 py-1 font-mono text-sm ${
                editorMode === "cbor"
                  ? "border-p-primary bg-p-primary text-background"
                  : "border-border bg-surface text-p-primary"
              }`}
              onClick={() => setEditorMode("cbor")}
            >
              CBOR
            </button>
          </div>

          {editorMode === "diagnostic" && encodeError && (
            <div className="shrink-0 text-xs text-red-2">{encodeError}</div>
          )}
          {editorMode === "cbor" && decodeError && (
            <div className="shrink-0 text-xs text-red-2">{decodeError}</div>
          )}

          <Textarea
            value={editorMode === "diagnostic" ? diagnosticText : cborText}
            onValueChange={
              editorMode === "diagnostic" ? setDiagnosticText : setCborText
            }
            placeholder={
              editorMode === "diagnostic"
                ? "No decoded CBOR available"
                : "CBOR not available"
            }
            minRows={32}
            disableAutosize
            classNames={textareaClassNames}
            variant="flat"
          />

          <div className="flex shrink-0 justify-center gap-2">
            {editorMode === "diagnostic" ? (
              <Button
                size="sm"
                variant="flat"
                className="font-mono shadow-md"
                isDisabled={!diagnosticText}
                onPress={handleEncode}
              >
                Diagnostic → CBOR
              </Button>
            ) : (
              <Button
                size="sm"
                variant="flat"
                className="font-mono shadow-md"
                isDisabled={!cborText}
                onPress={handleDecode}
              >
                CBOR → Diagnostic
              </Button>
            )}
            {actions}
          </div>
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
              minRows={32}
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
              minRows={32}
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
          {actions}
        </div>
      </CardBody>
    </Card>
  );
}
