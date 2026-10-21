import { ArrowUp, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Github, Linkedin } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div>
          <p className="font-mono text-xs text-subtle">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mt-1 font-mono text-xs text-subtle">
            Built with Next.js, TypeScript &amp; Tailwind.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted" data-noprint>
          <span>Resume:</span>
          <a href={profile.socials.resume} download="Mahmood-Ul-Hassan-Resume.pdf" className="rounded px-1 py-2 hover:text-fg">
            PDF
          </a>
          <a href={profile.socials.resumeWord} download="Mahmood-Ul-Hassan-Resume.docx" className="rounded px-1 py-2 hover:text-fg">
            Word
          </a>
        </div>

        <div className="flex items-center gap-1" data-noprint>
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
              className="grid size-9 place-items-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-fg"
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </a>
          ))}
          <a
            href="#top"
            aria-label="Back to top"
            className="ml-1 grid size-9 place-items-center rounded-lg border border-line text-subtle transition-colors hover:text-fg"
          >
            <ArrowUp className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
