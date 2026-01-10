"use client";

import { json } from "@codemirror/lang-json";
import type { Diagnostic } from "@codemirror/lint";
import { lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { Tab, Tabs } from "@heroui/tabs";
import CodeMirror from "@uiw/react-codemirror";
import jsonpointer from "jsonpointer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUI } from "~/app/_contexts";
import { DSLExamples, getDSLFromJSON, isEmpty, simpleDSL } from "~/app/_utils";
import { customJsonLinter } from "./CustomLinter";
import { DslInputHeader, DslResHeader } from "./DslHeader";

export const DslSection = () => {
  const { setError } = useUI();
  const [dsl, setDsl] = useState<string>(simpleDSL);
  const [cborHex, setCborHex] = useState<string>("");
  const [cborDiagnostic, setCborDiagnostic] = useState<string>("");
  const [customDiagnostics, setCustomDiagnostics] = useState<Diagnostic[]>([]);
  const searchParams = useSearchParams();
  const useExample = searchParams.get("example");

  useEffect(() => {
    if (useExample)
      setDsl(DSLExamples.find((ex) => ex.title === useExample)!.code);
  }, [useExample]);

  const TabContent = [
    { key: "hex", title: "CBOR Hex", content: cborHex },
    { key: "diagnostic", title: "CBOR Diagnostic", content: cborDiagnostic },
  ];

  function findOriginalPosition(originalDoc: string, normalizedIndex: number) {
    let originalIndex = 0;
    let normalizedCounter = 0;

    while (
      normalizedCounter < normalizedIndex &&
      originalIndex < originalDoc.length
    ) {
      if (!/\s/.test(String(originalDoc[originalIndex]))) normalizedCounter++;
      originalIndex++;
    }

    return originalIndex;
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

      return { from, to: from + 1 };
    } catch (err) {
      console.error(`Error resolving path: ${path}`, err);
      return null;
    }
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dsl.trim()) {
      setCborHex("Please enter DSL JSON to parse.");
      setCborDiagnostic("Please enter DSL JSON to parse.");
      return;
    }
    const res = await getDSLFromJSON(dsl, setError);
    const parsedRes = JSON.parse(JSON.stringify(res));

    if (!isEmpty(parsedRes.error)) {
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
        setCborHex(`JSON is not valid! \nError: ${error}`);
        setCborDiagnostic(`JSON is not valid! \nError: ${error}`);
        setCustomDiagnostics([diagnostic]);
      } else {
        setCborHex(`Error: ${error}`);
        setCborDiagnostic(`Error: ${error}`);
      }
    } else {
      setCborHex(parsedRes.dslRes.cborHex);
      setCborDiagnostic(parsedRes.dslRes.cborDiagnostic);
      setCustomDiagnostics([]);
    }
  }

  function formatJson(value: string) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (e) {
      return value;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col items-center gap-4"
    >
      <div className="flex w-full flex-grow gap-12">
        <div className="ml-10 flex w-1/2 flex-col gap-2">
          <DslInputHeader />
          <CodeMirror
            value={dsl}
            extensions={[
              json(),
              lintGutter(),
              customJsonLinter(customDiagnostics),
            ]}
            onChange={(value) => {
              setDsl(formatJson(value));
              setCustomDiagnostics([]);
            }}
            placeholder="Enter JSON here"
            height="calc(100vh - 14rem)"
            width="calc(50vw - 5rem)"
            className="overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-2 text-lg placeholder-gray-400 shadow shadow-black outline-none"
          />
        </div>

        <div className="mr-10 flex w-1/2 flex-col">
          <Tabs
            aria-label="CBOR types"
            variant="bordered"
            color="primary"
            size="lg"
            className="mt-1"
          >
            {TabContent.map(({ key, title, content }) => (
              <Tab
                key={key}
                title={<span className="text-lg font-semibold">{title}</span>}
              >
                <DslResHeader content={content} />
                <CodeMirror
                  value={content}
                  extensions={[EditorView.lineWrapping]}
                  editable={false}
                  height="calc(100vh - 14rem)"
                  width="calc(50vw - 5rem)"
                  placeholder="Response will be displayed here"
                  className="overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-2 text-lg placeholder-gray-400 shadow shadow-black outline-none"
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </form>
  );
};
