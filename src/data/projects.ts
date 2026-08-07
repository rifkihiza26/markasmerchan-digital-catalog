/**
 * OUR RECENT PROJECT.
 * Real project names/images were not extractable from the supplied source,
 * so these are labelled placeholders — never invent client names.
 */
export type Project = {
  id: string;
  label: string | null;
  image: string | null;
  span: "lg" | "md" | "sm";
  rot: number;
};

export const projects: Project[] = [
  { id: "p1", label: null, image: null, span: "lg", rot: -2 },
  { id: "p2", label: null, image: null, span: "sm", rot: 1.5 },
  { id: "p3", label: null, image: null, span: "md", rot: -1 },
  { id: "p4", label: null, image: null, span: "sm", rot: 2 },
  { id: "p5", label: null, image: null, span: "md", rot: -1.5 },
  { id: "p6", label: null, image: null, span: "sm", rot: 1 },
];
