import { Link } from "@tanstack/react-router";
import skyImg from "@/assets/sky.jpg";
import { Logo } from "./Logo";
import { PhotoCard } from "./PhotoCard";
import { useSiteContext, useWaLink } from "@/hooks/useSiteContext";

export function Hero() {
  const { site } = useSiteContext();
  const wa = useWaLink();

  const c = site.landing_page_content?.hero;
  const hero1 = site.hero_image_1 || undefined;
  const hero2 = site.hero_image_2 || undefined;
  const hero3 = site.hero_image_3 || undefined;

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <img
        src={skyImg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="relative">
          {/* collage: side photos */}
          <div className="pointer-events-none absolute -left-2 top-0 hidden w-40 lg:block xl:w-48">
            <PhotoCard src={hero1} alt="Brand photo 01" caption="Hero_01.jpg" rot={-3} float placeholder="BRAND PHOTO 1" />
          </div>
          <div className="pointer-events-none absolute -right-4 top-4 hidden w-36 lg:block xl:w-44">
            <PhotoCard src={hero2} alt="Brand photo 02" caption="Hero_02.jpg" rot={3} float ratio="aspect-[4/3]" placeholder="BRAND PHOTO 2" />
          </div>
          <div className="pointer-events-none absolute -right-2 top-56 hidden w-48 lg:block xl:w-56">
            <PhotoCard src={hero3} alt="Brand photo 03" caption="Hero_03.jpg" rot={-2} float placeholder="BRAND PHOTO 3" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h1 id="hero-title" className="sr-only">
              MarkasMerchan — Custom Merchandise &amp; Apparel
            </h1>
            <p aria-hidden="true">
              <Logo className="text-[clamp(2.4rem,11vw,5.5rem)] tracking-tight" />
            </p>

            <p className="marker-blue mx-auto mt-6 inline-block font-sans text-sm sm:text-base">
              {c?.badge ?? site.description}
            </p>
            <p className="mx-auto mt-3 max-w-md font-serif text-lg italic leading-snug sm:text-xl">
              {c?.quote ?? site.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                className="hairline shadow-cut rounded-full bg-red px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper transition-transform hover:-translate-y-0.5"
              >
                {c?.cta_primary ?? "Explore our product"}
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="hairline rounded-full bg-paper px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:bg-yellow"
              >
                {c?.cta_secondary ?? "Consult now"}
              </a>
            </div>
          </div>

          {/* mobile / tablet collage strip */}
          <div className="mt-10 flex items-start justify-center gap-4 lg:hidden">
            <PhotoCard src={hero1} alt="Brand photo 01" caption="Hero_01.jpg" rot={-3} className="w-28 sm:w-36" placeholder="BRAND PHOTO 1" />
            <PhotoCard src={hero2} alt="Brand photo 02" caption="Hero_02.jpg" rot={2} className="w-32 sm:w-44" ratio="aspect-[4/3]" placeholder="BRAND PHOTO 2" />
            <PhotoCard src={hero3} alt="Brand photo 03" caption="Hero_03.jpg" rot={-1} className="w-24 sm:w-32" placeholder="BRAND PHOTO 3" />
          </div>
        </div>
      </div>
    </section>
  );
}
