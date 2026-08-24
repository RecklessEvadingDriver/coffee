import { Reveal } from "./ui";
import { IconCup, IconFlame, IconMapPin, IconTruck } from "./icons";

const STEPS = [
  {
    n: "01",
    title: "Source",
    icon: IconMapPin,
    copy: "Nineteen farming families, visited every harvest. We pay for quality at the farm gate, not the commodity board.",
  },
  {
    n: "02",
    title: "Roast",
    icon: IconFlame,
    copy: "A 1962 Probat, twelve kilos at a time. Every profile is logged, cupped, and argued over before it ships.",
  },
  {
    n: "03",
    title: "Rest & cup",
    icon: IconCup,
    copy: "Each batch rests 24 hours, then goes to the cupping table. Anything under 85 points gets re-roasted or pulled.",
  },
  {
    n: "04",
    title: "Ship",
    icon: IconTruck,
    copy: "Stamped with the roast date, sealed with a one-way valve, and out the door within a day of first crack.",
  },
];

export default function ProcessBand() {
  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden border-y border-cream-100/8 bg-espresso-900/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 120% at 15% 0%, rgba(223,156,75,0.07), transparent 60%), radial-gradient(60% 100% at 90% 100%, rgba(194,84,58,0.06), transparent 55%)",
        }}
      />
      <div className="container-x relative py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div>
              <p className="eyebrow">From cherry to cup</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-cream-50 md:text-5xl">
                Four steps. <em className="font-light italic text-caramel-400">Zero</em> shortcuts.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-sm leading-relaxed text-cream-400">
              The same discipline applies to every bag on the shelf — whether it&rsquo;s a
              twelve-bag microlot or the espresso we pull two hundred times a week.
            </p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <li
                className={`relative ${i % 2 === 1 ? "lg:translate-y-6" : ""}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-6xl font-light leading-none text-espresso-600">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-caramel-500/60 to-transparent" />
                  <s.icon className="h-6 w-6 shrink-0 self-center text-caramel-500" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-cream-50">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-cream-400">{s.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
