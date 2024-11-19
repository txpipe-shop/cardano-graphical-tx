"use client";

import { Suspense, useState } from "react";
import { Header, Button } from "../_components";
import { useUI } from "../_contexts";
import { getDSLFromJSON, isEmpty } from "../_utils";
import Loading from "../loading";

export default function Index() {
  const { error, setError } = useUI();
  const [dsl, setDsl] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dsl.trim()) {
      setResponse("Please enter DSL JSON to parse.");
      return;
    }
    const res = await getDSLFromJSON(dsl, setError);
    setResponse(res);
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
                extensions={[json()]}
                onChange={(value) => setDsl(value)}
                placeholder="Enter JSON here"
                className="rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-1 text-lg placeholder-gray-400 shadow shadow-black outline-none"
              />
            </div>

            <div className="mr-10 flex w-1/2 flex-col">
              <label htmlFor="response" className="mb-6 text-xl font-semibold">
                Parsed Response
              </label>
              <CodeMirror
                value={response}
                height="650px"
                extensions={[json()]}
                editable={false}
                placeholder="Response will be displayed here"
                className="rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-1 text-lg placeholder-gray-400 shadow shadow-black outline-none"
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
