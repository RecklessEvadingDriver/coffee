import { useEffect, useMemo, useState } from "react";
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_AT,
  PRODUCTS,
  WEIGHTS,
  unitPrice,
  type Product,
} from "./data/products";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ShopSection from "./components/ShopSection";
import ProductModal from "./components/ProductModal";
import CartDrawer, { type CartLineView } from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { IconBeanSolid, IconCheck, IconCup } from "./components/icons";
import { Steam } from "./components/ui";

interface CartLine {
  key: string;
  productId: string;
  weightIdx: number;
  qty: number;
}

interface Toast {
  id: number;
  msg: string;
}

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

export default function App() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  /* toast auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* body scroll lock while any overlay is open */
  useEffect(() => {
    const locked = drawerOpen || active !== null || checkoutOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, active, checkoutOpen]);

  const lines: CartLineView[] = useMemo(
    () =>
      cart
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.productId);
          if (!product) return null;
          const unit = unitPrice(product, l.weightIdx);
          return { ...l, product, unit, total: Math.round(unit * l.qty * 100) / 100 };
        })
        .filter((l): l is CartLineView => l !== null),
    [cart]
  );

  const subtotal = useMemo(
    () => Math.round(lines.reduce((s, l) => s + l.total, 0) * 100) / 100,
    [lines]
  );
  const shipping = lines.length === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING;
  const total = Math.round((subtotal + shipping) * 100) / 100;
  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  /* ---------- actions ---------- */
  const addToCart = (p: Product, weightIdx = 0, qty = 1) => {
    const key = `${p.id}:${weightIdx}`;
    setCart((c) => {
      const existing = c.find((l) => l.key === key);
      return existing
        ? c.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...c, { key, productId: p.id, weightIdx, qty }];
    });
    setToast({ id: Date.now(), msg: `${p.name} · ${WEIGHTS[weightIdx].label} added to your bag` });
  };

  const setQty = (key: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.key !== key) : c.map((l) => (l.key === key ? { ...l, qty } : l))));
  };

  const removeLine = (key: string) => setCart((c) => c.filter((l) => l.key !== key));

  const browseShelf = () => {
    setDrawerOpen(false);
    setActive(null);
    document.getElementById("shelf")?.scrollIntoView({ behavior: "smooth" });
  };

  const focusSearch = () => {
    document.getElementById("shelf")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      (document.getElementById("shelf-search") as HTMLInputElement | null)?.focus({
        preventScroll: true,
      });
    }, 450);
  };

  const finishCheckout = () => {
    setCart([]);
    setCheckoutOpen(false);
    setToast({ id: Date.now(), msg: "Order placed — the drum is already spinning" });
  };

  return (
    <div id="top" className="relative min-h-screen">
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="glow-drift absolute -top-40 right-[-12%] h-[520px] w-[520px] rounded-full bg-caramel-600/10 blur-[130px]" />
        <div className="absolute bottom-[-22%] left-[-12%] h-[560px] w-[560px] rounded-full bg-cherry-500/8 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Header
          cartCount={cartCount}
          onCartOpen={() => setDrawerOpen(true)}
          onSearchClick={focusSearch}
        />

        <main>
          <Hero
            featured={PRODUCTS[0]}
            onQuickAdd={(p) => addToCart(p)}
            onOpen={(p) => setActive(p)}
          />
          <ShopSection onOpen={(p) => setActive(p)} onAdd={(p) => addToCart(p)} />
        </main>

        {/* footer */}
        <footer id="visit" className="mt-8 scroll-mt-24 border-t border-cream-100/8 bg-espresso-900/50">
          <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1.3fr] md:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-caramel-500/40 bg-espresso-850 text-caramel-400">
                  <IconCup className="h-5 w-5" />
                </span>
                <span className="leading-none">
                  <span className="font-display text-xl font-semibold tracking-[0.08em] text-cream-50">
                    CINDER
                  </span>
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.42em] text-cream-500">
                    Coffee Roasters
                  </span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-400">
                A two-drum roastery in the Slabtown district, buying directly from
                nineteen farming families and roasting everything to order since 2017.
              </p>
            </div>

            <div>
              <h4 className="eyebrow">The roastery</h4>
              <address className="mt-4 text-sm not-italic leading-relaxed text-cream-300">
                2140 NW Quimby St
                <br />
                Portland, OR 97210
              </address>
              <ul className="mt-4 space-y-1.5 text-sm text-cream-400">
                <li className="flex justify-between gap-4">
                  <span>Mon – Fri</span>
                  <span className="font-bold text-cream-200">7 am – 4 pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sat – Sun</span>
                  <span className="font-bold text-cream-200">8 am – 3 pm</span>
                </li>
              </ul>
              <p className="mt-4 text-xs font-bold text-caramel-400">
                Public cupping every Saturday, 10 am.
              </p>
            </div>

            <div>
              <h4 className="eyebrow">First Crack Club</h4>
              <p className="mt-4 text-sm leading-relaxed text-cream-400">
                One email when the shelf restocks, plus the brew recipe we&rsquo;re
                obsessed with that month. No drip campaigns — just drip coffee.
              </p>
              {subscribed ? (
                <p className="anim-pop mt-4 flex items-center gap-2 text-sm font-extrabold text-caramel-300">
                  <IconCheck className="h-4 w-4" strokeWidth={2.4} />
                  You&rsquo;re on the list — see you at first crack.
                </p>
              ) : (
                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="input-dark h-11 min-w-0 flex-1 rounded-full"
                  />
                  <button
                    type="submit"
                    className="btn-press h-11 shrink-0 rounded-full bg-caramel-500 px-5 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="border-t border-cream-100/8">
            <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream-500 sm:flex-row">
              <p>© 2026 Cinder Coffee Roasters — Portland, OR</p>
              <p className="flex items-center gap-1.5">
                Demo storefront, brewed with
                <IconBeanSolid className="h-3 w-3 text-caramel-600" />
                and React
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] opacity-[0.05]"
        style={{ backgroundImage: NOISE }}
      />

      {/* overlays */}
      <ProductModal
        product={active}
        onClose={() => setActive(null)}
        onAdd={(p, w, q) => {
          addToCart(p, w, q);
          setActive(null);
        }}
      />

      <CartDrawer
        open={drawerOpen}
        lines={lines}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onClose={() => setDrawerOpen(false)}
        onSetQty={setQty}
        onRemove={removeLine}
        onCheckout={() => {
          setDrawerOpen(false);
          setCheckoutOpen(true);
        }}
        onBrowse={browseShelf}
      />

      <CheckoutModal
        open={checkoutOpen}
        lines={lines}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onClose={() => setCheckoutOpen(false)}
        onDone={finishCheckout}
      />

      {/* toast */}
      {toast && (
        <div
          key={toast.id}
          className="anim-rise fixed bottom-5 left-1/2 z-[80] flex w-max max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-full border border-caramel-500/40 bg-espresso-800/95 py-2.5 pl-3 pr-4 shadow-warm backdrop-blur"
          role="status"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-caramel-500 text-espresso-950">
            <IconCheck className="h-4 w-4" strokeWidth={2.6} />
          </span>
          <p className="min-w-0 truncate text-sm font-bold text-cream-100">{toast.msg}</p>
          <button
            type="button"
            onClick={() => {
              setToast(null);
              setDrawerOpen(true);
            }}
            className="shrink-0 text-sm font-extrabold text-caramel-300 underline decoration-caramel-500/40 underline-offset-4 transition-colors hover:text-caramel-400"
          >
            View bag
          </button>
        </div>
      )}
    </div>
  );
}
