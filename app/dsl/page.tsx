"use client";

import { Suspense, useState } from "react";
import { Header, Button } from "../_components";
import { useUI } from "../_contexts";
import { getDSLFromJSON, isEmpty } from "../_utils";
import Loading from "../loading";

export default function Index() {
  const { error, setError } = useUI();
  const [dsl, setDsl] = useState<string>("");
  const [response, setResponse] = useState<string>(
    "Parsed JSON will appear here",
  );

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
    <div className="p-6">
      <Header />
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) && (
          <div className="mb-4 text-lg text-red-500">{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex w-full max-w-4xl gap-6">
            {/* Input DSL JSON Box */}
            <div className="flex w-1/2 flex-col">
              <label htmlFor="dsl" className="mb-2 text-xl font-semibold">
                Input DSL JSON
              </label>
              <textarea
                name="dsl"
                value={dsl}
                onChange={(e) => setDsl(e.target.value)}
                placeholder="Enter JSON DSL here"
                className="block h-40 w-full resize-none rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-3 text-lg text-black placeholder-gray-400 shadow shadow-black outline-none"
              />
            </div>

            <div className="flex w-1/2 flex-col">
              <label htmlFor="response" className="mb-2 text-xl font-semibold">
                Parsed Response
              </label>
              <textarea
                name="response"
                value={response}
                placeholder="Parsed JSON response will appear here"
                className="block h-40 w-full resize-none rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-gray-100 p-3 text-lg text-black placeholder-gray-400 shadow shadow-black outline-none"
                disabled
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
