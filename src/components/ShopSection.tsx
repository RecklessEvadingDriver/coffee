import { useMemo, useState } from "react";
import {
  CATEGORIES,
  LOW_STOCK_AT,
  money,
  type CategoryFilter,
  type Product,
} from "../data/products";
import { Reveal, RoastMeter } from "./ui";
import {
  IconBeanLine,
  IconBeanSolid,
  IconChevronDown,
  IconFlame,
  IconPlus,
  IconSearch,
  IconX,
} from "./icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "roast";

function roastDay(offsetDir: 1 | -1): string {
  const d = new Date();
  const delta = ((2 - d.getDay() + 7) % 7) || 7; // Tuesdays
  d.setDate(d.getDate() + offsetDir * delta);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function LedgerRow({
  product,
  index,
  onOpen,
  onAdd,
}: {
  product: Product;
  index: number;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= LOW_STOCK_AT;
  const idx = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={index * 60}>
      <article
        onClick={() => onOpen(product)}
        className="group -mx-3 grid cursor-pointer grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-xl px-3 py-5 transition-all duration-300 hover:bg-espresso-850/80 sm:-mx-5 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:gap-x-6 sm:px-5"
      >
        {/* thumbnail */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-cream-100/10 sm:h-20 sm:w-20">
          <img
            src={product.image}
            alt={`${product.name} — ${product.origin}`}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
              soldOut ? "opacity-40 saturate-0" : ""
            }`}
          />
          {soldOut && (
            <span className="absolute inset-0 grid place-items-center bg-espresso-950/45">
              <span className="-rotate-12 rounded border-2 border-cream-100/70 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-cream-100">
                Sold out
              </span>
            </span>
          )}
        </div>

        {/* main */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-sm italic text-cream-600">{idx}</span>
            <h3 className="font-display text-[22px] leading-tight text-cream-50 transition-colors group-hover:text-caramel-300 sm:text-2xl">
              {product.name}
            </h3>
            {product.badge && !soldOut && (
              <span
                className="chip -rotate-2 px-2 py-[3px] text-[9px]"
                style={{ color: product.accent, borderColor: `${product.accent}55` }}
              >
                {product.badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cream-500">
            {product.origin} · {product.process}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <p className="min-w-0 flex-1 font-display text-[15px] font-light italic leading-snug text-cream-400">
              {product.notes.join(" · ")}
            </p>
            <span className="hidden min-w-8 flex-1 self-center border-b border-dotted border-cream-100/15 md:block" />
            <span className="shrink-0">
              <RoastMeter level={product.roast} />
            </span>
          </div>
        </div>

        {/* price + add */}
        <div className="col-span-2 flex items-center justify-between gap-4 border-t border-cream-100/8 pt-3.5 sm:col-span-1 sm:border-0 sm:pt-0 sm:pl-2">
          <div className="text-left sm:text-right">
            <p
              className={`font-display text-xl leading-none ${
                soldOut ? "text-cream-400" : "text-cream-50"
              }`}
            >
              {money(product.price)}
            </p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cream-500">
              / 250 g
            </p>
            {low && (
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-cherry-400">
                only {product.stock} left
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to bag`}
            disabled={soldOut}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className={`btn-press flex h-10 shrink-0 items-center gap-1.5 rounded-full border pl-3.5 pr-4 text-sm font-extrabold transition-all duration-200 ${
              soldOut
                ? "cursor-not-allowed border-cream-100/15 text-cream-500"
                : "border-caramel-500/60 text-caramel-300 hover:border-caramel-500 hover:bg-caramel-500 hover:text-espresso-950"
            }`}
          >
            {soldOut ? (
              "Sold out"
            ) : (
              <>
                <IconPlus className="h-4 w-4" strokeWidth={2.4} />
                Add
              </>
            )}
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function ShopSection({
  products,
  onOpen,
  onAdd,
}: {
  products: Product[];
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<SortKey>("featured");

  const counts = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        c,
        n: c === "All" ? products.length : products.filter((p) => p.category === c).length,
      })),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const haystack = [p.name, p.origin, p.region, p.process, p.category, p.producer, ...p.notes]
        .join(" ")
        .toLowerCase();
      const matchQ = !q || haystack.includes(q);
      const matchC = category === "All" || p.category === category;
      return matchQ && matchC;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "roast") list = [...list].sort((a, b) => a.roast - b.roast);
    return list;
  }, [products, query, category, sort]);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setSort("featured");
  };

  return (
    <section id="shelf" className="container-x scroll-mt-24 py-16 md:py-24">
      {/* heading */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The shelf</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-cream-50 md:text-5xl">
              This month&rsquo;s roast list
            </h2>
          </div>
          <p className="pb-1 text-left text-xs font-bold uppercase tracking-[0.18em] text-cream-500 sm:text-right">
            Last roast <span className="text-cream-200">{roastDay(-1)}</span>
            <span className="mx-2 text-caramel-600">/</span>
            next <span className="text-caramel-300">{roastDay(1)}</span>
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        {/* filter rail */}
        <Reveal delay={60}>
          <aside className="space-y-7 self-start lg:sticky lg:top-24">
            <div className="relative">
              <IconSearch className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-cream-500" />
              <input
                id="shelf-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, origin, note…"
                className="input-dark h-11 rounded-full pl-11 pr-10"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="btn-press absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-espresso-700 text-cream-300 hover:text-caramel-300"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div>
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.28em] text-cream-500">
                Category
              </p>
              <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
                {counts.map(({ c: cat, n }) => {
                  const active = category === cat;
                  return (
                    <li key={cat} className="lg:w-full">
                      <button
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`btn-press flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors lg:h-auto lg:w-full lg:justify-between lg:rounded-none lg:border-0 lg:border-b lg:px-1 lg:py-2.5 ${
                          active
                            ? "border-caramel-500 bg-caramel-500 text-espresso-950 lg:border-cream-100/10 lg:bg-transparent lg:text-caramel-300"
                            : "border-cream-100/15 text-cream-300 hover:border-caramel-500/50 hover:text-cream-50 lg:border-cream-100/10"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <IconBeanSolid
                            className={`hidden h-3 w-3 transition-all duration-300 lg:block ${
                              active ? "scale-100 text-caramel-500" : "scale-0 text-transparent"
                            }`}
                          />
                          {cat}
                        </span>
                        <span
                          className={`text-xs font-extrabold tabular-nums ${
                            active ? "text-espresso-800 lg:text-caramel-500" : "text-cream-500"
                          }`}
                        >
                          {n}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <label className="block">
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.28em] text-cream-500">
                Sort by
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort coffees"
                  className="input-dark h-11 w-full cursor-pointer appearance-none rounded-lg pl-4 pr-9 text-sm font-bold"
                >
                  <option value="featured" className="bg-espresso-800">
                    Featured
                  </option>
                  <option value="price-asc" className="bg-espresso-800">
                    Price · low to high
                  </option>
                  <option value="price-desc" className="bg-espresso-800">
                    Price · high to low
                  </option>
                  <option value="roast" className="bg-espresso-800">
                    Roast · light to dark
                  </option>
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500" />
              </div>
            </label>

            <div className="hidden rounded-lg border border-cream-100/10 bg-espresso-850/60 p-5 lg:block">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-caramel-400">
                <IconFlame className="h-4 w-4" />
                Roast day
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-cream-400">
                We roast Tuesdays. Your bag is stamped with the date and leaves the
                roastery within 24 hours of coming out of the drum.
              </p>
            </div>
          </aside>
        </Reveal>

        {/* ledger */}
        <div>
          <p className="text-sm text-cream-500">
            Showing <span className="font-bold text-cream-300">{filtered.length}</span> of{" "}
            {products.length} coffees
            {query.trim() && (
              <>
                {" "}
                for &ldquo;<span className="text-caramel-300">{query.trim()}</span>&rdquo;
              </>
            )}
            {(query.trim() || category !== "All" || sort !== "featured") && (
              <button
                type="button"
                onClick={reset}
                className="ml-3 font-bold text-caramel-400 underline decoration-caramel-500/40 underline-offset-4 transition-colors hover:text-caramel-300"
              >
                Reset
              </button>
            )}
          </p>

          <ul className="mt-4">
            {filtered.map((p, i) => (
              <li key={p.id} className="border-b border-cream-100/8">
                <LedgerRow product={p} index={i} onOpen={onOpen} onAdd={onAdd} />
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <IconBeanLine className="mx-auto h-14 w-14 text-espresso-600" strokeWidth={1.2} />
              <h3 className="mt-5 font-display text-3xl text-cream-100">Nothing in the hopper.</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-500">
                No coffee matches that. Loosen the filters, or wait for Tuesday —
                there&rsquo;s always something new coming out of the drum.
              </p>
              <button
                type="button"
                onClick={reset}
                className="btn-press mt-6 h-11 rounded-full bg-caramel-500 px-6 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
              >
                Show everything
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
