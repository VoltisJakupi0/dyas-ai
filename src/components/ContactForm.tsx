"use client";

import { useState, type SubmitEvent } from "react";
import { site } from "@/lib/site";

export function ContactForm({ cta }: { cta: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
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
    <form className="dyas-contact-form" onSubmit={onSubmit}>
      <input type="text" name="honey" className="dyas-visually-hidden" tabIndex={-1} autoComplete="off" />

      <div className="dyas-field dyas-field--half">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="dyas-field dyas-field--half">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" inputMode="email" />
      </div>
      <div className="dyas-field">
        <label htmlFor="contact-company">
          Company <span>(optional)</span>
        </label>
        <input id="contact-company" name="company" type="text" autoComplete="organization" />
      </div>
      <div className="dyas-field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" required rows={5} />
      </div>

      {status === "sent" ? (
        <p className="dyas-contact-form__status" role="status">
          <span className="dyas-dot" />
          Request sent. We’ll get back to you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="dyas-contact-form__status dyas-contact-form__status--error" role="alert">
          <span className="dyas-dot" />
          <span>
            Couldn’t send. Email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
          </span>
        </p>
      ) : null}

      <div className="dyas-contact-form__foot">
        <button type="submit" className="pgp-btn pgp-btn--primary" disabled={status === "sending"}>
          <span className="pgp-btn__label">
            <span>{status === "sending" ? "Sending…" : cta}</span>
            <span aria-hidden="true">{status === "sending" ? "Sending…" : cta}</span>
          </span>
        </button>
        <p>
          Read our <a href="/privacy-policy">Privacy Policy</a> to learn how we handle your enquiry.
        </p>
      </div>
    </form>
  );
}
