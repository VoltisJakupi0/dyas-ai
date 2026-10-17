"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

export function ContactForm({ cta }: { cta: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get("honey") ?? "")) return;

    const fields = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <input type="text" name="honey" className="dyas-visually-hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="contact-name" className="text-mono-s uppercase opacity-60">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full border border-stroke-1 bg-transparent px-3 py-3 text-[16px] outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-mono-s uppercase opacity-60">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className="mt-2 w-full border border-stroke-1 bg-transparent px-3 py-3 text-[16px] outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-company" className="text-mono-s uppercase opacity-60">
          Company <span className="normal-case">(optional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          className="mt-2 w-full border border-stroke-1 bg-transparent px-3 py-3 text-[16px] outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-mono-s uppercase opacity-60">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full border border-stroke-1 bg-transparent px-3 py-3 text-[16px] outline-none"
        />
      </div>
      {status === "sent" ? (
        <p className="text-body-16-light" role="status">
          Request sent. We’ll get back to you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-body-16-light" role="status">
          Couldn’t send. Email us at{" "}
          <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      ) : null}
      <p className="text-body-16-light">Read our <a href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</a> to learn how we handle your enquiry.</p>
      <button type="submit" className="pgp-btn pgp-btn--primary" disabled={status === "sending"}>
        <span className="pgp-btn__label">
          <span>{status === "sending" ? "Sending…" : cta}</span>
          <span aria-hidden="true">{status === "sending" ? "Sending…" : cta}</span>
        </span>
      </button>
    </form>
  );
}
