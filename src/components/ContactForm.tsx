"use client";

import { site } from "@/lib/site";

export function ContactForm({ cta }: { cta: string }) {
  return (
    <form className="mt-8 space-y-4" action={`mailto:${site.email}`} method="get">
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
          Company
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
          name="body"
          required
          rows={5}
          className="mt-2 w-full border border-stroke-1 bg-transparent px-3 py-3 text-[16px] outline-none"
        />
      </div>
      <button type="submit" className="pgp-btn pgp-btn--primary">
        <span className="pgp-btn__label">
          <span>{cta}</span>
          <span aria-hidden="true">{cta}</span>
        </span>
      </button>
    </form>
  );
}
