"use client";

import { Button } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ROUTES } from "~/app/_utils";

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const visiblePages = useMemo(() => {
    const pages = new Set<number>();
    [currentPage - 1, currentPage, currentPage + 1]
      .filter((p) => p >= 1 && p <= totalPages)
      .forEach((p) => pages.add(p));

    pages.add(1);
    pages.add(totalPages);

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const navigateTo = (page: number) => () => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    router.push(
      query ? `${ROUTES.EXPLORER_TXS}?${query}` : ROUTES.EXPLORER_TXS,
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between rounded-lg border-2 border-dashed border-gray-200 p-3 shadow-md">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="flat"
          className="bg-violet-100 text-gray-600 shadow-sm"
          isDisabled={!canGoPrev}
          onPress={navigateTo(currentPage - 1)}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page) => (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "solid" : "light"}
              className={
                page === currentPage
                  ? "bg-violet-100 font-mono text-gray-600 shadow-sm"
                  : "font-mono text-gray-600"
              }
              onPress={navigateTo(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="flat"
          className="bg-violet-100 text-gray-600 shadow-sm"
          isDisabled={!canGoNext}
          onPress={navigateTo(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
