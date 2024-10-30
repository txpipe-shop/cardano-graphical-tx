"use client";

import { Input } from "@nextui-org/react";
import { Suspense, useState } from "react";
import { Button, Header } from "../_components";
import { useUI } from "../_contexts";
import { getDSLFromJSON, isEmpty } from "../_utils";
import Loading from "../loading";

export default function Index() {
  const { error, setError } = useUI();
  const [dsl, setDsl] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dsl) return;
    const res = await getDSLFromJSON(dsl, setError);
    setResponse(res);
  }

  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        {!isEmpty(error) && <div>{error}</div>}
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex w-2/3 items-center justify-end gap-4"
          >
            <Input
              name="dsl"
              value={dsl}
              onChange={(e) => setDsl(e.target.value)}
              placeholder="Enter DSL transaction"
            />
            <Button type="submit">Parse</Button>
          </form>
          <div>
            <pre>{response}</pre>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
