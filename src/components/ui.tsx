import { useEffect, useRef, useState, type ReactNode } from "react";
import { ROAST_LABELS } from "../data/products";
import { IconBeanLine, IconBeanSolid, IconMinus, IconPlus } from "./icons";

/** Scroll-reveal wrapper (IntersectionObserver, fires once) */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Animated steam wisps — position the wrapper where steam should rise */
export function Steam({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <span className="steam-wisp left-0" />
      <span className="steam-wisp left-2.5" style={{ animationDelay: "1s" }} />
      <span className="steam-wisp left-5" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}

/** Five-bean roast indicator */
export function RoastMeter({
  level,
  showLabel = false,
}: {
  level: number;
  showLabel?: boolean;
}) {
  return (
    <div className="flex items-center gap-2" title={`Roast: ${ROAST_LABELS[level]}`}>
      <span className="flex items-center gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) =>
          i <= level ? (
            <IconBeanSolid key={i} className="h-3.5 w-3.5 text-caramel-500" />
          ) : (
            <IconBeanLine key={i} strokeWidth={1.4} className="h-3.5 w-3.5 text-espresso-600" />
          )
        )}
      </span>
      {showLabel && (
        <span className="text-xs font-bold text-cream-400">{ROAST_LABELS[level]}</span>
      )}
    </div>
  );
}

/** Quantity stepper. `min` = lowest value before the minus button disables. */
export function QtyStepper({
  qty,
  onChange,
  min = 0,
  max = Infinity,
}: {
  qty: number;
  onChange: (q: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-cream-100/15 bg-espresso-800">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={qty <= min}
        onClick={() => onChange(qty - 1)}
        className="grid h-8 w-8 place-items-center rounded-full text-cream-300 transition hover:text-caramel-300 active:scale-90 disabled:pointer-events-none disabled:opacity-30"
      >
        <IconMinus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-extrabold tabular-nums">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= max}
        title={qty >= max && max !== Infinity ? "That's everything we have" : undefined}
        onClick={() => onChange(qty + 1)}
        className="grid h-8 w-8 place-items-center rounded-full text-cream-300 transition hover:text-caramel-300 active:scale-90 disabled:pointer-events-none disabled:opacity-30"
      >
        <IconPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
