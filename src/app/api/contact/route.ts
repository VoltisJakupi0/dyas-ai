import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

type Body = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  honey?: string;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function allow(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function text({ name, email, company, message }: { name: string; email: string; company: string; message: string }) {
  return [`Name: ${name}`, `Email: ${email}`, `Company: ${company || "—"}`, "", message].join("\n");
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readBody(req: Request): Promise<{ body: Body; native: boolean }> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    return { body: (await req.json()) as Body, native: false };
  }
  const form = await req.formData();
  return {
    native: true,
    body: {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      message: String(form.get("message") ?? ""),
      honey: String(form.get("honey") ?? ""),
    },
  };
}

function mailtoUrl(fields: { name: string; email: string; company: string; message: string }) {
  const subject = encodeURIComponent(`New inquiry from ${fields.name}`);
  const body = encodeURIComponent(text(fields));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

async function sendWithResend(fields: { name: string; email: string; company: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Dyas AI <beth.t@example.com>";
  const content = text(fields);
  const { error } = await resend.emails.send({
    from,
    to: [site.email],
    replyTo: fields.email,
    subject: `New inquiry from ${fields.name}`,
    text: content,
    html: `<p><strong>Name:</strong> ${esc(fields.name)}</p>
<p><strong>Email:</strong> ${esc(fields.email)}</p>
<p><strong>Company:</strong> ${esc(fields.company || "—")}</p>
<p>${esc(fields.message).replace(/\n/g, "<br>")}</p>`,
  });
  return !error;
}

async function sendWithWeb3Forms(fields: { name: string; email: string; company: string; message: string }) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return false;

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New inquiry from ${fields.name}`,
      from_name: fields.name,
      email: fields.email,
      company: fields.company,
      message: text(fields),
    }),
  });
  const json = (await res.json()) as { success?: boolean };
  return Boolean(json.success);
}

export async function POST(req: Request) {
  if (!allow(clientIp(req))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let parsed: { body: Body; native: boolean };
  try {
    parsed = await readBody(req);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { body, native } = parsed;
  if (body.honey) {
    if (native) return NextResponse.redirect(new URL("/contact-us", req.url), 303);
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const company = String(body.company ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (native) return NextResponse.redirect(new URL("/contact-us", req.url), 303);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = { name, email, company, message };
  const sent = (await sendWithResend(payload)) || (await sendWithWeb3Forms(payload));

  if (sent) {
    if (native) return NextResponse.redirect(new URL("/contact-us?sent=1", req.url), 303);
    return NextResponse.json({ ok: true });
  }

  if (native) return NextResponse.redirect(mailtoUrl(payload), 303);
  return NextResponse.json({ ok: false, mailto: true });
}
