import type { CategoryId } from "./products";

export type Category = {
  id: CategoryId;
  label: string;
  /** short editorial line — safe brand framing, no invented specs */
  note: string;
  color: "sky" | "yellow" | "red";
};

export const categories: Category[] = [
  { id: "apparel", label: "Apparel", note: "Kaos, polo, kemeja, jaket, sweater, hoodie.", color: "yellow" },
  { id: "merchandise", label: "Merchandise", note: "Merch harian buat event, kampus & komunitas.", color: "sky" },
  { id: "flower", label: "Flower", note: "Fresh & artificial flower.", color: "red" },
];
