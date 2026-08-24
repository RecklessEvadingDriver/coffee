import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CATEGORY_NAMES,
  DEFAULT_BREW,
  ROAST_LABELS,
  SAMPLE_IMAGES,
  type CategoryName,
  type Product,
} from "../../data/products";
import { RoastMeter } from "../ui";
import { IconCheck, IconRefresh, IconUpload, IconX } from "../icons";

const ACCENTS = [
  "#e9b872",
  "#df9c4b",
  "#a3b183",
  "#8fa3b0",
  "#c76b76",
  "#d06a4e",
  "#caa46a",
  "#9db2a4",
];

type FormErrors = Partial<
  Record<"name" | "origin" | "price" | "stock" | "notes" | "description" | "image", string>
>;

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-cream-500">
      {children}
    </span>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-bold text-cherry-400">{msg}</p>;
}

export default function ProductFormModal({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null; // null = create
  onClose: () => void;
  onSave: (data: Omit<Product, "id">, existingId?: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    origin: "",
    region: "",
    category: "Single Origin" as CategoryName,
    process: "Washed",
    varietal: "",
    altitude: "",
    producer: "",
    roast: 3 as 1 | 2 | 3 | 4 | 5,
    notes: "",
    description: "",
    price: "",
    stock: "",
    badge: "",
    accent: ACCENTS[0],
    image: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sampleIdx, setSampleIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (product) {
      setForm({
        name: product.name,
        origin: product.origin,
        region: product.region,
        category: product.category,
        process: product.process,
        varietal: product.varietal,
        altitude: product.altitude,
        producer: product.producer,
        roast: product.roast,
        notes: product.notes.join(", "),
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        badge: product.badge ?? "",
        accent: product.accent,
        image: product.image,
      });
      const idx = SAMPLE_IMAGES.indexOf(product.image);
      setSampleIdx(idx >= 0 ? idx : 0);
    } else {
      setForm({
        name: "",
        origin: "",
        region: "",
        category: "Single Origin",
        process: "Washed",
        varietal: "",
        altitude: "",
        producer: "",
        roast: 3,
        notes: "",
        description: "",
        price: "",
        stock: "",
        badge: "",
        accent: ACCENTS[Math.floor(Math.random() * ACCENTS.length)],
        image: "",
      });
    }
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set =
    <K extends keyof typeof form>(k: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") setForm((f) => ({ ...f, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: FormErrors = {};
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (!form.name.trim()) errs.name = "Every lot needs a name.";
    if (!form.origin.trim()) errs.origin = "Where was it grown?";
    if (!form.price.trim() || isNaN(price) || price <= 0)
      errs.price = "Set a price per 250 g bag.";
    if (form.stock.trim() === "" || isNaN(stock) || stock < 0)
      errs.stock = "Stock must be 0 or more.";
    const notes = form.notes
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    if (notes.length === 0) errs.notes = "At least one tasting note, comma-separated.";
    if (!form.description.trim()) errs.description = "Tell the shelf what makes it sing.";
    const image = form.image.trim() || SAMPLE_IMAGES[sampleIdx];
    if (!image) errs.image = "Pick or paste an image.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSave(
      {
        name: form.name.trim(),
        origin: form.origin.trim(),
        region: form.region.trim() || form.origin.trim(),
        category: form.category,
        process: form.process.trim() || "Washed",
        varietal: form.varietal.trim() || "—",
        altitude: form.altitude.trim() || "—",
        producer: form.producer.trim() || "—",
        roast: form.roast,
        notes,
        description: form.description.trim(),
        price: Math.round(price * 100) / 100,
        stock: Math.max(0, stock),
        badge: form.badge.trim() || undefined,
        accent: form.accent,
        image,
        brewGuide: product?.brewGuide ?? DEFAULT_BREW,
      },
      product?.id
    );
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-label={product ? `Edit ${product.name}` : "Add a coffee"}>
      <div className="anim-fade fixed inset-0 bg-espresso-950/85 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="anim-rise relative mx-auto my-6 w-[min(880px,94vw)] overflow-hidden rounded-xl border border-cream-100/10 bg-espresso-850 shadow-warm md:my-10"
      >
        <div className="flex items-center justify-between border-b border-cream-100/10 px-6 py-4">
          <div>
            <p className="eyebrow">{product ? "Back office · Edit lot" : "Back office · New lot"}</p>
            <h2 className="mt-1 font-display text-2xl text-cream-50">
              {product ? product.name : "Add a coffee to the shelf"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="btn-press grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-cherry-500/60 hover:text-cherry-400"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[300px_1fr] md:p-7">
          {/* left: image + identity */}
          <div>
            <FieldLabel>Bag photo</FieldLabel>
            <div className="relative overflow-hidden rounded-lg border border-cream-100/12 bg-espresso-900">
              <img
                src={form.image.trim() || SAMPLE_IMAGES[sampleIdx]}
                alt="Bag preview"
                className="aspect-[4/5] w-full object-cover"
              />
              <span
                className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full ring-2 ring-espresso-950/60"
                style={{ background: form.accent }}
              />
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-press flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-cream-100/20 text-sm font-bold text-cream-200 transition-colors hover:border-caramel-500/60 hover:text-caramel-300"
              >
                <IconUpload className="h-4 w-4" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = (sampleIdx + 1) % SAMPLE_IMAGES.length;
                  setSampleIdx(next);
                  setForm((f) => ({ ...f, image: SAMPLE_IMAGES[next] }));
                }}
                className="btn-press flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-cream-100/20 text-sm font-bold text-cream-200 transition-colors hover:border-caramel-500/60 hover:text-caramel-300"
              >
                <IconRefresh className="h-4 w-4" />
                Sample
              </button>
            </div>

            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {SAMPLE_IMAGES.map((src, i) => {
                const active = form.image === src || (!form.image.trim() && sampleIdx === i);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      setSampleIdx(i);
                      setForm((f) => ({ ...f, image: src }));
                    }}
                    aria-label={`Use sample image ${i + 1}`}
                    className={`overflow-hidden rounded-md ring-2 transition-all ${
                      active ? "ring-caramel-500" : "ring-transparent hover:ring-cream-100/30"
                    }`}
                  >
                    <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
                  </button>
                );
              })}
            </div>

            <label className="mt-3 block">
              <FieldLabel>…or paste an image URL</FieldLabel>
              <input
                type="url"
                className="input-dark"
                placeholder="https://…"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={set("image")}
              />
            </label>
            <ErrorText msg={errors.image} />

            <div className="mt-5">
              <FieldLabel>Label accent</FieldLabel>
              <div className="flex items-center gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, accent: c }))}
                    aria-label={`Accent ${c}`}
                    className={`grid h-7 w-7 place-items-center rounded-full transition-transform hover:scale-110 ${
                      form.accent === c ? "ring-2 ring-cream-100/70 ring-offset-2 ring-offset-espresso-850" : ""
                    }`}
                    style={{ background: c }}
                  >
                    {form.accent === c && <IconCheck className="h-3.5 w-3.5 text-espresso-950" strokeWidth={3} />}
                  </button>
                ))}
                <input
                  type="color"
                  aria-label="Custom accent colour"
                  value={form.accent}
                  onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                  className="h-7 w-8 cursor-pointer rounded border border-cream-100/20 bg-transparent p-0"
                />
              </div>
            </div>
          </div>

          {/* right: fields */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Name *</FieldLabel>
                <input className="input-dark" placeholder="Finca El Mirador" value={form.name} onChange={set("name")} />
                <ErrorText msg={errors.name} />
              </label>
              <label className="block">
                <FieldLabel>Origin *</FieldLabel>
                <input className="input-dark" placeholder="Honduras" value={form.origin} onChange={set("origin")} />
                <ErrorText msg={errors.origin} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Region</FieldLabel>
                <input className="input-dark" placeholder="Marcala, La Paz" value={form.region} onChange={set("region")} />
              </label>
              <label className="block">
                <FieldLabel>Category</FieldLabel>
                <select className="input-dark cursor-pointer" value={form.category} onChange={set("category")}>
                  {CATEGORY_NAMES.map((c) => (
                    <option key={c} value={c} className="bg-espresso-800">
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <FieldLabel>Process</FieldLabel>
                <input className="input-dark" placeholder="Washed" value={form.process} onChange={set("process")} />
              </label>
              <label className="block">
                <FieldLabel>Varietal</FieldLabel>
                <input className="input-dark" placeholder="Pacamara" value={form.varietal} onChange={set("varietal")} />
              </label>
              <label className="block">
                <FieldLabel>Altitude</FieldLabel>
                <input className="input-dark" placeholder="1,650 masl" value={form.altitude} onChange={set("altitude")} />
              </label>
            </div>

            <label className="block">
              <FieldLabel>Producer</FieldLabel>
              <input className="input-dark" placeholder="Familia Caballero" value={form.producer} onChange={set("producer")} />
            </label>

            <div>
              <FieldLabel>Roast level</FieldLabel>
              <div className="flex items-center gap-4 rounded-lg border border-cream-100/12 bg-espresso-900 px-4 py-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={form.roast}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roast: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))
                  }
                  className="flex-1 accent-[#df9c4b]"
                  aria-label="Roast level"
                />
                <RoastMeter level={form.roast} showLabel />
              </div>
            </div>

            <label className="block">
              <FieldLabel>Tasting notes * (comma-separated)</FieldLabel>
              <input
                className="input-dark"
                placeholder="Fig, brown sugar, orange zest"
                value={form.notes}
                onChange={set("notes")}
              />
              <ErrorText msg={errors.notes} />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <FieldLabel>Price / 250 g *</FieldLabel>
                <input className="input-dark tabular-nums" placeholder="22.00" inputMode="decimal" value={form.price} onChange={set("price")} />
                <ErrorText msg={errors.price} />
              </label>
              <label className="block">
                <FieldLabel>Stock (bags) *</FieldLabel>
                <input className="input-dark tabular-nums" placeholder="40" inputMode="numeric" value={form.stock} onChange={set("stock")} />
                <ErrorText msg={errors.stock} />
              </label>
              <label className="block">
                <FieldLabel>Badge (optional)</FieldLabel>
                <input className="input-dark" placeholder="New crop" value={form.badge} onChange={set("badge")} />
              </label>
            </div>

            <label className="block">
              <FieldLabel>Story *</FieldLabel>
              <textarea
                rows={4}
                className="input-dark resize-none leading-relaxed"
                placeholder="What makes this lot worth the shelf space?"
                value={form.description}
                onChange={set("description")}
              />
              <ErrorText msg={errors.description} />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-cream-100/10 bg-espresso-900/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-press h-11 rounded-full border border-cream-100/20 px-6 text-sm font-bold text-cream-300 transition-colors hover:border-cream-100/40 hover:text-cream-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-press h-11 rounded-full bg-caramel-500 px-7 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
          >
            {product ? "Save changes" : "Put it on the shelf"}
          </button>
        </div>
      </form>
    </div>
  );
}
