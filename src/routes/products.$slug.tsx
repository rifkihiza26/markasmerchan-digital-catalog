import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, CONTENT_NEEDED, productsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import { PhotoCard } from "@/components/PhotoCard";
import { NoteCard } from "@/components/NoteCard";
import { ProductCard } from "@/components/ProductCard";
import { waLink } from "@/data/contact";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Product";
    return {
      meta: [
        { title: `${name} — MarkasMerchan Custom Merch` },
        {
          name: "description",
          content: `${name} custom dari MarkasMerchan. Konsultasi gratis untuk kebutuhan kampus, organisasi, event, corporate, dan komunitas.`,
        },
        { property: "og:title", content: `${name} — MarkasMerchan` },
        { property: "og:description", content: `${name} custom dari MarkasMerchan.` },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const category = categories.find((c) => c.id === product.category);
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <article className="grain bg-paper px-4 pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/products" className="hover:text-foreground">Our Product</Link>
            <span aria-hidden="true"> / </span>
            <span>{category?.label}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <PhotoCard
              src={product.image}
              alt={product.name}
              caption={`${product.slug}.jpg`}
              rot={-1.5}
              ratio="aspect-[4/5]"
              className="w-full"
              placeholder="PRODUCT IMAGE NEEDED"
            />

            <div>
              <h1 className="font-sans text-[clamp(2.2rem,7vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-foreground/80">
                {product.description ?? CONTENT_NEEDED}
              </p>

              <NoteCard rot={1} className="mt-8 max-w-md" title={<p className="font-sans text-lg font-bold">Detail produk</p>}>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Kategori</dt>
                    <dd>{category?.label}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Material</dt>
                    <dd>{product.material ?? CONTENT_NEEDED}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Spesifikasi</dt>
                    <dd>
                      {product.specs.length ? (
                        <ul className="list-disc pl-4">
                          {product.specs.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      ) : (
                        CONTENT_NEEDED
                      )}
                    </dd>
                  </div>
                </dl>
              </NoteCard>

              <a
                href={waLink(`Halo MarkasMerchan, saya mau konsultasi produk ${product.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="hairline shadow-cut mt-8 inline-block rounded-full bg-red px-7 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper transition-transform hover:-translate-y-0.5"
              >
                Consult now
              </a>
            </div>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related-title" className="grain bg-sky px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="related-title" className="font-sans text-2xl font-bold uppercase tracking-tight">
              More in <span className="font-serif italic lowercase">{category?.label}</span>
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {related.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
