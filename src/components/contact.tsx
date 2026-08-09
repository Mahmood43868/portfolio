"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2, Mail, Send } from "lucide-react";
import { profile } from "@/content/profile";
import { contactSchema, type ContactErrors } from "@/lib/contact-schema";
import { Github, Linkedin } from "./icons";
import { Reveal } from "./reveal";
import { Section } from "./section";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-subtle focus:border-accent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactErrors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <Section
      id="contact"
      index="05 / Contact"
      title="Let's talk"
      lede="Hiring, a question about something I built, or just to say hello — the form reaches my inbox directly."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        {/* Direct routes */}
        <Reveal className="space-y-8">
          <div>
            <h3 className="label">Direct</h3>
            <a
              href={`mailto:${profile.email}`}
              className="link mt-3 inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight break-all"
            >
              <Mail className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
              {profile.email}
            </a>
            {profile.phone ? (
              <p className="mt-2 font-mono text-sm text-muted">{profile.phone}</p>
            ) : null}
          </div>

          <div>
            <h3 className="label">Elsewhere</h3>
            <ul className="mt-3 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
              {[
                { href: profile.socials.github, Icon: Github, label: "GitHub" },
                { href: profile.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, Icon, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-raised px-5 py-3.5 text-sm transition-colors hover:bg-sunken"
                  >
                    <Icon className="size-4 text-muted" strokeWidth={1.75} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="rounded-2xl border border-line bg-raised p-5 text-sm leading-relaxed text-muted">
            <span className="text-accent">●</span> {profile.availability}. Based in{" "}
            {profile.location}, comfortable with remote and happy to relocate.
          </p>
        </Reveal>

        {/* Form */}
        <Reveal delay={1}>
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                  aria-invalid={!!errors.name}
                />
              </Field>

              <Field label="Email" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                  aria-invalid={!!errors.email}
                />
              </Field>
            </div>

            <Field label="Subject" name="subject" error={errors.subject}>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Frontend role at …"
                className={fieldClass}
                aria-invalid={!!errors.subject}
              />
            </Field>

            <Field label="Message" name="message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell me about the role or the problem you're solving…"
                className={`${fieldClass} resize-y`}
                aria-invalid={!!errors.message}
              />
            </Field>

            {/* Honeypot — hidden from people, irresistible to bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-xl bg-fg px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" strokeWidth={2} />
                    Send message
                  </>
                )}
              </button>

              <p aria-live="polite" className="text-sm">
                {status === "sent" ? (
                  <span className="inline-flex items-center gap-1.5 text-accent">
                    <Check className="size-4" strokeWidth={2.5} />
                    Thanks — I&apos;ll reply within a day or two.
                  </span>
                ) : null}
                {status === "error" ? (
                  <span className="inline-flex items-center gap-1.5 text-signal">
                    <AlertCircle className="size-4" strokeWidth={2} />
                    {serverError}
                  </span>
                ) : null}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label mb-2 block">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-signal">
          <AlertCircle className="size-3" strokeWidth={2} />
          {error}
        </p>
      ) : null}
    </div>
  );
}
