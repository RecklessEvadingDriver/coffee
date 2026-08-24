export interface BrewRow {
  method: string;
  ratio: string;
  temp: string;
  time: string;
}

export interface Product {
  id: string;
  name: string;
  origin: string;
  region: string;
  category: "Single Origin" | "Blends" | "Decaf" | "Microlot";
  process: string;
  varietal: string;
  altitude: string;
  producer: string;
  roast: 1 | 2 | 3 | 4 | 5;
  notes: string[];
  description: string;
  price: number; // per 250 g
  image: string;
  accent: string;
  badge?: string;
  brewGuide: BrewRow[];
}

export interface WeightOption {
  label: string;
  factor: number;
}

export const WEIGHTS: WeightOption[] = [
  { label: "250 g", factor: 1 },
  { label: "1 kg", factor: 3.4 },
];

export const FREE_SHIPPING_AT = 45;
export const FLAT_SHIPPING = 6;

export const ROAST_LABELS: Record<number, string> = {
  1: "Light",
  2: "Medium-light",
  3: "Medium",
  4: "Medium-dark",
  5: "Dark",
};

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function unitPrice(p: Product, weightIdx: number): number {
  return Math.round(p.price * WEIGHTS[weightIdx].factor * 100) / 100;
}

export const PRODUCTS: Product[] = [
  {
    id: "ethiopia-idido",
    name: "Idido Yirgacheffe",
    origin: "Ethiopia",
    region: "Gedeo Zone, Yirgacheffe",
    category: "Single Origin",
    process: "Washed",
    varietal: "Heirloom cultivars",
    altitude: "1,900 – 2,200 masl",
    producer: "Idido washing station, ~450 smallholders",
    roast: 2,
    notes: ["Bergamot", "White peach", "Jasmine"],
    description:
      "A luminous washed lot from the Idido washing station, where heirloom cherries are floated, hand-sorted and dried slowly on raised beds. It unfurls as it cools — jasmine up front, white peach through the middle, and a long bergamot finish that keeps coming back.",
    price: 21.5,
    image:
      "https://image.qwenlm.ai/generated-images/b93827b9-2088-4731-88d9-a9ef31e27348/_result.png",
    accent: "#e9b872",
    badge: "New crop",
    brewGuide: [
      { method: "V60", ratio: "15 g / 250 g", temp: "94 °C", time: "2:45" },
      { method: "AeroPress", ratio: "13 g / 200 g", temp: "88 °C", time: "1:30" },
      { method: "Cold brew", ratio: "60 g / 1 L", temp: "Cold", time: "16 h" },
    ],
  },
  {
    id: "colombia-laloma",
    name: "La Loma Huila",
    origin: "Colombia",
    region: "San Agustín, Huila",
    category: "Single Origin",
    process: "Honey",
    varietal: "Pink Bourbon",
    altitude: "1,750 masl",
    producer: "Familia Rojas, third generation",
    roast: 3,
    notes: ["Panela", "Red apple", "Toffee"],
    description:
      "The Rojas family leaves just enough mucilage on the seed for the sugars to caramelise in the drum — panela sweetness with a crisp red-apple acidity. Our go-to recommendation for anyone moving off supermarket coffee and never looking back.",
    price: 19.0,
    image:
      "https://image.qwenlm.ai/generated-images/934f8e91-e674-48c8-bffb-ea02c93205ff/_result.png",
    accent: "#a3b183",
    brewGuide: [
      { method: "V60", ratio: "15 g / 250 g", temp: "93 °C", time: "2:30" },
      { method: "Chemex", ratio: "24 g / 400 g", temp: "93 °C", time: "3:30" },
      { method: "Espresso", ratio: "18 g in / 36 g out", temp: "93 °C", time: "0:27" },
    ],
  },
  {
    id: "kenya-gatomboya",
    name: "Gatomboya AA",
    origin: "Kenya",
    region: "Nyeri County",
    category: "Single Origin",
    process: "Washed, double-fermented",
    varietal: "SL28 · SL34",
    altitude: "1,800 masl",
    producer: "Gatomboya co-operative, 700 members",
    roast: 2,
    notes: ["Blackcurrant", "Grapefruit", "Demerara"],
    description:
      "A thunderstorm in a cup. Double fermentation at the factory gives this AA its trademark blackcurrant punch, brightened by grapefruit and settled by raw demerara sugar. Juicy, loud, unmistakably Kenyan — pour it for someone who says coffee all tastes the same.",
    price: 23.0,
    image:
      "https://image.qwenlm.ai/generated-images/24399d7a-1e0e-4bea-915b-104d8c3502ce/_result.png",
    accent: "#c76b76",
    badge: "Co-op lot",
    brewGuide: [
      { method: "V60", ratio: "15 g / 250 g", temp: "94 °C", time: "2:40" },
      { method: "Kalita Wave", ratio: "18 g / 300 g", temp: "94 °C", time: "3:00" },
      { method: "Espresso", ratio: "18 g in / 38 g out", temp: "94 °C", time: "0:28" },
    ],
  },
  {
    id: "foundry-espresso",
    name: "Foundry Espresso",
    origin: "Brazil + Ethiopia",
    region: "Cerrado & Guji blend",
    category: "Blends",
    process: "Natural + washed",
    varietal: "Mundo Novo · Heirloom",
    altitude: "1,100 – 1,900 masl",
    producer: "Blend, roasted for milk",
    roast: 4,
    notes: ["Cacao nib", "Hazelnut", "Molasses"],
    description:
      "Our house espresso, built to sit under a flat white and still be heard. Brazilian naturals bring cacao and molasses weight; a shot of Ethiopian heirloom keeps the hazelnut sweetness from going flat. Pulls a syrupy, tiger-striped shot, every single time.",
    price: 17.5,
    image:
      "https://image.qwenlm.ai/generated-images/156628a7-31d2-4c2a-91c2-cfdbaf45a5bb/_result.png",
    accent: "#df9c4b",
    badge: "Best seller",
    brewGuide: [
      { method: "Espresso", ratio: "18 g in / 36 g out", temp: "93 °C", time: "0:28" },
      { method: "Moka pot", ratio: "17 g / 200 g", temp: "Stovetop", time: "4:00" },
      { method: "French press", ratio: "30 g / 500 g", temp: "96 °C", time: "4:00" },
    ],
  },
  {
    id: "dusk-decaf",
    name: "Dusk Decaf",
    origin: "Colombia",
    region: "Cauca",
    category: "Decaf",
    process: "Sugarcane E.A. decaf",
    varietal: "Caturra · Castillo",
    altitude: "1,600 masl",
    producer: "Smallholders via Inza roastery program",
    roast: 3,
    notes: ["Milk chocolate", "Almond", "Date"],
    description:
      "Decaf that doesn't apologise. The sugarcane process is gentle on the seed, so instead of cardboard you get milk chocolate, roasted almond and a soft date sweetness. It's the last cup of the day — roasted with exactly the same care as the first.",
    price: 18.0,
    image:
      "https://image.qwenlm.ai/generated-images/c312525e-5d1b-4307-ab26-e7e0fcef5e48/_result.png",
    accent: "#8fa3b0",
    brewGuide: [
      { method: "V60", ratio: "16 g / 250 g", temp: "95 °C", time: "2:50" },
      { method: "Batch brew", ratio: "60 g / 1 L", temp: "94 °C", time: "5:30" },
      { method: "Espresso", ratio: "18 g in / 36 g out", temp: "94 °C", time: "0:30" },
    ],
  },
  {
    id: "guatemala-santarosa",
    name: "Santa Rosa Natural",
    origin: "Guatemala",
    region: "Huehuetenango",
    category: "Microlot",
    process: "Anaerobic natural",
    varietal: "Bourbon · Caturra",
    altitude: "1,950 masl",
    producer: "Don Miguel Ortega, 12-bag lot",
    roast: 2,
    notes: ["Strawberry", "Rum raisin", "Vanilla"],
    description:
      "Twelve bags, and that's the whole lot. Don Miguel ferments his cherries anaerobically for five days before drying them whole, which lands somewhere between strawberry jam and rum raisin, with vanilla in the finish. When this page says sold out, it genuinely is.",
    price: 24.5,
    image:
      "https://image.qwenlm.ai/generated-images/eb8b66e7-741c-4555-b0cd-3ae318dd43b2/_result.png",
    accent: "#d06a4e",
    badge: "12 bags only",
    brewGuide: [
      { method: "V60", ratio: "15 g / 250 g", temp: "92 °C", time: "2:40" },
      { method: "Origami", ratio: "16 g / 260 g", temp: "92 °C", time: "2:50" },
      { method: "Cold brew", ratio: "60 g / 1 L", temp: "Cold", time: "14 h" },
    ],
  },
];

export const CATEGORIES = ["All", "Single Origin", "Blends", "Decaf", "Microlot"] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];
