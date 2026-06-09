"use client";

import type { ValidationResponse } from "@laceanatomy/napi-pallas";
import { Chip } from "@heroui/react";

function StatusIcon({ status }: { status: "passed" | "failed" | "skipped" }) {
  if (status === "passed") {
    return (
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "skipped") {
    return (
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-p-tertiary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    );
  }
  return (
    <svg
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function ValidationView({
  validation,
}: {
  validation: ValidationResponse;
}) {
  const { era, checks, valid } = validation;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm capitalize">{era}</span>
        <Chip
          variant="flat"
          color={valid ? "success" : "danger"}
          size="sm"
          className="font-mono text-xs"
        >
          {valid ? "valid" : "invalid"}
        </Chip>
      </div>

      <div className="flex flex-col gap-1 overflow-auto">
        {checks.map((check, i) => {
          const status = check.passed
            ? "passed"
            : check.error === "skipped"
              ? "skipped"
              : "failed";

          return (
            <div
              key={i}
              className="flex items-start gap-2 rounded px-2 py-1 font-mono text-xs"
            >
              <StatusIcon status={status} />
              <div className="flex min-w-0 flex-col">
                <span
                  className={
                    status === "failed"
                      ? "text-foreground"
                      : status === "skipped"
                        ? "text-p-tertiary"
                        : "text-p-secondary"
                  }
                >
                  {check.rule}
                </span>
                {check.error && check.error !== "skipped" && (
                  <span className="truncate text-danger/70">{check.error}</span>
                )}
                {check.error === "skipped" && (
                  <span className="text-p-tertiary/60">skipped</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
