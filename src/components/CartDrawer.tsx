import {
  FLAT_SHIPPING,
  FREE_SHIPPING_AT,
  WEIGHTS,
  money,
  type Product,
} from "../data/products";
import { QtyStepper } from "./ui";
import { IconArrowRight, IconCup, IconTrash, IconTruck, IconX } from "./icons";

export interface CartLineView {
  key: string;
  productId: string;
  product: Product;
  weightIdx: number;
  qty: number;
  unit: number;
  total: number;
  available: boolean;
}

export default function CartDrawer({
  open,
  lines,
  subtotal,
  shipping,
  total,
  onClose,
  onSetQty,
  onRemove,
  onCheckout,
  onBrowse,
}: {
  open: boolean;
  lines: CartLineView[];
  subtotal: number;
  shipping: number;
  total: number;
  onClose: () => void;
  onSetQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
  onBrowse: () => void;
}) {
  const count = lines.filter((l) => l.available).reduce((n, l) => n + l.qty, 0);
  const remaining = FREE_SHIPPING_AT - subtotal;
  const progress = Math.min(1, subtotal / FREE_SHIPPING_AT);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        open
          ? ""
          : "pointer-events-none invisible delay-500 transition-[visibility] duration-0"
      }`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-espresso-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-cream-100/10 bg-espresso-900 shadow-warm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cream-100/10 px-5 py-4">
          <h2 className="font-display text-2xl text-cream-50">
            Your bag{" "}
            <span className="text-base text-cream-500">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="btn-press grid h-9 w-9 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-cherry-500/60 hover:text-cherry-400"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* free shipping meter */}
        {lines.length > 0 && (
          <div className="border-b border-cream-100/10 px-5 py-4">
            {remaining > 0 ? (
              <p className="text-xs font-semibold text-cream-400">
                Add <span className="font-extrabold text-caramel-300">{money(remaining)}</span>{" "}
                more to unlock free shipping
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-extrabold text-caramel-300">
                <IconTruck className="h-4 w-4" />
                Free shipping unlocked
              </p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-espresso-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-caramel-600 to-caramel-400 transition-all duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* lines */}
        {lines.length > 0 ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {lines.map((l) => (
              <div key={l.key} className="flex gap-3.5">
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  className={`h-21 w-16 shrink-0 rounded-lg border border-cream-100/10 object-cover ${
                    l.available ? "" : "opacity-40 saturate-0"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg leading-tight text-cream-50">
                        {l.product.name}
                      </h3>
                      {l.available ? (
                        <p className="mt-0.5 text-xs text-cream-500">
                          {WEIGHTS[l.weightIdx].label} · {money(l.unit)} each
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs font-bold text-cherry-400">
                          Sold out — back after the next roast day
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${l.product.name}`}
                      onClick={() => onRemove(l.key)}
                      className="btn-press mt-0.5 text-cream-500 transition-colors hover:text-cherry-400"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                  {l.available ? (
                    <div className="mt-2.5 flex items-center justify-between">
                      <QtyStepper
                        qty={l.qty}
                        min={1}
                        max={l.product.stock}
                        onChange={(q) => onSetQty(l.key, q)}
                      />
                      <span className="text-sm font-extrabold tabular-nums text-cream-100">
                        {money(l.total)}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-cream-500">
                        Not counted at checkout
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(l.key)}
                        className="text-xs font-extrabold text-cherry-400 underline decoration-cherry-500/40 underline-offset-4 transition-colors hover:text-cherry-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <IconCup className="mx-auto h-12 w-12 text-espresso-600" strokeWidth={1.3} />
              <h3 className="mt-4 font-display text-2xl text-cream-100">Your bag is empty</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-500">
                Six coffees are waiting on the shelf, roasted to order and ready to ship.
              </p>
              <button
                type="button"
                onClick={onBrowse}
                className="btn-press mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-caramel-500 px-6 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
              >
                Browse the shelf
                <IconArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        )}

        {/* footer */}
        {lines.length > 0 && (
          <div className="space-y-2 border-t border-cream-100/10 bg-espresso-900 p-5">
            <div className="flex justify-between text-sm text-cream-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-cream-400">
              <span>Shipping</span>
              <span className={shipping === 0 ? "font-extrabold text-caramel-300" : "tabular-nums"}>
                {shipping === 0 ? "Free" : money(shipping)}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-cream-100/10 pt-3">
              <span className="text-sm font-extrabold text-cream-100">Total</span>
              <span className="font-display text-2xl text-cream-50">{money(total)}</span>
            </div>
            {subtotal <= 0 && (
              <p className="pt-1 text-center text-xs font-bold text-cherry-400">
                Everything in your bag is sold out — remove those lines to continue.
              </p>
            )}
            <button
              type="button"
              onClick={onCheckout}
              disabled={subtotal <= 0}
              className={`btn-press mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-extrabold transition-colors ${
                subtotal <= 0
                  ? "cursor-not-allowed border border-cream-100/15 text-cream-500"
                  : "bg-caramel-500 text-espresso-950 hover:bg-caramel-400"
              }`}
            >
              Checkout — {money(total)}
              <IconArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <p className="pt-1 text-center text-[11px] text-cream-600">
              Demo checkout — no real payment is processed.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
