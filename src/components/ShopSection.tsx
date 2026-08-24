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
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconX,
} from "./icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "roast";

function ProductCard({
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

  return (
    <Reveal delay={index * 80}>
      <article
        onClick={() => onOpen(product)}
        className="group cursor-pointer overflow-hidden rounded-xl border border-cream-100/8 bg-espresso-850 transition-all duration-300 hover:-translate-y-1.5 hover:border-caramel-500/40 hover:shadow-warm"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={`${product.name} — ${product.origin}`}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] ${
              soldOut ? "opacity-45 saturate-0" : ""
            }`}
          />
          <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso-950/70 to-transparent" />
          {soldOut ? (
            <span className="chip absolute left-3 top-3 border-cream-100/25 bg-espresso-950/85 text-cream-300 backdrop-blur-sm">
              Sold out
            </span>
          ) : (
            product.badge && (
              <span className="chip absolute left-3 top-3 border-caramel-500/40 bg-espresso-950/80 text-caramel-300 backdrop-blur-sm">
                {product.badge}
              </span>
            )
          )}
          {low && (
            <span className="chip absolute right-3 top-3 border-cherry-500/50 bg-espresso-950/85 text-cherry-400 backdrop-blur-sm">
              Only {product.stock} left
            </span>
          )}
          {!soldOut && (
            <span className="absolute inset-0 hidden items-center justify-center bg-espresso-950/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
              <span className="translate-y-2 rounded-full bg-cream-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-espresso-950 transition-transform duration-300 group-hover:translate-y-0">
                Quick view
              </span>
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span
              className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
              style={{ color: product.accent }}
            >
              {product.category}
            </span>
            <RoastMeter level={product.roast} />
          </div>
          <h3 className="mt-2.5 font-display text-[22px] leading-snug text-cream-50 transition-colors group-hover:text-caramel-300">
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm text-cream-500">
            {product.origin} · {product.process}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.notes.map((n) => (
              <span
                key={n}
                className="rounded-full border border-cream-100/12 px-2.5 py-0.5 text-[11px] font-semibold text-cream-300"
              >
                {n}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-cream-100/8 pt-4">
            <p>
              <span className={`font-display text-xl ${soldOut ? "text-cream-400" : "text-cream-50"}`}>
                {money(product.price)}
              </span>
              <span className="ml-1 text-xs text-cream-500">/ 250 g</span>
            </p>
            <button
              type="button"
              aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to bag`}
              disabled={soldOut}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
              className={`btn-press flex h-9 items-center gap-1.5 rounded-full pl-3 pr-3.5 text-sm font-extrabold transition-colors ${
                soldOut
                  ? "cursor-not-allowed border border-cream-100/15 text-cream-500"
                  : "bg-caramel-500 text-espresso-950 hover:bg-caramel-400"
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
      {/* heading + sort */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The shelf</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-cream-50 md:text-5xl">
              This month&rsquo;s roast list
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-cream-400">
              When a coffee sells through, it&rsquo;s gone until next season. Every bag
              is stamped with its roast date and leaves the drum within 24 hours.
            </p>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort coffees"
              className="input-dark h-11 w-52 cursor-pointer appearance-none rounded-full pl-4 pr-9 text-sm font-bold"
            >
              <option value="featured">Sort · Featured</option>
              <option value="price-asc">Price · Low to high</option>
              <option value="price-desc">Price · High to low</option>
              <option value="roast">Roast · Light to dark</option>
            </select>
            <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500" />
          </div>
        </div>
      </Reveal>

      {/* search + categories */}
      <Reveal delay={80}>
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <IconSearch className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-cream-500" />
            <input
              id="shelf-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, origin or tasting note…"
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
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {counts.map(({ c, n }) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`btn-press flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
                  active
                    ? "border-caramel-500 bg-caramel-500 text-espresso-950"
                    : "border-cream-100/15 text-cream-300 hover:border-caramel-500/50 hover:text-cream-50"
                }`}
              >
                {c}
                <span className={`text-xs font-extrabold ${active ? "text-espresso-800" : "text-cream-500"}`}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* results meta */}
      <p className="mt-7 text-sm text-cream-500">
        Showing <span className="font-bold text-cream-300">{filtered.length}</span> of{" "}
        {products.length} coffees
        {query.trim() && (
          <>
            {" "}for &ldquo;<span className="text-caramel-300">{query.trim()}</span>&rdquo;
          </>
        )}
        {(query.trim() || category !== "All" || sort !== "featured") && (
          <button
            type="button"
            onClick={reset}
            className="ml-3 font-bold text-caramel-400 underline decoration-caramel-500/40 underline-offset-4 transition-colors hover:text-caramel-300"
          >
            Reset filters
          </button>
        )}
      </p>

      {/* grid */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onOpen={onOpen} onAdd={onAdd} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <IconBeanLine className="mx-auto h-14 w-14 text-espresso-600" strokeWidth={1.2} />
            <h3 className="mt-5 font-display text-3xl text-cream-100">Nothing in the hopper.</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-500">
              {products.length === 0
                ? "The shelf is empty right now — check back after the next roast day."
                : "No coffees match that search. Loosen the filters and try again."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="btn-press mt-6 h-11 rounded-full border border-caramel-500/50 px-6 text-sm font-extrabold text-caramel-300 transition-colors hover:bg-caramel-500/10"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
