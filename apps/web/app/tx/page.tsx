"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConfigs } from "~/app/_contexts";
import { ROUTES } from "../_utils";

export default function Index() {
  const router = useRouter();
  const { configs } = useConfigs();

  useEffect(() => {
    router.replace(ROUTES.TX(configs.net));
  }, [router, configs.net]);

  return null;
}
