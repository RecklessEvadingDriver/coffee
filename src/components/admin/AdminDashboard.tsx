import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CATEGORIES,
  LOW_STOCK_AT,
  money,
  type CategoryFilter,
  type Product,
} from "../../data/products";
import { store } from "../../lib/store";
import { RoastMeter } from "../ui";
import {
  IconAlert,
  IconBox,
  IconCheck,
  IconEdit,
  IconGear,
  IconLock,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconStore,
  IconTrash,
  IconX,
} from "../icons";
import ProductFormModal from "./ProductFormModal";

const PASSCODE = "2210";

function Gate({ onUnlock, notify }: { onUnlock: () => void; notify: (m: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim() === PASSCODE) {
      onUnlock();
      notify("Back office unlocked");
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <div className="grid min-h-[62vh] place-items-center px-5">
      <form
        onSubmit={submit}
        className="anim-rise w-full max-w-sm rounded-xl border border-cream-100/10 bg-espresso-850 p-8 text-center shadow-warm"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-caramel-500/40 bg-espresso-900 text-caramel-400">
          <IconLock className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-3xl text-cream-50">Back office</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream-400">
          Staff only. Everything you change here lands on the shelf immediately.
        </p>
        <input
          type="password"
          autoFocus
          inputMode="numeric"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="Passcode"
          aria-label="Back office passcode"
          className={`input-dark mt-6 h-12 text-center font-display text-xl tracking-[0.5em] ${
            error ? "border-cherry-500/70" : ""
          }`}
        />
        {error && (
          <p className="anim-pop mt-2 text-xs font-bold text-cherry-400">
            Wrong code — the grinder stays off.
          </p>
        )}
        <button
          type="submit"
          className="btn-press mt-5 h-11 w-full rounded-full bg-caramel-500 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
        >
          Unlock
        </button>
        <p className="mt-4 text-[11px] text-cream-500">
          Demo passcode: <span className="font-extrabold text-caramel-300">2210</span>
        </p>
      </form>
    </div>
  );
}

function StockPill({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-100/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-cream-500">
        Sold out
      </span>
    );
  if (stock <= LOW_STOCK_AT)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cherry-500/40 bg-cherry-500/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-cherry-400">
        <IconAlert className="h-3.5 w-3.5" />
        {stock} left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-500/40 bg-sage-500/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-sage-400">
      {stock} in stock
    </span>
  );
}

