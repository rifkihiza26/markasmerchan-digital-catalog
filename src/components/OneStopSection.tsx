import { NoteCard } from "./NoteCard";
import { Reveal } from "./Reveal";
import { PhotoCard } from "./PhotoCard";

export function OneStopSection() {
  return (
    <section aria-labelledby="onestop-title" className="grain relative bg-paper px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <h2 id="onestop-title" className="font-sans text-[clamp(2.2rem,7vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight">
            One Stop{" "}
            <span className="marker font-serif italic lowercase tracking-normal">solution</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-foreground/80">
            Semua kebutuhan custom merchandise dan apparel lo ada di satu tempat — dari apparel,
            merchandise, sampai flower. Satu tempat, semua kebutuhan merch lo.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {["Apparel", "Merchandise", "Flower"].map((t, i) => (
              <li
                key={t}
                className="hairline rounded-full px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.14em]"
                style={{
                  transform: `rotate(${i - 1}deg)`,
                  background: ["var(--color-yellow)", "var(--color-sky)", "var(--color-red)"][i],
                  color: i === 2 ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="absolute -left-4 -top-8 hidden w-28 sm:block">
            <PhotoCard alt="Catalog spread" caption="Details.jpg" rot={-5} placeholder="CATALOG PHOTO" />
          </div>
          <NoteCard
            rot={1.5}
            className="ml-auto max-w-md"
            title={
              <p className="font-sans text-2xl font-bold">
                Lengkap &amp; <span className="font-serif italic">praktis</span>
              </p>
            }
          >
            Nggak perlu pindah-pindah vendor. Konsultasi, desain, produksi — semua jalan dari satu
            markas.
          </NoteCard>
        </Reveal>
      </div>
    </section>
  );
}
