import { money, type Product } from "../data/products";
import { IconArrowDown, IconBeanSolid, IconPlus } from "./icons";
import { Steam } from "./ui";

const HERO_IMAGE =
  "https://image.qwenlm.ai/generated-images/88177b15-28a1-4796-a646-712972f8cfd1/_result.png";

const TICKER_NOTES = [
  "Bergamot",
  "Cacao nib",
  "White peach",
  "Panela",
  "Blackcurrant",
  "Hazelnut",
  "Jasmine",
  "Molasses",
  "Red apple",
  "Rum raisin",
  "Grapefruit",
  "Toffee",
];

function RotatingStamp() {
  return (
    <div
      className="anim-spin-slow absolute -right-4 -top-4 h-[104px] w-[104px] md:-right-6 md:-top-6 md:h-[124px] md:w-[124px]"
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <path id="stamp-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="#1a110b" opacity="0.92" />
        <circle cx="50" cy="50" r="49" fill="none" stroke="#df9c4b" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#df9c4b" strokeOpacity="0.35" strokeWidth="1" />
        <text fontSize="8.2" letterSpacing="2.6" fill="#e7d5b6" fontWeight="700">
          <textPath href="#stamp-circle">ROASTED TO ORDER · SMALL BATCH ·</textPath>
        </text>
      </svg>
      <IconBeanSolid className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-caramel-500" />
    </div>
  );
}

export default function Hero({
  featured,
  onQuickAdd,
  onOpen,
}: {
  featured: Product;
  onQuickAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
}) {
  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-10">
        {/* copy */}
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-2.5">
            <IconBeanSolid className="h-3.5 w-3.5 text-caramel-500" />
            Small-batch roastery — Portland, OR
          </p>
          <h1 className="mt-5 font-display text-[44px] font-medium leading-[1.02] tracking-tight text-cream-50 sm:text-6xl xl:text-[76px]">
            Six coffees.
            <br />
            <em className="font-light italic text-caramel-400">Roasted</em> like it
            matters.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream-300 md:text-base">
            We buy six lots a month, roast them to order on a 1962 Probat, and ship
            within a day of first crack. No warehouse bags, no mystery blends — just
            this shelf, refilled when it&rsquo;s empty.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shelf"
              className="btn-press inline-flex h-12 items-center gap-2.5 rounded-full bg-caramel-500 px-6 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
            >
              Browse the shelf
              <IconArrowDown className="h-4 w-4" strokeWidth={2.2} />
            </a>
            <a
              href="#visit"
              className="text-sm font-bold text-cream-300 underline decoration-caramel-500/50 underline-offset-8 transition-colors hover:text-caramel-300"
            >
              How we roast
            </a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-cream-100/10 pt-7">
            {[
              ["24 h", "roast to dispatch"],
              ["6", "lots on the shelf"],
              ["100%", "traceable to farm"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-medium text-cream-50">{v}</dd>
                <dd className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-500">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* imagery */}
        <div className="relative mb-10 lg:col-span-5 lg:mb-0">
          <RotatingStamp />
          <button
            type="button"
            onClick={() => onOpen(featured)}
            className="group relative block w-full overflow-hidden rounded-xl border border-cream-100/10 text-left shadow-warm"
            aria-label={`View ${featured.name}`}
          >
            <img
              src={HERO_IMAGE}
              alt="Gooseneck kettle pouring a pour-over, steam rising"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-espresso-950/10" />
            <Steam className="bottom-[52%] left-1/2 -translate-x-1/2" />
          </button>

          {/* roast of the week card */}
          <div className="anim-rise absolute -bottom-8 -left-2 flex w-[292px] items-center gap-3 rounded-xl border border-cream-100/12 bg-espresso-900/95 p-3.5 shadow-warm backdrop-blur sm:-left-8" style={{ animationDelay: "250ms" }}>
            <button
              type="button"
              onClick={() => onOpen(featured)}
              className="h-[72px] w-14 shrink-0 overflow-hidden rounded-lg"
              aria-label={`Open ${featured.name} details`}
            >
              <img
                src={featured.image}
                alt={featured.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-caramel-400">
                Roast of the week
              </p>
              <button
                type="button"
                onClick={() => onOpen(featured)}
                className="mt-0.5 block truncate text-left font-display text-lg leading-tight text-cream-50 transition-colors hover:text-caramel-300"
              >
                {featured.name}
              </button>
              <p className="text-xs text-cream-400">
                {featured.notes.join(" · ")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="font-display text-lg text-cream-50">{money(featured.price)}</span>
              <button
                type="button"
                onClick={() => onQuickAdd(featured)}
                aria-label={`Add ${featured.name} to bag`}
                className="btn-press grid h-8 w-8 place-items-center rounded-full bg-caramel-500 text-espresso-950 transition-colors hover:bg-caramel-400"
              >
                <IconPlus className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* tasting-notes ticker */}
      <div className="ticker relative overflow-hidden border-y border-cream-100/10 bg-espresso-900/70 py-3.5">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-12" aria-hidden={dup === 1}>
              {TICKER_NOTES.map((n) => (
                <span
                  key={`${dup}-${n}`}
                  className="flex items-center gap-3 whitespace-nowrap text-xs font-extrabold uppercase tracking-[0.3em] text-cream-400"
                >
                  <IconBeanSolid className="h-3 w-3 text-caramel-600/80" />
                  {n}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
