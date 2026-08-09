import { profile } from "@/content/profile";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section
      id="skills"
      index="02 / Skills"
      title="What I work with"
      lede="Rated honestly: five means I've shipped and debugged it in production, three means I'm productive but still reaching for docs, two means I'm actively learning it."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {profile.skills.map((group, gi) => (
          <Reveal key={group.group} delay={gi} className="bg-bg p-6 sm:p-8">
            <h3 className="label">{group.group}</h3>
            <ul className="mt-6 space-y-4">
              {group.items.map((item) => (
                <li key={item.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-mono text-[0.6875rem] text-subtle tabular-nums">
                      {item.level}/5
                    </span>
                  </div>
                  <div
                    className="mt-2 h-1 overflow-hidden rounded-full bg-sunken"
                    role="meter"
                    aria-valuenow={item.level}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-label={`${item.name} proficiency`}
                  >
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(item.level / 5) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
