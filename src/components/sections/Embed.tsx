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
  { x: 24, y: 46.5, face: "up" as const },
  { x: 70, y: 46.5, face: "up" as const },
  { x: 22.5, y: 70.5, face: "up" as const },
  { x: 71, y: 70.5, face: "up" as const },
];

type Pose = "sit" | "idle" | "walk";
type Face = "left" | "right" | "up" | "down";

type Pawn = {
  id: number;
  x: number;
  y: number;
  pose: Pose;
  face: Face;
  frame: 0 | 1;
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

function seedCrew(): Pawn[] {
  return CHAIRS.map((chair, id) => ({
    id,
    x: chair.x,
    y: chair.y,
    pose: "sit" as const,
    face: chair.face,
    frame: 0 as const,
  }));
}

function pawnSrc() {
  return "/images/floor/sit-rear.png";
}

export function Embed() {
  const [active, setActive] = useState(0);
  const [task, setTask] = useState(0);
  const [feed, setFeed] = useState(0);
  const [time, setTime] = useState("09:41");
  const [crew] = useState<Pawn[]>(() => seedCrew());
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

    return () => {
      window.clearInterval(tick);
      window.clearInterval(desks);
      window.clearInterval(jobs);
      window.clearInterval(logs);
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
                          src={pawnSrc()}
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
                            <span>{item.doing}</span>
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
                      {station.role} · {station.doing}
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
