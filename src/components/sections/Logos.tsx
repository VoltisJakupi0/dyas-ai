import type { CSSProperties } from "react";
import { logos, type LogoItem } from "@/lib/site";

function logoKey(item: LogoItem) {
  return "src" in item && item.src ? item.src : item.text;
}

function LogoItemView({
  item,
  dup,
}: {
  item: LogoItem;
  dup?: string;
}) {
  const style = { "--logo-s": item.scale ?? 1 } as CSSProperties;
  const isDup = Boolean(dup);
  const native = "native" in item && Boolean(item.native);

  if ("text" in item && item.text) {
    return (
      <span
        className={["dyas-logos__text", isDup ? "is-dup" : null].filter(Boolean).join(" ")}
        style={style}
        aria-hidden={isDup ? true : undefined}
      >
        {item.text}
      </span>
    );
  }

  if (!("src" in item) || !item.src) return null;

  return (
    <img
      src={item.src}
      alt={isDup ? "" : item.alt}
      width={120}
      height={20}
      decoding="async"
      loading="lazy"
      fetchPriority={isDup ? "low" : undefined}
      className={[native ? "is-native" : null, isDup ? "is-dup" : null].filter(Boolean).join(" ") || undefined}
      aria-hidden={isDup ? true : undefined}
      style={style}
    />
  );
}

export function Logos() {
  const dups = [undefined, "dup", "dup2", "dup3"] as const;
  return (
    <div className="dyas-logos dyas-hero-area__logos dyas-reveal" style={{ "--reveal-delay": "240ms" } as CSSProperties}>
      <p className="dyas-logos__label">{logos.label}</p>
      <div className="dyas-logos__track">
        {dups.flatMap((dup) =>
          logos.items.map((item) => (
            <LogoItemView key={`${logoKey(item)}-${dup ?? "main"}`} item={item} dup={dup} />
          )),
        )}
      </div>
    </div>
  );
}
