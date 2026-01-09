"use client";

import { DslSection, Header } from "~/app/_components";
import { useUI } from "~/app/_contexts";
import Loading from "~/app/loading";

export default function Index() {
  const { loading } = useUI();

  if (loading) return <Loading />;

  return (
    <>
      <Header />
      <DslSection />
    </>
  );
}
