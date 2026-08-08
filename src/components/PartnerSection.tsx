import type { PublicPartner } from "@/lib/content-types";
import { Reveal } from "./Reveal";

export function PartnerSection({ partners }: { partners: PublicPartner[] }) {
  if (!partners.length) return null;

  return (
    <section aria-labelledby="partners-title" className="grain bg-sky px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="partners-title" className="text-center font-sans text-xs font-bold uppercase tracking-[0.35em]">
            Trusted by / Our partner
          </h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {partners.map((p, i) => {
            const inner = p.logo_url ? (
              <img
                src={p.logo_url}
                alt={p.name}
                loading="lazy"
                className="max-h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {p.name}
              </span>
            );

            return (
              <li key={p.id}>
                <div
                  className="hairline grid h-20 place-items-center bg-paper/70 px-3 text-center"
                  style={{ transform: `rotate(${((i % 4) - 1.5) * 0.8}deg)` }}
                >
                  {p.website_url ? (
                    <a href={p.website_url} target="_blank" rel="noreferrer" className="grid place-items-center">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
