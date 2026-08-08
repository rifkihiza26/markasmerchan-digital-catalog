import { Link } from "@tanstack/react-router";
import type { PublicProduct } from "@/lib/content-types";
import { CONTENT_NEEDED } from "@/lib/content-defaults";
import { PhotoCard } from "./PhotoCard";

export function ProductCard({ product, index = 0 }: { product: PublicProduct; index?: number }) {
  const rot = ((index % 5) - 2) * 0.9;

  return (
    <article className="group relative">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        data-cursor="View"
        className="block focus-visible:outline-offset-4"
        aria-label={`Lihat detail ${product.name}`}
      >
        <PhotoCard
          src={product.featured_image}
          alt={product.name}
          caption={`${product.slug}.jpg`}
          rot={rot}
          placeholder="PRODUCT IMAGE NEEDED"
        />
      </Link>
      <div className="mt-3">
        <h3 className="font-sans text-base font-bold uppercase leading-tight tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
          {product.short_description ?? product.description ?? CONTENT_NEEDED}
        </p>
        {product.material ? (
          <p className="mt-1 font-serif text-xs italic">{product.material}</p>
        ) : null}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="hairline mt-3 inline-block rounded-full px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-yellow"
        >
          View detail
        </Link>
      </div>
    </article>
  );
}
