import type { CatalogCategory } from "@/lib/content-types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

/** Keeps the original colour rotation per category position. */
const palette = ["bg-yellow", "bg-sky", "bg-red text-paper"];

export function ProductSection({
  categories,
  limitPerCategory,
}: {
  categories: CatalogCategory[];
  limitPerCategory?: number;
}) {
  if (!categories.length) {
    return (
      <section className="grain bg-sky px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Katalog produk belum tersedia.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {categories.map((cat, catIndex) => {
        const shown = limitPerCategory ? cat.products.slice(0, limitPerCategory) : cat.products;
        return (
          <section
            key={cat.id}
            id={cat.slug}
            aria-labelledby={`cat-${cat.slug}`}
            className={`grain px-4 py-20 sm:py-24 ${palette[catIndex % palette.length]}`}
          >
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2
                    id={`cat-${cat.slug}`}
                    className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight"
                  >
                    {cat.name}
                    <span className="ml-3 font-serif text-[0.35em] italic lowercase tracking-normal">
                      / collection
                    </span>
                  </h2>
                  {cat.description ? (
                    <p className="max-w-xs font-sans text-sm leading-relaxed">{cat.description}</p>
                  ) : null}
                </div>
              </Reveal>

              {shown.length ? (
                <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                  {shown.map((p, i) => (
                    <li key={p.id}>
                      <Reveal delay={(i % 4) * 70}>
                        <ProductCard product={p} index={i} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-10 font-serif text-lg italic opacity-80">
                  Belum ada produk di kategori ini.
                </p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
