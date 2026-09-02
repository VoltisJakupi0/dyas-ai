"use client";

import { useEffect } from "react";

const COLOR = "#eeece7";

function themeMeta() {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  return meta;
}

/** iOS Safari tints its chrome from the page unless theme-color is a plain value and re-applied after reload. */
export function SafariChrome() {
  useEffect(() => {
    const apply = () => {
      const meta = themeMeta();
      meta.setAttribute("content", "");
      meta.setAttribute("content", COLOR);
    };

    apply();
    window.addEventListener("pageshow", apply);
    window.addEventListener("focus", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      window.removeEventListener("pageshow", apply);
      window.removeEventListener("focus", apply);
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  return null;
}