export default function AdminDashboard({
  products,
  unlocked,
  onUnlock,
  onBack,
  notify,
}: {
  products: Product[];
  unlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
  notify: (m: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  /* auto-clear delete confirmation */
  useEffect(() => {
    if (!confirmId) return;
    const t = window.setTimeout(() => setConfirmId(null), 4000);
    return () => window.clearTimeout(t);
  }, [confirmId]);

  const stats = useMemo(() => {
    const units = products.reduce((s, p) => s + p.stock, 0);
    const value = products.reduce((s, p) => s + p.stock * p.price, 0);
    const soldOut = products.filter((p) => p.stock <= 0).length;
    const low = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_AT);
    return { units, value, soldOut, low };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchQ =
        !q || [p.name, p.origin, p.category, p.process, p.producer].join(" ").toLowerCase().includes(q);
      const matchC = cat === "All" || p.category === cat;
      return matchQ && matchC;
    });
  }, [products, query, cat]);

  if (!unlocked) return <Gate onUnlock={onUnlock} notify={notify} />;

  const save = (data: Omit<Product, "id">, existingId?: string) => {
    if (existingId) {
      store.update(existingId, data);
      notify(`Saved changes to ${data.name}`);
    } else {
      store.add(data);
      notify(`${data.name} is now on the shelf`);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="container-x py-10 md:py-14">
      {/* heading */}
      <div className="anim-rise flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <IconGear className="h-3.5 w-3.5" />
            Back office
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-cream-50 md:text-5xl">
            The shelf ledger
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-cream-400">
            Add a new lot, adjust stock, or pull a coffee before it sells out.
            Changes are saved locally and appear on the storefront instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="btn-press flex h-11 items-center gap-2 rounded-full border border-cream-100/20 px-5 text-sm font-bold text-cream-200 transition-colors hover:border-caramel-500/60 hover:text-caramel-300"
          >
            <IconStore className="h-4 w-4" />
            View storefront
          </button>
          {confirmReset ? (
            <span className="anim-pop flex h-11 items-center gap-2 rounded-full border border-cherry-500/50 bg-cherry-500/10 px-3 text-sm font-bold text-cherry-400">
              Reset to demo lineup?
              <button
                type="button"
                onClick={() => {
                  store.reset();
                  setConfirmReset(false);
                  notify("Shelf reset to the demo lineup");
                }}
                aria-label="Confirm reset"
                className="btn-press grid h-7 w-7 place-items-center rounded-full bg-cherry-500 text-cream-50"
              >
                <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                aria-label="Cancel reset"
                className="btn-press grid h-7 w-7 place-items-center rounded-full border border-cream-100/25 text-cream-300"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn-press flex h-11 items-center gap-2 rounded-full border border-cream-100/20 px-5 text-sm font-bold text-cream-400 transition-colors hover:border-cherry-500/60 hover:text-cherry-400"
            >
              <IconRefresh className="h-4 w-4" />
              Reset data
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="btn-press flex h-11 items-center gap-2 rounded-full bg-caramel-500 px-5 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
          >
            <IconPlus className="h-4 w-4" strokeWidth={2.4} />
            Add coffee
          </button>
        </div>
      </div>

      {/* ledger stats */}
      <div className="anim-rise mt-9 grid grid-cols-2 divide-cream-100/10 overflow-hidden rounded-xl border border-cream-100/10 bg-espresso-900/70 md:grid-cols-4 md:divide-x" style={{ animationDelay: "80ms" }}>
        {[
          { label: "Coffees on the shelf", value: String(products.length) },
          { label: "Bags in the stockroom", value: stats.units.toLocaleString() },
          { label: "Stockroom retail value", value: money(stats.value) },
          {
            label: "Sold out",
            value: String(stats.soldOut),
            warn: stats.soldOut > 0,
          },
        ].map((s) => (
          <div key={s.label} className="border-cream-100/10 p-5 max-md:[&:nth-child(-n+2)]:border-b max-md:[&:nth-child(odd)]:border-r">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500">
              {s.label}
            </p>
            <p className={`mt-2 font-display text-[22px] tabular-nums sm:text-3xl md:text-4xl ${s.warn ? "text-cherry-400" : "text-cream-50"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* low stock callout */}
      {stats.low.length > 0 && (
        <div className="anim-rise mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-cherry-500/30 bg-cherry-500/8 px-4 py-3 text-sm" style={{ animationDelay: "140ms" }}>
          <IconAlert className="h-4 w-4 shrink-0 text-cherry-400" />
          <span className="font-extrabold text-cherry-400">
            {stats.low.length === 1 ? "One coffee is" : `${stats.low.length} coffees are`} running low:
          </span>
          <span className="text-cream-300">
            {stats.low.map((p) => `${p.name} (${p.stock})`).join(" · ")}
          </span>
        </div>
      )}

      {/* controls */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <IconSearch className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-cream-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the ledger…"
            className="input-dark h-11 rounded-full pl-11 pr-4"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`btn-press flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-bold transition-colors ${
                  active
                    ? "border-caramel-500 bg-caramel-500 text-espresso-950"
                    : "border-cream-100/15 text-cream-300 hover:border-caramel-500/50 hover:text-cream-50"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* table */}
      <div className="mt-5 overflow-hidden rounded-xl border border-cream-100/10 bg-espresso-900/50">
        <div className="hidden items-center gap-4 border-b border-cream-100/10 bg-espresso-900/80 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500 lg:flex">
          <span className="flex-1">Coffee</span>
          <span className="w-24">Category</span>
          <span className="w-20 text-right">Price</span>
          <span className="w-28">Roast</span>
          <span className="w-32">Stock</span>
          <span className="w-40 text-right">Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <IconBox className="mx-auto h-12 w-12 text-espresso-600" strokeWidth={1.3} />
            <h3 className="mt-4 font-display text-2xl text-cream-100">
              {products.length === 0 ? "The shelf is bare." : "Nothing matches that search."}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-cream-500">
              {products.length === 0
                ? "Add your first coffee, or reset to the demo lineup."
                : "Try a different term or clear the category filter."}
            </p>
          </div>
        )}

        {filtered.map((p, i) => (
          <div
            key={p.id}
            className="anim-rise flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-cream-100/6 px-5 py-4 transition-colors last:border-0 hover:bg-espresso-850/70 lg:flex-nowrap"
            style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <img
                src={p.image}
                alt=""
                className={`h-16 w-12 shrink-0 rounded-md border border-cream-100/10 object-cover ${
                  p.stock <= 0 ? "opacity-40 saturate-0" : ""
                }`}
              />
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-lg leading-tight text-cream-50">
                  <span className="truncate">{p.name}</span>
                  {p.badge && (
                    <span
                      className="hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider sm:inline"
                      style={{ color: p.accent, borderColor: `${p.accent}55` }}
                    >
                      {p.badge}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-cream-500">
                  {p.origin} · {p.process} · {p.producer}
                </p>
              </div>
            </div>

            <span
              className="w-24 shrink-0 text-xs font-extrabold uppercase tracking-wider lg:text-[11px]"
              style={{ color: p.accent }}
            >
              {p.category}
            </span>

            <span className="w-20 shrink-0 text-right font-display text-lg tabular-nums text-cream-100">
              {money(p.price)}
            </span>

            <span className="hidden w-28 shrink-0 lg:block">
              <RoastMeter level={p.roast} />
            </span>

            <span className="w-32 shrink-0">
              <StockPill stock={p.stock} />
            </span>

            <span className="flex w-full shrink-0 items-center justify-end gap-2 lg:w-40">
              {confirmId === p.id ? (
                <span className="anim-pop flex items-center gap-2">
                  <span className="text-xs font-bold text-cherry-400">Pull it?</span>
                  <button
                    type="button"
                    aria-label={`Confirm removing ${p.name}`}
                    onClick={() => {
                      store.remove(p.id);
                      setConfirmId(null);
                      notify(`${p.name} pulled from the shelf`);
                    }}
                    className="btn-press grid h-8 w-8 place-items-center rounded-full bg-cherry-500 text-cream-50"
                  >
                    <IconCheck className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel removal"
                    onClick={() => setConfirmId(null)}
                    className="btn-press grid h-8 w-8 place-items-center rounded-full border border-cream-100/25 text-cream-300"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(p);
                      setFormOpen(true);
                    }}
                    className="btn-press flex h-8 items-center gap-1.5 rounded-full border border-cream-100/20 px-3.5 text-xs font-extrabold text-cream-200 transition-colors hover:border-caramel-500/60 hover:text-caramel-300"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => setConfirmId(p.id)}
                    className="btn-press grid h-8 w-8 place-items-center rounded-full border border-cream-100/20 text-cream-400 transition-colors hover:border-cherry-500/60 hover:text-cherry-400"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-cream-600">
        {filtered.length} of {products.length} coffees shown · data persists in this
        browser only.
      </p>

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save}
      />
    </div>
  );
}
