import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PhotoCard } from "@/components/PhotoCard";
import { NoteCard } from "@/components/NoteCard";
import { ProductCard } from "@/components/ProductCard";
import { PageError } from "@/components/PageError";
import { getProductBySlug } from "@/lib/content.functions";
import { CONTENT_NEEDED } from "@/lib/content-defaults";
import { useWaLink } from "@/hooks/useSiteContext";
import type { PublicProduct } from "@/lib/content-types";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const result = await getProductBySlug({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produk tidak ditemukan — MarkasMerchan" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const description =
      product.short_description ??
      product.description ??
      `${product.name} custom dari MarkasMerchan. Konsultasi gratis untuk kebutuhan kampus, organisasi, event, corporate, dan komunitas.`;
    return {
      meta: [
        { title: `${product.name} | MarkasMerchan` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} | MarkasMerchan` },
        { property: "og:description", content: description },
        ...(product.featured_image
          ? [
              { property: "og:image", content: product.featured_image },
              { name: "twitter:image", content: product.featured_image },
            ]
          : []),
      ],
    };
  },
  component: ProductDetail,
  errorComponent: () => <PageError />,
  notFoundComponent: () => (
    <PageError
      title="Produk tidak ditemukan"
      message="Produk yang lo cari sudah tidak tersedia atau pindah alamat."
    />
  ),
});

function ProductDetail() {
  const { product, category, related } = Route.useLoaderData();
  const wa = useWaLink(`Halo MarkasMerchan, saya mau konsultasi produk ${product.name}.`);
  const gallery = product.gallery ?? [];

  return (
    <>
      <article className="grain bg-paper px-4 pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/products" className="hover:text-foreground">Our Product</Link>
            <span aria-hidden="true"> / </span>
            <span>{category?.name ?? "Product"}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <PhotoCard
                src={product.featured_image}
                alt={product.name}
                caption={`${product.slug}.jpg`}
                rot={-1.5}
                ratio="aspect-[4/5]"
                className="w-full"
                placeholder="PRODUCT IMAGE NEEDED"
              />
              {gallery.length ? (
                <ul className="mt-6 grid grid-cols-3 gap-4">
                  {gallery.map((src: string, i: number) => (
                    <li key={src}>
                      <PhotoCard
                        src={src}
                        alt={`${product.name} ${i + 1}`}
                        rot={((i % 3) - 1) * 1.5}
                        ratio="aspect-square"
                        className="w-full"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div>
              <h1 className="font-sans text-[clamp(2.2rem,7vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-foreground/80">
                {product.description ?? product.short_description ?? CONTENT_NEEDED}
              </p>

              <NoteCard rot={1} className="mt-8 max-w-md" title={<p className="font-sans text-lg font-bold">Detail produk</p>}>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Kategori</dt>
                    <dd>{category?.name ?? CONTENT_NEEDED}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Material</dt>
                    <dd>{product.material ?? CONTENT_NEEDED}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.14em] text-muted-foreground">Spesifikasi</dt>
                    <dd>
                      {product.specifications?.length ? (
                        <ul className="list-disc pl-4">
                          {product.specifications.map((s: string) => (
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
                href={wa}
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
              More in <span className="font-serif italic lowercase">{category?.name}</span>
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {related.map((p: PublicProduct, i: number) => (
                <li key={p.id}>
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
