"use client";

import { Button } from "@heroui/react";
import type { ValidationResponse } from "@laceanatomy/napi-pallas";
import ValidationView from "~/app/_components/ValidationView";

interface ValidationTabProps {
  result: ValidationResponse | null;
  error: string | null;
  isLoading: boolean;
  onRun: () => void;
  cbor: string;
}

export function ValidationTab({
  result,
  error,
  isLoading,
  onRun,
  cbor,
}: ValidationTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-p-secondary">
        Validating...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="whitespace-pre-wrap text-center text-red-2">{error}</p>
        <RunValidationButton onRun={onRun} isLoading={isLoading} cbor={cbor}>
          Run Validation Again
        </RunValidationButton>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto">
          <ValidationView validation={result} />
        </div>
        <div className="flex shrink-0 justify-center">
          <RunValidationButton onRun={onRun} isLoading={isLoading} cbor={cbor}>
            Run Validation Again
          </RunValidationButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <RunValidationButton onRun={onRun} isLoading={isLoading} cbor={cbor}>
        Run Validation
      </RunValidationButton>
    </div>
  );
}

interface RunValidationButtonProps {
  onRun: () => void;
  isLoading: boolean;
  cbor: string;
  children: string;
}

function RunValidationButton({
  onRun,
  isLoading,
  cbor,
  children,
}: RunValidationButtonProps) {
  return (
    <Button
      size="sm"
      variant="flat"
      className="font-mono shadow-md"
      onPress={onRun}
      isLoading={isLoading}
      isDisabled={!cbor.trim()}
    >
      {children}
    </Button>
  );
}
