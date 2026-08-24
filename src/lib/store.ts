import { useSyncExternalStore } from "react";
import { PRODUCTS, type Product } from "../data/products";

const KEY = "cinder:products:v1";

function load(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((p) => p && typeof p.id === "string")) {
        return parsed as Product[];
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return PRODUCTS;
}

let products: Product[] = load();
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
