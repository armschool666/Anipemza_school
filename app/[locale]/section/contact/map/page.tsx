"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MapRedirectPage() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1];
    window.location.replace(`/${locale}/section/contact#map`);
  }, [pathname]);

  return null;
}
