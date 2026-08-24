import { useSyncExternalStore } from "react";
import {
  CATEGORY_NAMES,
  DEFAULT_BREW,
  PRODUCTS,
  type BrewRow,
  type CategoryName,
  type Product,
} from "../data/products";

const KEY = "cinder:products:v2";

/** Coerce anything previously persisted into a safe, complete Product. */
function sanitize(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.name !== "string" || typeof o.image !== "string") {
    return null;
  }
  const num = (v: unknown, fallback: number) =>
    Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : fallback;
  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
  const roastNum = num(o.roast, 3);
  const roast = ([1, 2, 3, 4, 5].includes(roastNum) ? roastNum : 3) as 1 | 2 | 3 | 4 | 5;
  const notes = Array.isArray(o.notes)
    ? o.notes.filter((n): n is string => typeof n === "string").slice(0, 8)
    : [];
  const brewGuide = Array.isArray(o.brewGuide) ? (o.brewGuide as BrewRow[]) : DEFAULT_BREW;
  const category = CATEGORY_NAMES.includes(o.category as CategoryName)
    ? (o.category as CategoryName)
    : "Single Origin";

  return {
    id: o.id,
    name: o.name,
    origin: str(o.origin, "—"),
    region: str(o.region, "—"),
    category,
    process: str(o.process, "Washed"),
    varietal: str(o.varietal, "—"),
    altitude: str(o.altitude, "—"),
    producer: str(o.producer, "—"),
    roast,
    notes,
    description: str(o.description, ""),
    price: Math.round(num(o.price, 0) * 100) / 100,
    stock: Math.round(num(o.stock, 0)),
    image: o.image,
    accent: str(o.accent, "#df9c4b"),
    badge: typeof o.badge === "string" && o.badge.trim() ? o.badge : undefined,
    brewGuide,
  };
}

function parse(raw: string | null): Product[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(sanitize).filter((p): p is Product => p !== null);
  } catch {
    return null;
  }
}

let products: Product[] = parse(localStorage.getItem(KEY)) ?? PRODUCTS;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(products));
  } catch {
    /* storage full — keep in-memory state */
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* keep two open tabs (shop + back office) in sync */
window.addEventListener("storage", (e) => {
  if (e.key !== KEY) return;
  products = parse(e.newValue) ?? PRODUCTS;
  emit();
});

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "coffee"
  );
}

export const store = {
  get(): Product[] {
    return products;
  },

  add(data: Omit<Product, "id">): Product {
    let id = slugify(data.name);
    while (products.some((p) => p.id === id)) id = `${id}-${Math.floor(Math.random() * 900 + 100)}`;
    const product: Product = { ...data, id };
    products = [product, ...products];
    persist();
    emit();
    return product;
  },

  update(id: string, patch: Partial<Omit<Product, "id">>) {
    products = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    persist();
    emit();
  },

  remove(id: string) {
    products = products.filter((p) => p.id !== id);
    persist();
    emit();
  },

  decrement(id: string, qty: number) {
    products = products.map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    );
    persist();
    emit();
  },

  reset() {
    products = PRODUCTS;
    persist();
    emit();
  },
};

/** Live product list — shared by the storefront and the back office. */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, store.get);
}
