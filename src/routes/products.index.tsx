import { createFileRoute } from "@tanstack/react-router";
import { ProductSection } from "@/components/ProductSection";
import { Marquee } from "@/components/Marquee";
import { DesignConsultation } from "@/components/DesignConsultation";
import { BulkOrder } from "@/components/BulkOrder";
import { Reveal } from "@/components/Reveal";
import skyImg from "@/assets/sky.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Product — MarkasMerchan Custom Merch Catalog" },
      {
        name: "description",
        content:
          "Katalog produk MarkasMerchan: apparel, merchandise, dan flower untuk kampus, organisasi, event, corporate, dan komunitas.",
      },
      { property: "og:title", content: "Our Product — MarkasMerchan" },
      { property: "og:description", content: "Apparel, merchandise, dan flower dalam satu katalog." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-36 sm:pt-40">
        <img src={skyImg} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="grain absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="font-sans text-[clamp(2.4rem,9vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight">
              Our <span className="marker font-serif italic lowercase">product</span>
            </h1>
            <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-foreground/80">
              Semua produk di bawah ini diambil dari katalog MarkasMerchan. Klik produk untuk lihat
              detail dan konsultasi.
            </p>
          </Reveal>
        </div>
      </section>
      <Marquee>Apparel · Merchandise · Flower</Marquee>
      <ProductSection />
      <DesignConsultation />
      <BulkOrder />
    </>
  );
}
