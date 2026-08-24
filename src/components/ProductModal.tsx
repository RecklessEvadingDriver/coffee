import { useEffect, useState } from "react";
import {
  ROAST_LABELS,
  WEIGHTS,
  money,
  unitPrice,
  type Product,
} from "../data/products";
import { QtyStepper, RoastMeter } from "./ui";
import { IconBag, IconBeanSolid, IconMapPin, IconX } from "./icons";

function ModalInner({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (p: Product, weightIdx: number, qty: number) => void;
}) {
  const [weightIdx, setWeightIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const unit = unitPrice(product, weightIdx);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={`${product.name} details`}>
      <div className="anim-fade fixed inset-0 bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-rise relative mx-auto my-6 w-[min(940px,93vw)] overflow-hidden rounded-xl border border-cream-100/10 bg-espresso-850 shadow-warm md:my-12">
        <div className="grid md:grid-cols-2">
          {/* image */}
          <div className="relative min-h-64 md:min-h-full">
            <img
              src={product.image}
              alt={`${product.name} coffee bag`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-espresso-950/70 to-transparent" />
            <span className="chip absolute bottom-4 left-4 border-cream-100/20 bg-espresso-950/80 text-cream-200 backdrop-blur-sm">
              Roast · {ROAST_LABELS[product.roast]}
            </span>
          </div>

          {/* details */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <span
                className="chip border-current/40"
                style={{ color: product.accent, borderColor: `${product.accent}66` }}
              >
                {product.category}
                {product.badge ? ` · ${product.badge}` : ""}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="btn-press -mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-cherry-500/60 hover:text-cherry-400"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 md:text-4xl">
              {product.name}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-cream-400">
              <IconMapPin className="h-4 w-4 text-caramel-500" />
              {product.region}, {product.origin}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-cream-300">
              {product.description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                ["Producer", product.producer],
                ["Altitude", product.altitude],
                ["Varietal", product.varietal],
                ["Process", product.process],
              ].map(([t, v]) => (
                <div key={t}>
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500">
                    {t}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-cream-100">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5">
              <RoastMeter level={product.roast} showLabel />
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500">
                In the cup
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.notes.map((n) => (
                  <span
                    key={n}
                    className="flex items-center gap-1.5 rounded-full border border-cream-100/12 px-3 py-1 text-xs font-bold text-cream-200"
                  >
                    <IconBeanSolid className="h-3 w-3" style={{ color: product.accent }} />
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* brew guide */}
            <div className="mt-6 border-t border-cream-100/10 pt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500">
                Brew guide
              </p>
              <div className="mt-2">
                {product.brewGuide.map((r) => (
                  <div
                    key={r.method}
                    className="flex items-center justify-between gap-3 border-b border-cream-100/6 py-2 text-sm last:border-0"
                  >
                    <span className="w-24 font-bold text-cream-100">{r.method}</span>
                    <span className="flex-1 text-xs text-cream-400">{r.ratio}</span>
                    <span className="hidden text-xs text-cream-500 sm:block">{r.temp}</span>
                    <span className="w-12 text-right text-xs font-bold text-cream-300">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* purchase */}
            <div className="mt-6 rounded-xl border border-cream-100/10 bg-espresso-900/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream-500">
                  Bag size
                </p>
                {product.stock > 0 ? (
                  <p className="text-[11px] font-bold text-sage-400">
                    {product.stock} {product.stock === 1 ? "bag" : "bags"} at the roastery
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-cherry-400">
                    Sold out — back after the next roast day
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WEIGHTS.map((w, i) => {
                  const active = weightIdx === i;
                  return (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setWeightIdx(i)}
                      className={`rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                        active
                          ? "border-caramel-500 bg-caramel-500/10"
                          : "border-cream-100/12 hover:border-cream-100/30"
                      }`}
                    >
                      <span className={`block text-sm font-extrabold ${active ? "text-caramel-300" : "text-cream-100"}`}>
                        {w.label}
                      </span>
                      <span className="text-xs text-cream-400">
                        {money(unitPrice(product, i))} / bag
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {product.stock > 0 && (
                  <QtyStepper
                    qty={Math.min(qty, product.stock)}
                    onChange={(q) => setQty(Math.min(Math.max(1, q), product.stock))}
                    min={1}
                    max={product.stock}
                  />
                )}
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => onAdd(product, weightIdx, Math.min(qty, product.stock))}
                  className={`btn-press flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-extrabold transition-colors ${
                    product.stock <= 0
                      ? "cursor-not-allowed border border-cream-100/15 text-cream-500"
                      : "bg-caramel-500 text-espresso-950 hover:bg-caramel-400"
                  }`}
                >
                  {product.stock <= 0 ? (
                    "Sold out"
                  ) : (
                    <>
                      <IconBag className="h-4 w-4" strokeWidth={2} />
                      Add {qty > 1 ? `${Math.min(qty, product.stock)} × ` : ""}
                      {WEIGHTS[weightIdx].label} — {money(unit * Math.min(qty, product.stock))}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (p: Product, weightIdx: number, qty: number) => void;
}) {
  if (!product) return null;
  return <ModalInner key={product.id} product={product} onClose={onClose} onAdd={onAdd} />;
}
