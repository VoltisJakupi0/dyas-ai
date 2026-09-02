"use client";

import { useEffect, useRef, useState } from "react";
import { embed } from "@/lib/site";
import { CornerFrame } from "@/components/ui/Frames";

const STATIONS = [
  {
    role: "Builder",
    doing: "Shipping a page",
    corner: "nw",
    ...embed.pillars[0],
  },
  {
    role: "Designer",
    doing: "Tuning the grid",
    corner: "ne",
    ...embed.pillars[2],
  },
  {
    role: "Integrator",
    doing: "Wiring the CRM",
    corner: "sw",
    ...embed.pillars[1],
  },
  {
    role: "Operator",
    doing: "Watching the queue",
    corner: "se",
    ...embed.pillars[3],
  },
];

const TASKS = [
  { title: "Qualify inbound lead" },
  { title: "Reply on WhatsApp" },
  { title: "Draft weekly report" },
  { title: "Ship the new landing" },
];

const FEED = [
  "BUILDER compiling the landing page",
  "DESIGNER tightening the type scale",
  "INTEGRATOR wiring HubSpot to the agent",
  "OPERATOR cleared 3 items from queue",
  "INBOX: qualify inbound lead",
  "BUILDER handed a preview to DESIGNER",
  "INTEGRATOR CRM mapping is live",
  "OPERATOR night run still green",
];

const CHAIRS = [
  { x: 26.8, y: 47.0, face: "up" as const, join: { x: 36, y: 51 } },
  { x: 73.2, y: 47.0, face: "up" as const, join: { x: 64, y: 51 } },
  { x: 25.8, y: 71.6, face: "up" as const, join: { x: 36, y: 74 } },
  { x: 73.6, y: 73.2, face: "up" as const, join: { x: 64, y: 76 } },
];

const AISLE = [
  { x: 47, y: 52 },
  { x: 47, y: 63 },
  { x: 47, y: 74 },
];

type Pose = "sit" | "idle" | "walk";
type Face = "left" | "right" | "up" | "down";
type Point = { x: number; y: number; sit?: boolean };

