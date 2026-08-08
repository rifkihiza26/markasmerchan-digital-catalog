import { NoteCard } from "./NoteCard";
import { Reveal } from "./Reveal";
import { PhotoCard } from "./PhotoCard";
import { useSiteContext, useWaLink } from "@/hooks/useSiteContext";
import { instagramHandle } from "@/lib/content-defaults";

const NOT_SET = "Belum diisi";

export function ContactSection() {
  const { contact } = useSiteContext();
  const wa = useWaLink();

  return (
    <section aria-labelledby="contact-title" className="grain bg-red px-4 py-20 text-paper sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <NoteCard
            rot={-1.5}
            className="max-w-md text-ink"
            title={
              <h2 id="contact-title" className="font-sans text-3xl font-bold">
                Contact <span className="marker font-serif italic">Us</span>
              </h2>
            }
          >
            Ready to make something memorable? Kabarin kebutuhan merch lo, kami bantu dari
            konsultasi sampai produksi.
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="hairline rounded-full bg-ink px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-paper"
              >
                WhatsApp us
              </a>
              {contact.instagram_url ? (
                <a
                  href={contact.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hairline rounded-full bg-yellow px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em]"
                >
                  Instagram
                </a>
              ) : null}
            </div>
          </NoteCard>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="font-sans text-xl font-bold">Informasi kontak</h3>
          <dl className="mt-5 space-y-4 font-sans text-sm">
            <div>
              <dt className="font-bold uppercase tracking-[0.16em] text-paper/70">WhatsApp</dt>
              <dd>{contact.whatsapp_number ?? NOT_SET}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.16em] text-paper/70">Instagram</dt>
              <dd>{instagramHandle(contact.instagram_url) ?? NOT_SET}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.16em] text-paper/70">Email</dt>
              <dd>{contact.email ?? NOT_SET}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-[0.16em] text-paper/70">Alamat</dt>
              <dd>{contact.address ?? NOT_SET}</dd>
            </div>
            {contact.business_hours ? (
              <div>
                <dt className="font-bold uppercase tracking-[0.16em] text-paper/70">Jam operasional</dt>
                <dd>{contact.business_hours}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 hidden w-40 sm:block">
            <PhotoCard alt="Brand photo" caption="slay.png" rot={3} placeholder="BRAND PHOTO" />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-6xl">
        <Reveal>
          <p className="font-sans text-[clamp(2.2rem,9vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight">
            See u in the <span className="font-serif italic lowercase">next step</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
