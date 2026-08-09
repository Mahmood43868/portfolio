import { profile } from "@/content/profile";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Experience() {
  return (
    <Section
      id="experience"
      index="04 / Experience"
      title="Where I've worked"
      lede="Internships, freelance, and open source. Each bullet says what changed, not what I was assigned."
    >
      <ol className="relative">
        {/* Timeline rail */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[7px] w-px bg-line sm:left-[7px]"
        />

        {profile.experience.map((job, i) => (
          <Reveal as="li" key={`${job.org}-${job.role}`} delay={i} className="relative pb-12 pl-8 last:pb-0">
            <span
              aria-hidden
              className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-accent bg-bg"
            />

            <p className="label">{job.period}</p>

            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
              {job.role}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {job.org} <span className="text-subtle">· {job.location}</span>
            </p>

            <ul className="mt-5 space-y-2.5">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {job.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-line bg-sunken px-2 py-1 font-mono text-[0.6875rem] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
