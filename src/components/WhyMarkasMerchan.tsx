import { Reveal } from "./Reveal";

const values = [
  { title: "One Stop Solution", color: "bg-sky", rot: -1.5 },
  { title: "Lengkap & Praktis", color: "bg-yellow", rot: 1.2 },
  { title: "Harga Transparan", color: "bg-paper", rot: -0.8 },
  { title: "Proses Jelas", color: "bg-yellow", rot: 1.8 },
  { title: "Mudah Dihubungi", color: "bg-paper", rot: -2 },
  { title: "Gratis Konsultasi Desain", color: "bg-red", rot: 1 },
];

export function WhyMarkasMerchan() {
  return (
    <section aria-labelledby="why-title" className="grain bg-sky px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 id="why-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Why <span className="font-serif italic lowercase">markasmerchan?</span>
          </h2>
        </Reveal>

        <ul className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {values.map((v, i) => (
            <li key={v.title} className="max-w-[15rem] flex-1 basis-56">
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
