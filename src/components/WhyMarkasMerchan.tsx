import { Reveal } from "./Reveal";
import { useSiteContext } from "@/hooks/useSiteContext";

export function WhyMarkasMerchan() {
  const { site } = useSiteContext();
  const content = site.landing_page_content?.why;

  if (!content) return null;

  return (
    <section aria-labelledby="why-title" className="grain bg-sky px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 id="why-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {content.title_start} <span className="font-serif italic lowercase">{content.title_highlight}</span>
          </h2>
        </Reveal>

        <ul className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {content.values.map((v, i) => (
            <li key={v.title + i} className="max-w-[15rem] flex-1 basis-56">
              <Reveal delay={i * 70}>
                <div
                  className={`hairline shadow-cut tape px-5 pb-8 pt-9 ${v.color} ${v.color === "bg-red" ? "text-paper" : ""}`}
                  style={{ transform: `rotate(${v.rot}deg)` }}
                >
                  <p className="font-sans text-lg font-bold uppercase leading-tight tracking-tight">
                    {v.title}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
