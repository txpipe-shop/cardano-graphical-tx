"use client";

import CBOR from "cbor-core";
import * as cbor2 from "cbor2";
import { useCallback, useEffect, useState } from "react";

export interface CborEditorState {
  cborText: string;
  setCborText: (value: string) => void;
  diagnosticText: string;
  setDiagnosticText: (value: string) => void;
  decodeToDiagnostic: () => void;
  encodeToCbor: () => void;
  decodeError: string | null;
  encodeError: string | null;
}

function tryDiagnose(hex: string): string {
  const diag = cbor2.diagnose(hex);
  return typeof diag === "string" ? diag : JSON.stringify(diag, null, 2);
}

export function useCborDiagnostic(
  cbor: string | null | undefined,
): CborEditorState {
  const [cborText, setCborText] = useState("");
  const [diagnosticText, setDiagnosticText] = useState("");
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [encodeError, setEncodeError] = useState<string | null>(null);

  useEffect(() => {
    if (!cbor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCborText("");
      setDiagnosticText("");
      setDecodeError(null);
      setEncodeError(null);
      return;
    }
    setCborText(cbor);
    setDecodeError(null);
    setEncodeError(null);
    try {
      setDiagnosticText(tryDiagnose(cbor));
    } catch (e) {
      setDiagnosticText(
        e instanceof Error
          ? `Diagnostic error: ${e.message}`
          : "Unknown diagnostic error",
      );
    }
  }, [cbor]);

  const decodeToDiagnostic = useCallback(() => {
    if (!cborText) {
      setDecodeError("No CBOR to decode");
      return;
    }
    setEncodeError(null);
    try {
      setDiagnosticText(tryDiagnose(cborText));
      setDecodeError(null);
    } catch (e) {
      setDecodeError(e instanceof Error ? e.message : "Decoding failed");
    }
  }, [cborText]);

  const encodeToCbor = useCallback(() => {
    if (!diagnosticText) {
      setEncodeError("No diagnostic to encode");
      return;
    }
    setDecodeError(null);
    try {
      const encoded = CBOR.fromDiagnostic(diagnosticText).encode();
      setCborText(CBOR.toHex(encoded));
      setEncodeError(null);
    } catch (e) {
      setEncodeError(e instanceof Error ? e.message : "Encoding failed");
    }
  }, [diagnosticText]);

  return {
    cborText,
    setCborText,
    diagnosticText,
    setDiagnosticText,
    decodeToDiagnostic,
    encodeToCbor,
    decodeError,
    encodeError,
  };
}
