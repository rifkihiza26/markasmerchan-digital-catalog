import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";
import { BulkOrder } from "@/components/BulkOrder";
import { Reveal } from "@/components/Reveal";
import skyImg from "@/assets/sky.jpg";
import { useSiteContext } from "@/hooks/useSiteContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Konsultasi Merch MarkasMerchan" },
      {
        name: "description",
        content:
          "Ready to make something memorable? Hubungi MarkasMerchan lewat WhatsApp atau Instagram untuk konsultasi merch gratis.",
      },
      { property: "og:title", content: "Contact — MarkasMerchan" },
      { property: "og:description", content: "Ready to make something memorable? See u in the next step." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { site } = useSiteContext();
  const c = site.landing_page_content?.contact_page;

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-36 sm:pt-40">
        <img src={skyImg} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="grain absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="font-sans text-[clamp(2.2rem,8vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {c?.hero_title_start ?? "Ready to make something"}{" "}
              <span className="marker font-serif italic lowercase">{c?.hero_title_highlight ?? "memorable?"}</span>
            </h1>
          </Reveal>
        </div>
      </section>
      <ContactSection />
      <BulkOrder />
    </>
  );
}
