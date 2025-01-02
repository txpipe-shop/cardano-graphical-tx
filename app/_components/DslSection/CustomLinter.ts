import type { Diagnostic } from "@codemirror/lint";
import { linter } from "@codemirror/lint";
import type { EditorView } from "@uiw/react-codemirror";

export const customJsonLinter = (customDiagnostics: Diagnostic[]) =>
  linter((view: EditorView): Diagnostic[] => {
    const doc = view.state.doc.toString();
    const baseDiagnostics: Diagnostic[] = [];

    if (!doc.trim()) return baseDiagnostics;

    try {
      JSON.parse(doc);
    } catch (err: any) {
      const message = err.message;
      const match = message.match(/at line (\d+) column (\d+)/);

      if (match) {
        const line = parseInt(match[1], 10);
        const column = parseInt(match[2], 10);

        const lineStart = view.state.doc.line(line).from;

        baseDiagnostics.push({
          from: lineStart + column - 1,
          to: lineStart + column,
          severity: "error",
          message,
        });
      } else {
        baseDiagnostics.push({
          from: 0,
          to: doc.length,
          severity: "error",
          message,
        });
      }
    }
    return [...baseDiagnostics, ...customDiagnostics];
  });
