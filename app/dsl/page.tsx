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

export default function Index() {
  const { error, setError } = useUI();
  const [dsl, setDsl] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const customJsonLinter = linter((view: EditorView): Diagnostic[] => {
    const doc = view.state.doc.toString();

    if (!doc.trim()) {
      return [];
    }
    try {
      JSON.parse(doc);
      return [];
    } catch (err: any) {
      const message = err.message;
      const match = message.match(/at line (\d+) column (\d+)/);

      if (match) {
        const line = parseInt(match[1], 10);
        const column = parseInt(match[2], 10);

        const lineStart = view.state.doc.line(line).from;
        const from = lineStart + (column - 1);
        const to = from + 1;

        return [
          {
            from,
            to,
            severity: "error",
            message,
          },
        ];
      }
      return [
        {
          from: 0,
          to: doc.length,
          severity: "error",
          message,
        },
      ];
    }
  });

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dsl.trim()) {
      setResponse("Please enter DSL JSON to parse.");
      return;
    }
    const res = await getDSLFromJSON(dsl, setError);
    if (res.includes("error")) {
      let parsed_res = await JSON.parse(res);
      setResponse(`JSON is not valid: ${parsed_res.error}`);
    } else {
      setResponse(res);
    }
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
                onChange={(value) => setDsl(value)}
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
