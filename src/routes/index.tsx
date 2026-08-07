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

export const Route = createFileRoute("/")({
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
});

function Index() {
  return (
    <>
      <Hero />
      <Marquee>Satu tempat, semua kebutuhan merch lo</Marquee>
      <OneStopSection />
      <ProductSection limitPerCategory={4} />
      <WhyMarkasMerchan />
      <DesignConsultation />
      <BulkOrder />
      <ProjectGallery />
      <PartnerSection />
      <ContactSection />
    </>
  );
}
