import { GraduationCap, Award, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function About() {
  return (
    <Section id="about" index="01 / About" title="A short version">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Prose */}
        <div>
          <Reveal>
            <div className="flex items-start gap-5">
              {/* Monogram — no photo needed, never looks like a placeholder */}
              <div
                aria-hidden
                className="grid size-16 shrink-0 place-items-center rounded-2xl border border-line bg-raised font-display text-xl font-semibold tracking-tight shadow-card"
              >
                {profile.initials}
              </div>
              <div className="pt-1">
                <p className="font-display text-lg font-semibold tracking-tight">
                  {profile.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-subtle">
                  <MapPin className="size-3" strokeWidth={2} />
                  {profile.location}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 space-y-5">
            {profile.about.map((para, i) => (
              <Reveal key={i} delay={i + 1}>
                <p className="text-[1.0625rem] leading-[1.75] text-pretty text-muted">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Education & certifications */}
        <div className="space-y-8">
          <Reveal delay={1}>
            <h3 className="label flex items-center gap-2">
              <GraduationCap className="size-3.5" strokeWidth={2} />
              Education
            </h3>
            <div className="mt-4 space-y-5">
              {profile.education.map((e) => (
                <div key={e.degree} className="rounded-2xl border border-line bg-raised p-5">
                  <p className="font-display font-semibold tracking-tight">{e.degree}</p>
                  <p className="mt-1 text-sm text-muted">{e.school}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                    <span className="text-subtle">{e.period}</span>
                    {e.highlight ? (
                      <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-accent">
                        {e.highlight}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-subtle">{e.details}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {profile.certifications.length ? (
            <Reveal delay={2}>
              <h3 className="label flex items-center gap-2">
                <Award className="size-3.5" strokeWidth={2} />
                Certifications
              </h3>
              <ul className="mt-4 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
                {profile.certifications.map((c) => (
                  <li key={c.name} className="bg-raised px-5 py-3.5">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-subtle">
                      {c.issuer} · {c.year}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
