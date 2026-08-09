"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { Github, Linkedin } from "./icons";

/** Types the tagline out once on mount. Renders instantly if motion is reduced. */
function Typed({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text, reduced]);

  // Derived rather than assigned, so honouring reduced-motion needs no setState.
  const shown = reduced ? text.length : typed;

  return (
    <>
      <span>{text.slice(0, shown)}</span>
      {shown < text.length ? (
        <span className="animate-caret text-accent" aria-hidden>
          ▌
        </span>
      ) : null}
    </>
  );
}

export function Hero() {
  const tech = profile.skills.flatMap((g) => g.items.map((i) => i.name));

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="glow" aria-hidden />

      <div className="shell relative">
        {/* Availability */}
        <div className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-raised px-3.5 py-1.5">
          <span className="relative grid size-2 place-items-center">
            <span className="animate-pulse-dot absolute size-2 rounded-full bg-accent" />
            <span className="size-1 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-xs tracking-tight text-muted">
            {profile.availability}
          </span>
        </div>

        <h1
          className="animate-rise mt-8 font-display text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-balance"
          style={{ animationDelay: "60ms" }}
        >
          {profile.name}
        </h1>

        <p
          className="animate-rise mt-5 font-mono text-sm tracking-tight text-accent sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          {profile.role} · {profile.location}
        </p>

        <p
          className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl"
          style={{ animationDelay: "180ms" }}
        >
          <Typed text={profile.tagline} />
        </p>

        {/* CTAs */}
        <div
          className="animate-rise mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-xl bg-fg px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-88"
          >
            See my work
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" strokeWidth={2} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 text-sm font-medium transition-colors hover:bg-raised"
          >
            Get in touch
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </a>

          <div className="ml-1 flex items-center gap-1">
            {[
              { href: profile.socials.github, Icon: Github, label: "GitHub" },
              { href: profile.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, Icon: Mail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-fg"
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        {/* Stats */}
        <dl
          className="animate-rise mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line"
          style={{ animationDelay: "300ms" }}
        >
          {profile.stats.map((s) => (
            <div key={s.label} className="bg-bg px-4 py-5 sm:px-6">
              <dt className="label">{s.label}</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Tech marquee */}
      <div
        data-noprint
        className="animate-rise relative mt-20 flex overflow-hidden border-y border-line py-4"
        style={{ animationDelay: "360ms" }}
        aria-hidden
      >
        <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap">
          {[...tech, ...tech].map((t, i) => (
            <span key={i} className="font-mono text-xs tracking-wide text-subtle">
              {t}
              <span className="ml-8 text-accent">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
