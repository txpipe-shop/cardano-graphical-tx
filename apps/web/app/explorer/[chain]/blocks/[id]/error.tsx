"use client";

import { DevnetError } from "~/app/_components/DevnetError";
import { Header } from "~/app/_components/Header";

export default function BlockError() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        <DevnetError title="Block could not be loaded." />
      </main>
    </div>
  );
}
