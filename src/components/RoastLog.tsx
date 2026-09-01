import { Reveal } from "./ui";

function day(offset: number): { dow: string; date: string } {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return {
    dow: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

const LOG = [
  {
    offset: 1,
    lot: "Gatomboya AA",
    batch: "14 kg",
    crack: "9:42",
    note: "Dropped 28 s after first crack. The blackcurrant stayed loud — exactly what we wanted.",
  },
  {
    offset: 2,
    lot: "Idido Yirgacheffe",
    batch: "12 kg",
    crack: "9:18",
    note: "Pulled early at 204 °C. Washed heirloom punishes a heavy hand, so we kept it light.",
  },
  {
    offset: 4,
    lot: "Foundry Espresso",
    batch: "18 kg",
    crack: "8:55",
    note: "Development 22 %. Dialed in this morning at 27 s — tiger stripes on every shot.",
  },
  {
    offset: 5,
    lot: "Dusk Decaf",
    batch: "10 kg",
    crack: "9:03",
    note: "Sugarcane decaf wants a gentle curve. Nothing rushed, nothing baked.",
  },
  {
    offset: 6,
    lot: "Santa Rosa Natural",
    batch: "4 kg",
    crack: "9:31",
    note: "Tiny drum load. Anaerobic fruit everywhere — the whole roastery smelled like jam.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Source",
    d: "Nineteen farms we can name, bought directly or through the co-ops we visit. Green price printed on every bag.",
  },
  {
    n: "02",
    t: "Roast",
    d: "To order, on the 1962 Probat, in batches of 14 kg or less. No stockpiles, no stale drums.",
  },
  {
    n: "03",
    t: "Rest",
    d: "Beans degas 24–48 hours, then every bag is stamped with its roast date by hand.",
  },
  {
    n: "04",
    t: "Ship",
    d: "Out the door within a day of resting. Portland addresses go by bike courier.",
  },
];

export default function RoastLog() {
  return (
    <section
      id="roastery"
      className="scroll-mt-24 border-y border-cream-100/8 bg-espresso-900/45"
    >
      <div className="container-x grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_360px] lg:gap-20">
        {/* ledger */}
        <Reveal>
          <div>
            <p className="eyebrow">The roast log</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-cream-50 md:text-5xl">
              This week in the roastery
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream-400">
              Every batch gets written down — drop time, development, how it cupped
              the next morning. This is the actual page off the clipboard by the
              cooling tray.
            </p>

            <div className="mt-9 overflow-hidden rounded-xl border border-cream-100/10">
              <div className="hidden grid-cols-[72px_1.2fr_0.7fr_0.7fr_1.8fr] gap-4 border-b border-cream-100/10 bg-espresso-850 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-cream-500 sm:grid">
                <span>Day</span>
                <span>Lot</span>
                <span>Batch</span>
                <span>1st crack</span>
                <span>Roaster&rsquo;s note</span>
              </div>
              {LOG.map((r, i) => {
                const d = day(r.offset);
                return (
                  <div
                    key={r.lot}
                    className={`group grid gap-x-4 gap-y-1.5 px-4 py-4 transition-colors hover:bg-espresso-850/70 sm:grid-cols-[72px_1.2fr_0.7fr_0.7fr_1.8fr] sm:items-baseline sm:px-5 ${
                      i > 0 ? "border-t border-cream-100/8" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3 sm:contents">
                      <p className="text-sm">
                        <span className="font-extrabold text-caramel-300">{d.dow}</span>{" "}
                        <span className="text-xs text-cream-500">{d.date}</span>
                      </p>
                      <p className="truncate font-display text-lg leading-tight text-cream-50 sm:overflow-visible sm:whitespace-normal">
                        {r.lot}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-4 sm:contents">
                      <p className="text-sm font-bold tabular-nums text-cream-300">{r.batch}</p>
                      <p className="text-sm font-bold tabular-nums text-cream-300">
                        <span className="font-semibold text-cream-500 sm:hidden">crack </span>
                        {r.crack}
                      </p>
                    </div>
                    <p className="text-sm italic leading-relaxed text-cream-400">{r.note}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-right text-[11px] font-bold uppercase tracking-[0.2em] text-cream-600">
              Updated after every roast day
            </p>
          </div>
        </Reveal>

        {/* rail: dial-in card + steps */}
        <div className="space-y-10">
          <Reveal delay={120}>
            <div className="relative -rotate-2 rounded-md bg-cream-100 p-6 text-espresso-900 shadow-warm transition-transform duration-500 ease-out hover:rotate-0">
              <span
                aria-hidden
                className="absolute -top-2.5 left-8 h-5 w-16 rotate-6 rounded-[2px] bg-cream-300/50"
              />
              <span
                aria-hidden
                className="absolute -top-2.5 right-8 h-5 w-16 -rotate-3 rounded-[2px] bg-cream-300/50"
              />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-espresso-900/50">
                House dial-in · today
              </p>
              <p className="mt-2 font-display text-3xl font-medium leading-none">
                Foundry Espresso
              </p>
              <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[
                  ["18 g", "in"],
                  ["36 g", "out"],
                  ["27 s", "time"],
                  ["93°", "temp"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded border border-espresso-900/15 py-2.5">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display text-lg font-semibold tabular-nums">{v}</dd>
                    <dd className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-espresso-900/45">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm italic leading-relaxed text-espresso-900/75">
                Pulls syrupy today. Under 26 s it runs sour, past 29 it goes ashy —
                grind finer, don&rsquo;t pull longer.
              </p>
              <p className="mt-3 text-right font-display text-sm italic text-espresso-900/60">
                — R., head roaster
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-cream-500">
                How a bag gets to you
              </p>
              <ul className="mt-4">
                {STEPS.map((s) => (
                  <li
                    key={s.n}
                    className="group flex gap-5 border-b border-cream-100/8 py-4 first:pt-0 last:border-0"
                  >
                    <span className="font-display text-xl italic text-caramel-600/80 transition-colors group-hover:text-caramel-400">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg leading-tight text-cream-100">{s.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-cream-400">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
