"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

const ICONS = {
  flow: (
    <>
      <rect x="3" y="3.5" width="8" height="6" rx="1" />
      <rect x="13" y="14.5" width="8" height="6" rx="1" />
      <path d="M11 6.5h3.5A2.5 2.5 0 0 1 17 9v5.5" />
    </>
  ),
  bot: (
    <>
      <rect x="3.5" y="8" width="17" height="11.5" rx="2.5" />
      <path d="M12 3.5V8M8.5 13.5h.01M15.5 13.5h.01M12 16h.01" />
    </>
  ),
  chat: <path d="M4 5h16v10.5H9.5L4 20z" />,
  device: (
    <>
      <rect x="2" y="4.5" width="13.5" height="10" rx="1" />
      <path d="M5.5 18h6.5" />
      <rect x="17" y="8.5" width="5" height="11" rx="1" />
    </>
  ),
  cart: (
    <>
      <path d="M2.5 4h2.2l2.4 10.5h11" />
      <path d="M6.2 6.8H21.5l-1.8 6.2H7.6" />
      <circle cx="9.5" cy="19" r="1.5" />
      <circle cx="17.5" cy="19" r="1.5" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20.5l1-4.2L16.8 4.5l3.2 3.2L8.2 19.5z" />
      <path d="M14.8 6.5l3.2 3.2" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1" />
      <path d="M2.5 7.5L12 14l9.5-6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.4l3.4 2.2" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  box: (
    <>
      <path d="M3 7.2L12 3l9 4.2v9.6L12 21l-9-4.2z" />
      <path d="M3 7.2L12 11.5l9-4.3M12 11.5V21" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5l9 16.5H3z" />
      <path d="M12 10v4.2M12 17h.01" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" />
    </>
  ),
} as const;

type IconName = keyof typeof ICONS;

function Icon({ name }: { name: IconName }) {
  return (
    <svg className="dyas-iso__ico" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* Every layer opens with the same signature: badge, name, one-line promise. */
function Brand({ icon, title, sub }: { icon: IconName; title: string; sub: string }) {
  return (
    <header className="dyas-iso__brand">
      <span className="dyas-iso__badge">
        <Icon name={icon} />
      </span>
      <span>
        <b>{title}</b>
        <em>{sub}</em>
      </span>
    </header>
  );
}

type Row = {
  icon: IconName;
  title: string;
  sub: string;
  state: "done" | "live" | "idle";
  count: string;
};

function Rows({ items }: { items: Row[] }) {
  return (
    <ul className="dyas-iso__list">
      {items.map((row) => (
        <li key={row.title}>
          <Icon name={row.icon} />
          <span>
            <b>{row.title}</b>
            <em>{row.sub}</em>
          </span>
          <b data-state={row.state}>
            <i />
            {row.count}
          </b>
        </li>
      ))}
    </ul>
  );
}

const GRAPH_NODES = [
  { x: 1, y: 1, label: "Intake" },
  { x: 51, y: 22, label: "Classify" },
  { x: 1, y: 43, label: "Execute", on: true },
  { x: 51, y: 64, label: "Report" },
];

/* AI-Powered Solutions — a workflow wired up and running. */
function SceneFlow() {
  return (
    <>
      <Brand icon="flow" title="Automation Flow" sub="Design, deploy, measure" />
      <svg className="dyas-iso__graph" viewBox="0 0 100 82" aria-hidden="true">
        <path d="M49 9.5H50V30.5H51" />
        <path d="M75 39V41H25V43" />
        <path d="M49 51.5H50V72.5H51" />
        {GRAPH_NODES.map((node) => (
          <g key={node.label} className={cn("node", node.on && "is-on")}>
            <rect x={node.x} y={node.y} width="48" height="17" rx="0.6" />
            <rect className="ico" x={node.x + 4} y={node.y + 4.5} width="8" height="8" rx="0.6" />
            <text x={node.x + 16} y={node.y + 9}>
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </>
  );
}

/* AI Agents — a fleet working across the systems you already run. */
function SceneAgents() {
  return (
    <>
      <Brand icon="bot" title="Agent Fleet" sub="Autonomous execution" />
      <Rows
        items={[
          {
            icon: "mail",
            title: "Lead Qualifier",
            sub: "Scores and routes inbound",
            state: "done",
            count: "18/18",
          },
          {
            icon: "clock",
            title: "Follow-up Agent",
            sub: "Books and reschedules",
            state: "live",
            count: "3/4",
          },
          {
            icon: "db",
            title: "Reconciler",
            sub: "Matches invoices to POs",
            state: "idle",
            count: "0/7",
          },
        ]}
      />
    </>
  );
}

/* AI Chatbots — a conversation that closes itself out. */
function SceneChat() {
  return (
    <>
      <Brand icon="chat" title="Support Assistant" sub="Answer, qualify, book" />
      <div className="dyas-iso__chat">
        <p>Is Friday free?</p>
        <p className="me">10:00 is open — hold it?</p>
        <p className="typing">
          <i />
          <i />
          <i />
        </p>
      </div>
      <div className="dyas-iso__chips">
        <span>Book it</span>
        <span>See pricing</span>
      </div>
    </>
  );
}

/* Web & Mobile — one product, shipped to every surface. */
function SceneSurfaces() {
  return (
    <>
      <Brand icon="device" title="Product Surfaces" sub="One build, web and native" />
      <div className="dyas-iso__surfaces">
        <div className="dyas-iso__win">
          <header>
            <i />
            <i />
            <i />
            <u />
          </header>
          <div>
            <div className="dyas-iso__stat">
              <strong>99.9%</strong>
              <span>uptime</span>
            </div>
            <div className="dyas-iso__bars">
              <i style={{ height: "38%" }} />
              <i style={{ height: "56%" }} />
              <i style={{ height: "44%" }} />
              <i style={{ height: "72%" }} />
              <i style={{ height: "60%" }} />
              <i className="on" style={{ height: "100%" }} />
            </div>
          </div>
        </div>
        <div className="dyas-iso__phone">
          <header />
          <div>
            <b />
            <b className="on" />
            <b />
          </div>
        </div>
      </div>
    </>
  );
}

/* E-Commerce — catalogue to checkout, with the exceptions surfaced. */
function SceneShop() {
  return (
    <>
      <Brand icon="cart" title="Order Pipeline" sub="Catalogue to checkout" />
      <Rows
        items={[
          {
            icon: "box",
            title: "Catalogue",
            sub: "1,240 SKUs in sync",
            state: "done",
            count: "OK",
          },
          {
            icon: "alert",
            title: "Fulfilment",
            sub: "2 orders need review",
            state: "live",
            count: "2",
          },
        ]}
      />
      <div className="dyas-iso__stat dyas-iso__stat--foot">
        <strong>312</strong>
        <span>orders routed today</span>
      </div>
    </>
  );
}

/* UI / UX — the system behind the screens, mid-edit. */
function SceneDesign() {
  return (
    <>
      <Brand icon="pen" title="Design System" sub="Frames, tokens, handoff" />
      <div className="dyas-iso__board">
        <aside>
          <span>
            <i />
            Header
          </span>
          <span className="on">
            <i />
            Hero
          </span>
          <span>
            <i />
            Cards
          </span>
        </aside>
        <div>
          <b />
          <b className="on" />
          <b />
          <b />
        </div>
      </div>
      <div className="dyas-iso__swatches">
        <span style={{ "--c": "#111111" } as CSSProperties} />
        <span style={{ "--c": "#5f5c55" } as CSSProperties} />
        <span style={{ "--c": "#b3afa4" } as CSSProperties} />
        <span style={{ "--c": "#e6e3dc" } as CSSProperties} />
        <span className="on" style={{ "--c": "var(--brand)" } as CSSProperties} />
      </div>
    </>
  );
}

const SCENES: { title: string; panel: ReactNode }[] = [
  { title: "AI-Powered Solutions", panel: <SceneFlow /> },
  { title: "AI Agents", panel: <SceneAgents /> },
  { title: "AI Chatbots", panel: <SceneChat /> },
  { title: "Web & Mobile App Development", panel: <SceneSurfaces /> },
  { title: "E-Commerce Development", panel: <SceneShop /> },
  { title: "UI / UX Services", panel: <SceneDesign /> },
];

const COUNT = SCENES.length;

export function PlatformStack({ progress, active }: { progress: number; active: number }) {
  const p = Math.min(1, Math.max(0, progress));
  const current = Math.min(COUNT - 1, Math.max(0, active));
  const scene = SCENES[current];

  return (
    <div className="dyas-iso" role="img" aria-label={scene.title}>
      <div className="dyas-iso__scene">
        <div className="dyas-iso__world" style={{ "--n": COUNT } as CSSProperties}>
          {SCENES.map((item, i) => (
            <div
              key={item.title}
              className="dyas-iso__slab"
              data-state={i <= current ? "built" : "ghost"}
              style={{ "--i": i } as CSSProperties}
            >
              <div className="dyas-iso__face" />
              <div className="dyas-iso__side dyas-iso__side--y" />
              <div className="dyas-iso__side dyas-iso__side--x" />
              <div
                className={cn("dyas-iso__panel", i === current && "is-on")}
                aria-hidden={i !== current}
              >
                {item.panel}
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">{`Layer ${current + 1} of ${COUNT}, ${Math.round(p * 100)}%`}</span>
    </div>
  );
}
