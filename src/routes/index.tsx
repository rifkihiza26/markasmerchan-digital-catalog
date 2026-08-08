import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { OneStopSection } from "@/components/OneStopSection";
import { Marquee } from "@/components/Marquee";
import { ProductSection } from "@/components/ProductSection";
import { WhyMarkasMerchan } from "@/components/WhyMarkasMerchan";
import { DesignConsultation } from "@/components/DesignConsultation";
import { BulkOrder } from "@/components/BulkOrder";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PartnerSection } from "@/components/PartnerSection";
import { ContactSection } from "@/components/ContactSection";
import { getCatalog, getPartners, getProjects } from "@/lib/content.functions";
import { PageError } from "@/components/PageError";
import type { CatalogCategory, PublicProduct } from "@/lib/content-types";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, projects, partners] = await Promise.all([
      getCatalog(),
      getProjects(),
      getPartners(),
    ]);
    return { categories, projects, partners };
  },
  head: () => ({
    meta: [
      { title: "MarkasMerchan — Custom Merchandise & Apparel" },
      {
        name: "description",
        content:
          "Satu Tempat, Semua Kebutuhan Merch Lo. Custom merchandise & apparel untuk kampus, organisasi, event, corporate, dan komunitas.",
      },
      { property: "og:title", content: "MarkasMerchan — Custom Merchandise & Apparel" },
      { property: "og:description", content: "Satu Tempat, Semua Kebutuhan Merch Lo." },
    ],
  }),
  component: Index,
  errorComponent: () => <PageError />,
  notFoundComponent: () => <PageError title="Halaman tidak ditemukan" />,
});

function Index() {
  const { categories, projects, partners } = Route.useLoaderData();
  const featured = categories.map((c: CatalogCategory) => ({
    ...c,
    products: c.products.filter((p: PublicProduct) => p.is_featured).length
      ? c.products.filter((p: PublicProduct) => p.is_featured)
      : c.products,
  }));

  return (
    <>
      <Hero />
      <Marquee>Satu tempat, semua kebutuhan merch lo</Marquee>
      <OneStopSection />
      <ProductSection categories={featured} limitPerCategory={4} />
      <WhyMarkasMerchan />
      <DesignConsultation />
      <BulkOrder />
      <ProjectGallery projects={projects} />
      <PartnerSection partners={partners} />
      <ContactSection />
    </>
  );
}
