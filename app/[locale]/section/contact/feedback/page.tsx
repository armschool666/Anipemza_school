"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FeedbackRedirectPage() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1];
    window.location.replace(`/${locale}/section/contact#feedback`);
  }, [pathname]);

  return null;
}
