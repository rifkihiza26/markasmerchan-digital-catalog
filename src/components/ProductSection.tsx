import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

const bg: Record<string, string> = {
  yellow: "bg-yellow",
  sky: "bg-sky",
  red: "bg-red text-paper",
};

export function ProductSection({ limitPerCategory }: { limitPerCategory?: number }) {
  return (
    <>
      {categories.map((cat) => {
        const items = productsByCategory(cat.id);
        const shown = limitPerCategory ? items.slice(0, limitPerCategory) : items;
        return (
          <section
            key={cat.id}
            id={cat.id}
            aria-labelledby={`cat-${cat.id}`}
            className={`grain px-4 py-20 sm:py-24 ${bg[cat.color]}`}
          >
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2
                    id={`cat-${cat.id}`}
                    className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight"
                  >
                    {cat.label.slice(0, -3)}
                    <span className="font-serif italic lowercase">{cat.label.slice(-3)}</span>
                  </h2>
                  <p className="max-w-xs font-sans text-sm leading-relaxed">{cat.note}</p>
                </div>
              </Reveal>

              <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                {shown.map((p, i) => (
                  <li key={p.slug}>
                    <Reveal delay={(i % 4) * 70}>
                      <ProductCard product={p} index={i} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
