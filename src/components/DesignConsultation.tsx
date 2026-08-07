import { waLink } from "@/data/contact";
import { NoteCard } from "./NoteCard";
import { Reveal } from "./Reveal";

export function DesignConsultation() {
  return (
    <section aria-labelledby="consult-title" className="grain bg-paper px-4 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 id="consult-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.92] tracking-tight">
            Don’t have a design yet?
            <span className="mt-2 block font-serif italic lowercase">we got you.</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-foreground/80">
            MarkasMerchan nyediain konsultasi desain gratis — dari ide kasar sampai mockup, tim
            desain kami bantuin sampai jadi.
          </p>
          <a
            href={waLink("Halo MarkasMerchan, saya mau konsultasi desain merch.")}
            target="_blank"
            rel="noreferrer"
            className="hairline shadow-cut mt-8 inline-block rounded-full bg-violet px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper transition-transform hover:-translate-y-0.5"
          >
            Talk to our design team
          </a>
        </Reveal>

        <Reveal delay={120}>
          <NoteCard rot={-1.5} title={<p className="font-sans text-xl font-bold">Free design consultation</p>}>
            <ul className="space-y-2">
              {["Konsultasi desain", "Mockup sebelum produksi", "Revisi sampai cocok"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-yellow ring-1 ring-ink" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </NoteCard>
        </Reveal>
      </div>
    </section>
  );
}
