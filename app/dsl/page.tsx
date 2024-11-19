"use client";

import { Suspense, useState } from "react";
import { Header, Button } from "../_components";
import { useUI } from "../_contexts";
import { getDSLFromJSON, isEmpty } from "../_utils";
import Loading from "../loading";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import type { EditorView } from "@codemirror/view";
import { lintGutter, linter } from "@codemirror/lint";
import type { Diagnostic } from "@codemirror/lint";
import jsonpointer from "jsonpointer";

export default function Index() {
  const { error, setError } = useUI();
  const [dsl, setDsl] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [customDiagnostics, setCustomDiagnostics] = useState<Diagnostic[]>([]);

  const customJsonLinter = linter((view: EditorView): Diagnostic[] => {
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
        const from = lineStart + (column - 1);
        const to = from + 1;

        baseDiagnostics.push({
          from,
          to,
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

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dsl.trim()) {
      setResponse("Please enter DSL JSON to parse.");
      return;
    }

    const res = await getDSLFromJSON(dsl, setError);
    if (res.includes("error")) {
      const parsedRes = JSON.parse(res);
      const { error, instance_path } = parsedRes;

      if (instance_path) {
        const parsedDSL = JSON.parse(dsl);
        const position = getPositionFromPath(parsedDSL, instance_path);

        const diagnostic: Diagnostic = {
          from: position?.from || 0,
          to: position?.to || dsl.length,
          severity: "error",
          message: `Error: ${error}`,
        };
        setResponse(`JSON is not valid!`);
        setCustomDiagnostics([diagnostic]);
      }
    } else {
      setResponse(res);
      setCustomDiagnostics([]);
    }
  }
  function getPositionFromPath(json: object, path: string) {
    try {
      const value = jsonpointer.get(json, path);

      if (value === undefined) {
        console.error(`Path not found: ${path}`);
        return null;
      }

      const valueString = JSON.stringify(value);
      const normalizedDoc = dsl.replace(/\s+/g, "");

      const index = normalizedDoc.indexOf(valueString);

      if (index === -1) {
        console.error(`Value not found in JSON document: ${valueString}`);
        return null;
      }

      const from = findOriginalPosition(dsl, index);
      const to = from + 1;

      return { from, to };
    } catch (err) {
      console.error(`Error resolving path: ${path}`, err);
      return null;
    }
  }

  function findOriginalPosition(originalDoc: string, normalizedIndex: number) {
    let originalIndex = 0;
    let normalizedCounter = 0;

    while (
      normalizedCounter < normalizedIndex &&
      originalIndex < originalDoc.length
    ) {
      if (!/\s/.test(String(originalDoc[originalIndex]))) {
        normalizedCounter++;
      }
      originalIndex++;
    }

    return originalIndex;
  }

  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) && (
          <div className="mb-4 text-lg text-red-500">{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="mt-16 flex w-full flex-grow gap-12">
            <div className="ml-10 flex w-1/2 flex-col">
              <label htmlFor="dsl" className="mb-6 text-xl font-semibold">
                Input DSL JSON
              </label>
              <CodeMirror
                value={dsl}
                height="650px"
                extensions={[json(), lintGutter(), customJsonLinter]}
                onChange={(value) => {
                  setDsl(value);
                  setCustomDiagnostics([]);
                }}
                placeholder="Enter JSON here"
                className="rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-1 text-lg placeholder-gray-400 shadow shadow-black outline-none"
              />
            </div>

            <div className="mr-10 flex w-1/2 flex-col overflow-hidden">
              <label htmlFor="response" className="mb-6 text-xl font-semibold">
                Parsed Response
              </label>
              <CodeMirror
                value={response}
                height="650px"
                extensions={[json()]}
                editable={false}
                placeholder="Response will be displayed here"
                className="overflow-auto rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-1 text-lg placeholder-gray-400 shadow shadow-black outline-none"
              />
            </div>
          </div>

          <Button type="submit" className="mt-4 text-lg">
            Parse
          </Button>
        </form>
      </Suspense>
    </div>
  );
}
