import { NoteCard } from "./NoteCard";
import { Reveal } from "./Reveal";
import { PhotoCard } from "./PhotoCard";

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="grain bg-paper px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <h2 id="about-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.92] tracking-tight">
            About{" "}
            <span className="marker block font-serif italic lowercase">MarkasMerchan</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-foreground/80">
            MarkasMerchan adalah one stop solution untuk custom merchandise &amp; apparel — melayani
            kebutuhan kampus, organisasi, event, corporate, dan komunitas.
          </p>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            [CONTENT FROM CATALOG NEEDED] — cerita lengkap perjalanan brand menunggu narasi resmi
            dari katalog.
          </p>

          <div className="mt-10 flex gap-4">
            <PhotoCard alt="Studio photo 01" caption="Details.jpg" rot={-3} className="w-32 sm:w-40" placeholder="BRAND PHOTO" />
            <PhotoCard alt="Studio photo 02" caption="slay.png" rot={2} className="w-28 sm:w-36" ratio="aspect-[4/3]" placeholder="BRAND PHOTO" />
          </div>
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <NoteCard rot={1.2} title={<p className="font-sans text-xl font-bold">Siapa yang kami layani</p>}>
            <ul className="grid grid-cols-2 gap-2">
              {["Kampus", "Organisasi", "Event", "Corporate", "Komunitas"].map((t) => (
                <li key={t} className="hairline rounded-full bg-paper px-3 py-1 text-center text-xs font-bold uppercase tracking-[0.12em]">
                  {t}
                </li>
              ))}
            </ul>
          </NoteCard>
          <NoteCard rot={-1} title={<p className="font-sans text-xl font-bold">Cara kerja kami</p>}>
            Konsultasi → desain &amp; mockup → produksi → kirim. Proses jelas, harga transparan,
            gampang dihubungi.
          </NoteCard>
        </Reveal>
      </div>
    </section>
  );
}
