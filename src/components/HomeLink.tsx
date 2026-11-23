"use client";

import { useLayoutEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Set by a click from another page, read once the home page has mounted.
// Module state, because the header and footer are new instances there.
let landAtTop = false;

/**
 * The logo's link home. From any other page it lands on the very top of the
 * home page, the way a fresh visit opens it. Next.js would instead scroll to
 * the top of the page content, which on the home page sits below the large
 * wordmark header (and its scroll-pinned sections), so it opened part way
 * down. On the home page itself it is a plain link.
 */
export function HomeLink({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const away = pathname !== "/";

  useLayoutEffect(() => {
    if (away || !landAtTop) return;
    landAtTop = false;
    // Before the first paint of the home page, so it never shows mid-page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [away]);

  return (
    <Link
      href="/"
      aria-label="Home"
      className={className}
      scroll={away ? false : undefined}
      onClick={() => {
        if (away) landAtTop = true;
      }}
    >
      {children}
    </Link>
  );
}
