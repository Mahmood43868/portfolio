import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Github } from "./icons";
import { Reveal } from "./reveal";
import { Section } from "./section";

type Project = (typeof profile.projects)[number];

function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-md border border-line bg-sunken px-2 py-1 font-mono text-[0.6875rem] text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.github ? (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium transition-colors hover:border-line-strong hover:bg-sunken"
        >
          <Github className="size-3.5" strokeWidth={1.75} />
          Code
        </a>
      ) : null}
      {project.demo ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-lg bg-fg px-3 py-2 text-xs font-medium text-bg transition-opacity hover:opacity-90"
        >
          Live demo
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </a>
      ) : null}
    </div>
  );
}

function Featured({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal
      as="article"
      delay={index}
      className="lift group relative overflow-hidden rounded-3xl border border-line bg-raised p-7 shadow-card sm:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="label text-accent">Featured</span>
            <span className="font-mono text-xs text-subtle">{project.year}</span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 font-mono text-xs text-subtle">{project.status}</p>
          <p className="mt-2 text-base text-muted">{project.blurb}</p>
          <p className="mt-5 leading-relaxed text-pretty text-muted">{project.description}</p>

          <ul className="mt-6 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 space-y-5">
            <Tags tags={project.tags} />
            <Links project={project} />
          </div>
        </div>

        {/* Metrics — the part a reviewer actually remembers */}
        {project.metrics.length ? (
          <div className="flex flex-col gap-px self-start overflow-hidden rounded-2xl border border-line bg-line">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-bg px-5 py-5">
                <p className="font-display text-3xl font-semibold tracking-tight text-accent tabular-nums">
                  {m.value}
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] leading-snug text-subtle">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

function Compact({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal
      as="article"
      delay={index}
      className="lift flex flex-col rounded-2xl border border-line bg-raised p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">{project.title}</h3>
        <span className="font-mono text-xs text-subtle">{project.year}</span>
      </div>

      <p className="mt-2 font-mono text-xs text-subtle">{project.status}</p>
      <p className="mt-2 text-sm text-muted">{project.blurb}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-subtle">{project.description}</p>

      {project.metrics.length ? (
        <p className="mt-4 font-mono text-xs text-accent">
          {project.metrics.map((m) => `${m.value} ${m.label}`).join(" · ")}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        <Tags tags={project.tags} />
        <Links project={project} />
      </div>
    </Reveal>
  );
}

export function Projects() {
  const featured = profile.projects.filter((p) => p.featured);
  const rest = profile.projects.filter((p) => !p.featured);

  return (
    <Section
      id="projects"
      index="03 / Projects"
      title="Things I've built"
      lede="Selected work across business software, academy management, web publishing and AI-assisted order automation."
    >
      <div className="space-y-6">
        {featured.map((p, i) => (
          <Featured key={p.title} project={p} index={i} />
        ))}
      </div>

      {rest.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <Compact key={p.title} project={p} index={i} />
          ))}
        </div>
      ) : null}

      <Reveal delay={2}>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg"
        >
          <Github className="size-4" strokeWidth={1.75} />
          Everything else on GitHub
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </a>
      </Reveal>
    </Section>
  );
}