type Pawn = {
  id: number;
  x: number;
  y: number;
  pose: Pose;
  face: Face;
  frame: 0 | 1;
  path: Point[];
  wait: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function clockLabel() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "09";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

function hypot(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

function aisleIndex(y: number) {
  let best = 0;
  for (let i = 1; i < AISLE.length; i++) {
    if (Math.abs(AISLE[i].y - y) < Math.abs(AISLE[best].y - y)) best = i;
  }
  return best;
}

function aisleWalk(fromY: number, toY: number): Point[] {
  const start = aisleIndex(fromY);
  const end = aisleIndex(toY);
  const points: Point[] = [];
  const step = start <= end ? 1 : -1;
  for (let i = start; i !== end; i += step) {
    points.push(AISLE[i + step]);
  }
  return points;
}

function outPath(id: number): Point[] {
  const chair = CHAIRS[id];
  const target = AISLE[id < 2 ? AISLE.length - 1 : 0];
  return [chair.join, AISLE[aisleIndex(chair.join.y)], ...aisleWalk(chair.join.y, target.y)];
}

function homePath(id: number, from: Point): Point[] {
  const chair = CHAIRS[id];
  return [
    AISLE[aisleIndex(from.y)],
    ...aisleWalk(from.y, chair.join.y),
    chair.join,
    { x: chair.x, y: chair.y, sit: true },
  ];
}

function seedCrew(): Pawn[] {
  return CHAIRS.map((chair, id) => ({
    id,
    x: chair.x,
    y: chair.y,
    pose: "sit" as const,
    face: chair.face,
    frame: 0 as const,
    path: [],
    wait: 2800 + id * 2200,
  }));
}

function tickCrew(crew: Pawn[], dt: number, now: number): Pawn[] {
  const walking = crew.some((p) => p.pose === "walk" || p.path.length > 0);
  return crew.map((pawn) => {
    if (pawn.pose === "walk" || pawn.path.length > 0) {
      const dest = pawn.path[0];
      if (!dest) {
        const chair = CHAIRS[pawn.id];
        return {
          ...pawn,
          pose: "sit",
          face: chair.face,
          x: chair.x,
          y: chair.y,
          path: [],
          wait: 5000,
        };
      }
      const dist = hypot(pawn.x, pawn.y, dest.x, dest.y);
      if (dist < 1.05) {
        const rest = pawn.path.slice(1);
        const chair = CHAIRS[pawn.id];
        if (dest.sit) {
          return {
            ...pawn,
            x: chair.x,
            y: chair.y,
            pose: "sit",
            face: chair.face,
            path: [],
            wait: 4800 + pawn.id * 400,
          };
        }
        if (rest.length === 0) {
          return {
            ...pawn,
            x: dest.x,
            y: dest.y,
            pose: "idle",
            path: [],
            wait: 900,
          };
        }
        return { ...pawn, x: dest.x, y: dest.y, path: rest, pose: "walk" };
      }
      const speed = 11;
      const step = Math.min(dist, speed * dt);
      const nx = pawn.x + ((dest.x - pawn.x) / dist) * step;
      const ny = pawn.y + ((dest.y - pawn.y) / dist) * step;
      return {
        ...pawn,
        x: nx,
        y: ny,
        pose: "walk",
        face: heading(pawn.x, pawn.y, dest.x, dest.y),
        frame: Math.floor(now / 140) % 2 === 0 ? 0 : 1,
      };
    }

    const rest = pawn.wait - dt * 1000;
    if (rest > 0) return { ...pawn, wait: rest };

    if (pawn.pose === "idle") {
      return { ...pawn, pose: "walk", path: homePath(pawn.id, { x: pawn.x, y: pawn.y }), wait: 0 };
    }

    if (walking) return { ...pawn, wait: 1100 };

    return { ...pawn, pose: "walk", path: outPath(pawn.id), wait: 0 };
  });
}

function heading(x: number, y: number, tx: number, ty: number): Face {
  const dx = tx - x;
  const dy = ty - y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "up" : "down";
}

function pawnSrc(pawn: Pawn) {
  const step = pawn.frame === 0 ? "a" : "b";
  if (pawn.pose === "sit") return "/images/floor/sit-rear.png";
  if (pawn.pose === "idle") {
    if (pawn.face === "up") return "/images/floor/idle-back.png";
    if (pawn.face === "left") return "/images/floor/idle-left.png";
    return "/images/floor/idle.png";
  }
  if (pawn.face === "up") return `/images/floor/walk-up-${step}.png`;
  if (pawn.face === "down") return `/images/floor/walk-down-${step}.png`;
  if (pawn.face === "left") return `/images/floor/walk-${step}-left.png`;
  return `/images/floor/walk-${step}.png`;
}

export function Embed() {
  const [active, setActive] = useState(0);
  const [task, setTask] = useState(0);
  const [feed, setFeed] = useState(0);
  const [time, setTime] = useState("09:41");
  const [crew, setCrew] = useState<Pawn[]>(() => seedCrew());
  const paused = useRef(false);
  const station = STATIONS[active];
  const errand = TASKS[task];

  useEffect(() => {
    setTime(clockLabel());
    const tick = window.setInterval(() => setTime(clockLabel()), 15000);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return () => window.clearInterval(tick);
    }

    const desks = window.setInterval(() => {
      if (paused.current) return;
      setActive((i) => (i + 1) % STATIONS.length);
    }, 4200);

    const jobs = window.setInterval(() => {
      if (paused.current) return;
      setTask((i) => (i + 1) % TASKS.length);
    }, 2800);

    const logs = window.setInterval(() => {
      if (paused.current) return;
      setFeed((i) => (i + 1) % FEED.length);
    }, 2200);

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc >= 1 / 18) {
        const step = acc;
        acc = 0;
        setCrew((prev) => tickCrew(prev, step, now));
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(desks);
      window.clearInterval(jobs);
      window.clearInterval(logs);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const focus = (i: number) => {
    paused.current = true;
    setActive(i);
  };

  const feedLines = [0, 1, 2, 3].map((offset) => FEED[(feed + offset) % FEED.length]);

  return (
    <section id="floor" className="relative overflow-clip bg-day pt-0 pb-18 text-black md:pb-28 lg:pb-40">
      <div className="container-site relative z-1 flex flex-col items-center pt-18 text-center md:pt-24 lg:pt-32">
        <p className="text-mono-s mb-6 uppercase opacity-50">{embed.kicker}</p>
        <h2 className="text-heading-48 max-w-[44.75rem] text-pretty">{embed.headline}</h2>
        <p className="text-body-18-light mt-6 max-w-[43.125rem] opacity-80">{embed.body}</p>

        <div className="relative mx-auto mt-14 w-full max-w-[72.75rem]">
          <CornerFrame tick="text-stroke-2" className="w-full">
            <div className="relative px-3 py-3 md:px-5 md:py-5">
              <div
                className="dyas-floor"
                onMouseEnter={() => {
                  paused.current = true;
                }}
                onMouseLeave={() => {
                  paused.current = false;
                }}
              >
                <div className="dyas-floor__top">
                  <p className="dyas-floor__title">Dyas floor · Live</p>
                  <span className="dyas-floor__tag">Day shift</span>
                  <span className="dyas-floor__tag dyas-floor__tag--on">4 / 4 agents</span>
                  <em>{time}</em>
                </div>

                <div className="dyas-floor__board">
                  <div className="dyas-floor__plan">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="dyas-floor__art"
                      src="/images/floor-office.webp"
                      alt="Pixel office floor with four agent desks"
                      width={1920}
                      height={1280}
                      decoding="async"
                      loading="lazy"
                    />

                    {STATIONS.map((item, i) => (
                      <button
                        key={item.role}
                        type="button"
                        className={`dyas-desk dyas-desk--${item.corner}`}
                        onClick={() => setActive(i)}
                        onMouseEnter={() => focus(i)}
                        onFocus={() => focus(i)}
                        aria-label={`${item.role}: ${item.title}`}
                      />
                    ))}

                    {crew.map((pawn) => (
                      <span
                        key={pawn.id}
                        className={`dyas-pawn dyas-pawn--${pawn.pose}`}
                        data-on={pawn.id === active ? "true" : undefined}
                        style={{ left: `${pawn.x}%`, top: `${pawn.y}%`, zIndex: 4 + Math.round(pawn.y) }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pawnSrc(pawn)}
                          alt=""
                          width={80}
                          height={118}
                          decoding="async"
                          loading="lazy"
                        />
                        <em>{STATIONS[pawn.id].role}</em>
                      </span>
                    ))}
                  </div>

                  <aside className="dyas-floor__side">
                    <p className="dyas-floor__side-kicker">Agents</p>
                    <ul className="dyas-floor__roster">
                      {STATIONS.map((item, i) => (
                        <li key={item.role} data-on={i === active ? "true" : undefined}>
                          <button type="button" onClick={() => focus(i)}>
                            <i />
                            <b>{item.role}</b>
                            <span>
                              {crew[i]?.pose === "walk"
                                ? "walking"
                                : crew[i]?.pose === "idle"
                                  ? "on errand"
                                  : item.doing}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    <p className="dyas-floor__side-kicker">Live feed</p>
                    <ol className="dyas-floor__feed">
                      {feedLines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ol>
                  </aside>
                </div>

                <div className="dyas-floor__stats" aria-hidden="true">
                  <p>
                    <b>Inbox</b>
                    <span key={errand.title}>{errand.title}</span>
                  </p>
                  <p>
                    <b>Now</b>
                    <span>
                      {station.role} · {crew[active]?.pose === "walk" ? "walking" : station.doing}
                    </span>
                  </p>
                  <p>
                    <b>Today</b>
                    <span>27 tasks · 4 agents</span>
                  </p>
                </div>

                <div className="dyas-floor__caption" role="status">
                  <p className="dyas-floor__count">
                    {pad(active + 1)} / {pad(STATIONS.length)}
                    <span>{station.role}</span>
                  </p>
                  <h3 key={station.title}>{station.title}</h3>
                  <p key={station.body}>{station.body}</p>
                </div>
              </div>
              <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 left-0 w-px" />
              <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 right-0 w-px" />
            </div>
          </CornerFrame>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/ellipse.avif"
        alt=""
        width={1440}
        height={644}
        decoding="async"
        loading="lazy"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 aspect-1440/644 max-h-[644px] w-full object-cover object-top"
      />
    </section>
  );
}
