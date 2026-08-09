import { Reveal } from "./reveal";

type Props = {
  id: string;
  index: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  className?: string;
};

/** Shared section frame: numbered label, heading, optional lede. */
export function Section({ id, index, title, lede, children, className }: Props) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 sm:py-28 ${className ?? ""}`}>
      <div className="shell">
        <Reveal>
          <div className="flex items-baseline gap-3">
            <span className="label text-accent">{index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">{lede}</p>
          ) : null}
        </Reveal>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
