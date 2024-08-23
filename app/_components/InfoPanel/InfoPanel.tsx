"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { TX_URL_PARAM, UTXO_URL_PARAM } from "~/app/_utils";
import CloseIcon from "~/public/close.svg";

interface InfoPanelProps {
  children: React.ReactNode;
  from: "left" | "right";
  isVisible: boolean;
  title?: string;
}

export const InfoPanel = ({
  isVisible,
  from,
  children,
  title,
}: InfoPanelProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);

  const panelPosition = from === "right" ? "right-0" : "left-0";
  const roundedCorner =
    from === "right"
      ? "rounded-bl-xl rounded-tl-xl"
      : "rounded-br-xl rounded-tr-xl";
  const transition =
    from === "right" ? "translate-x-full" : "-translate-x-full";

  const hideInfo = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(TX_URL_PARAM);
    params.delete(UTXO_URL_PARAM);
    if (params) {
      replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, replace]);

  useEffect(() => {
    const panelElement = panelRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (panelElement && !panelElement.contains(event.target as Node)) {
        hideInfo();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (panelElement) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [panelRef, searchParams, pathname, hideInfo]);

  return (
    <section
      ref={panelRef}
      className={`fixed top-0 flex flex-col gap-6 overflow-y-auto ${panelPosition} z-40 h-screen w-1/3 bg-gray-200 p-6 dark:bg-content1 ${roundedCorner} transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : transition
      }`}
    >
      <div className="flex flex-row justify-between">
        <p>{title}</p>
        <Image
          src={CloseIcon}
          alt="X"
          className="cursor-pointer"
          onClick={hideInfo}
        />
      </div>
      {children}
    </section>
  );
};
