"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLAY_CATEGORY_SLUGS } from "@/lib/quiz/routes";

const ROUTES = ["/", "/solo", "/multiplayer", ...PLAY_CATEGORY_SLUGS.map((slug) => `/play/${slug}`)] as const;

export function RoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}
