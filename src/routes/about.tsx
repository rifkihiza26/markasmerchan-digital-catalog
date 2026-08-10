import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/AboutSection";
import { WhyMarkasMerchan } from "@/components/WhyMarkasMerchan";
import { DesignConsultation } from "@/components/DesignConsultation";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PartnerSection } from "@/components/PartnerSection";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import skyImg from "@/assets/sky.jpg";
import { PageError } from "@/components/PageError";
import { getPartners, getProjects } from "@/lib/content.functions";
import { useSiteContext } from "@/hooks/useSiteContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — MarkasMerchan Merch Studio" },
      {
        name: "description",
        content:
          "MarkasMerchan adalah one stop solution custom merchandise & apparel untuk kampus, organisasi, event, corporate, dan komunitas.",
      },
      { property: "og:title", content: "About Us — MarkasMerchan" },
      { property: "og:description", content: "One stop solution custom merchandise & apparel." },
    ],
  }),
  loader: async () => {
    const [projects, partners] = await Promise.all([getProjects(), getPartners()]);
    return { projects, partners };
  },
  component: AboutPage,
  errorComponent: () => <PageError />,
  notFoundComponent: () => <PageError title="Halaman tidak ditemukan" />,
});

function AboutPage() {
  const { projects, partners } = Route.useLoaderData();
  const { site } = useSiteContext();
  const c = site.landing_page_content?.about_page;

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-36 sm:pt-40">
        <img src={skyImg} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="grain absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="font-sans text-[clamp(2.4rem,9vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {c?.hero_title_start ?? "About"}{" "}
              <span className="marker font-serif italic lowercase">{c?.hero_title_highlight ?? "us"}</span>
            </h1>
          </Reveal>
        </div>
      </section>
      <Marquee>{c?.marquee_text ?? "Custom merchandise & apparel"}</Marquee>
      <AboutSection />
      <WhyMarkasMerchan />
      <DesignConsultation />
      <ProjectGallery projects={projects} />
      <PartnerSection partners={partners} />
    </>
  );
}
