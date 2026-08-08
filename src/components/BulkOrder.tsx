import { useWaLink } from "@/hooks/useSiteContext";
import { Reveal } from "./Reveal";

const targets = ["Campus", "Organization", "Event", "Corporate", "Community"];

export function BulkOrder() {
  const wa = useWaLink("Halo MarkasMerchan, saya mau minta penawaran untuk pemesanan borongan.");
  return (
    <section aria-labelledby="bulk-title" className="grain bg-yellow px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 id="bulk-title" className="font-sans text-[clamp(2rem,7vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight">
            Ordering in <span className="font-serif italic lowercase">bulk?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-sans text-base leading-relaxed text-foreground/80">
            Pesan borongan buat kampus, organisasi, event, corporate, atau komunitas — tinggal
            kabarin kebutuhan lo, kami bantu itung.
          </p>
        </Reveal>

        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {targets.map((t, i) => (
            <li
              key={t}
              className="hairline rounded-full bg-paper px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.14em]"
              style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
            >
              {t}
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="hairline shadow-cut mt-10 inline-block rounded-full bg-ink px-7 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper transition-transform hover:-translate-y-0.5"
          >
            Get a quote
          </a>
        </Reveal>
      </div>
    </section>
  );
}
