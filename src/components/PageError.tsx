import { Link } from "@tanstack/react-router";

export function PageError({
  title = "Konten gagal dimuat",
  message = "Ada kendala saat mengambil data. Coba muat ulang halaman sebentar lagi.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <section className="grain grid min-h-[60vh] place-items-center bg-paper px-4 py-32">
      <div className="max-w-md text-center">
        <h1 className="font-sans text-3xl font-bold uppercase tracking-tight">{title}</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">{message}</p>
        <Link
          to="/"
          className="hairline shadow-cut mt-8 inline-block rounded-full bg-yellow px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em]"
        >
          Kembali ke home
        </Link>
      </div>
    </section>
  );
}
