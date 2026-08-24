import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { WEIGHTS, money } from "../data/products";
import type { CartLineView } from "./CartDrawer";
import { IconCard, IconCheck, IconX } from "./icons";

const STEPS = ["Contacting the roastery", "Reserving your lot", "Stamping the bag"];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-cream-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function CheckoutModal({
  open,
  lines,
  subtotal,
  shipping,
  total,
  onClose,
  onDone,
}: {
  open: boolean;
  lines: CartLineView[];
  subtotal: number;
  shipping: number;
  total: number;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [stage, setStage] = useState(0);
  const [orderNo, setOrderNo] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    card: "",
    exp: "",
    cvc: "",
  });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (open) {
      setStep("form");
      setStage(0);
      setError("");
    }
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, onClose]);

  if (!open) return null;

  const set =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const pay = (e: FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) {
      setError("Please fill in every field — we can't ship to a blank label.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError("That email doesn't look deliverable — double-check it.");
      return;
    }
    if (form.card.replace(/\D/g, "").length < 12) {
      setError("That card number looks a little short for a real card.");
      return;
    }
    setError("");
    setStep("processing");
    setStage(0);
    timers.current.push(window.setTimeout(() => setStage(1), 950));
    timers.current.push(window.setTimeout(() => setStage(2), 1900));
    timers.current.push(
      window.setTimeout(() => {
        setOrderNo(`CNR-${Math.floor(1000 + Math.random() * 9000)}`);
        setStep("done");
      }, 2950)
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        className="anim-fade fixed inset-0 bg-espresso-950/85 backdrop-blur-sm"
        onClick={() => step !== "processing" && onClose()}
      />
      <div className="anim-rise relative mx-auto my-8 w-[min(560px,94vw)] overflow-hidden rounded-xl border border-cream-100/10 bg-espresso-900 shadow-warm md:my-14">
        <div className="flex items-center justify-between border-b border-cream-100/10 px-6 py-4">
          <h2 className="font-display text-2xl text-cream-50">
            {step === "done" ? "Order confirmed" : "Checkout"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className={`btn-press grid h-9 w-9 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-cherry-500/60 hover:text-cherry-400 ${
              step === "processing" ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={pay} className="space-y-5 px-6 py-5" noValidate>
            {/* order summary */}
            <div className="rounded-lg border border-cream-100/10 bg-espresso-850 p-4">
              <div className="space-y-1.5">
                {lines.map((l) => (
                  <div key={l.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-cream-300">
                      <span className="font-extrabold text-cream-100">{l.qty} ×</span>{" "}
                      {l.product.name}
                      <span className="text-cream-500"> ({WEIGHTS[l.weightIdx].label})</span>
                    </span>
                    <span className="tabular-nums text-cream-300">{money(l.total)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-cream-100/10 pt-2.5 text-sm">
                <span className="font-extrabold text-cream-100">Total with shipping</span>
                <span className="font-display text-lg text-caramel-300">{money(total)}</span>
              </div>
            </div>

            <Field label="Email">
              <input
                type="email"
                className="input-dark"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
            </Field>

            <Field label="Full name">
              <input
                type="text"
                className="input-dark"
                placeholder="Sam Roe"
                value={form.name}
                onChange={set("name")}
              />
            </Field>

            <Field label="Street address">
              <input
                type="text"
                className="input-dark"
                placeholder="2140 NW Quimby St"
                value={form.address}
                onChange={set("address")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Portland"
                  value={form.city}
                  onChange={set("city")}
                />
              </Field>
              <Field label="ZIP">
                <input
                  type="text"
                  className="input-dark"
                  placeholder="97210"
                  value={form.zip}
                  onChange={set("zip")}
                />
              </Field>
            </div>

            <div className="border-t border-cream-100/10 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cream-500">
                <IconCard className="h-4 w-4 text-caramel-500" />
                Payment · simulated
              </p>
              <div className="space-y-3">
                <Field label="Card number">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input-dark tabular-nums"
                    placeholder="4242 4242 4242 4242"
                    value={form.card}
                    onChange={set("card")}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry">
                    <input
                      type="text"
                      className="input-dark tabular-nums"
                      placeholder="MM/YY"
                      value={form.exp}
                      onChange={set("exp")}
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="input-dark tabular-nums"
                      placeholder="123"
                      value={form.cvc}
                      onChange={set("cvc")}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {error && <p className="text-xs font-bold text-cherry-400">{error}</p>}

            <button
              type="submit"
              className="btn-press flex h-12 w-full items-center justify-center rounded-full bg-caramel-500 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
            >
              Pay {money(total)} — simulated
            </button>
            <p className="text-center text-[11px] leading-relaxed text-cream-600">
              This is a demo storefront. Nothing is charged and nothing ships —
              except our enthusiasm.
            </p>
          </form>
        )}

        {step === "processing" && (
          <div className="px-6 py-10">
            <ul className="space-y-4">
              {STEPS.map((s, i) => {
                const done = stage > i;
                const active = stage === i;
                return (
                  <li key={s} className="flex items-center gap-3">
                    {done ? (
                      <span className="anim-pop grid h-6 w-6 place-items-center rounded-full bg-caramel-500 text-espresso-950">
                        <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </span>
                    ) : active ? (
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-espresso-600 border-t-caramel-500" />
                    ) : (
                      <span className="h-6 w-6 rounded-full border border-cream-100/15" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        done ? "text-cream-300" : active ? "text-cream-50" : "text-cream-500"
                      }`}
                    >
                      {s}
                      {active ? "…" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-7 h-2 overflow-hidden rounded-full bg-espresso-800">
              <div className="barber-bar h-full w-full opacity-70" />
            </div>
            <p className="mt-3 text-center text-xs text-cream-500">
              Simulated payment — hang tight.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="px-6 py-9 text-center">
            <span className="anim-stamp inline-block rounded-lg border-[3px] border-caramel-500 px-5 py-2 font-display text-2xl font-bold uppercase tracking-[0.22em] text-caramel-400">
              Confirmed
            </span>
            <h3 className="mt-5 font-display text-3xl text-cream-50">
              Thanks — order {orderNo}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-400">
              A confirmation is on its way to{" "}
              <span className="font-bold text-cream-200">{form.email}</span>. We&rsquo;ll
              roast within 24 hours and ship the same day it cools.
            </p>
            <div className="mt-6 rounded-lg border border-cream-100/10 bg-espresso-850 p-4 text-left">
              {lines.map((l) => (
                <div key={l.key} className="flex justify-between gap-3 py-1 text-sm">
                  <span className="text-cream-300">
                    {l.qty} × {l.product.name}
                    <span className="text-cream-500"> ({WEIGHTS[l.weightIdx].label})</span>
                  </span>
                  <span className="tabular-nums text-cream-300">{money(l.total)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-cream-100/10 pt-2 text-sm text-cream-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : money(shipping)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm font-extrabold text-cream-100">
                <span>Paid</span>
                <span className="font-display text-lg text-caramel-300">{money(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onDone}
              className="btn-press mt-6 flex h-12 w-full items-center justify-center rounded-full bg-caramel-500 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
            >
              Back to the roastery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
