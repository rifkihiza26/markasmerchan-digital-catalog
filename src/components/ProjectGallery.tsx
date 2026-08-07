import { Reveal } from "./Reveal";
import { PhotoCard } from "./PhotoCard";
import { projects } from "@/data/projects";

const spanClass: Record<string, string> = {
  lg: "sm:col-span-2 sm:row-span-2",
  md: "sm:col-span-2",
  sm: "",
};

export function ProjectGallery() {
  return (
    <section aria-labelledby="projects-title" className="grain bg-paper px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="projects-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Our recent <span className="font-serif italic lowercase">project</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 60} className={spanClass[p.span]}>
              <PhotoCard
                alt={p.label ?? `Project ${i + 1}`}
                caption={p.label ?? "project.jpg"}
                rot={p.rot}
                ratio={p.span === "lg" ? "aspect-square" : "aspect-[4/5]"}
                className="w-full"
                placeholder="PROJECT IMAGE NEEDED"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
