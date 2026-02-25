"use client";

import { useEffect, useRef } from "react";

export interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        callbackRef.current();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div
      ref={sentinelRef}
      className="flex items-center justify-center py-6 text-sm text-p-secondary min-h-[40px]"
    >
      {isLoading && "Loading more..."}
    </div>
  );
}
