import { Reveal } from "./Reveal";
import { PhotoCard } from "./PhotoCard";
import type { PublicProject } from "@/lib/content-types";

const spanClass: Record<string, string> = {
  lg: "sm:col-span-2 sm:row-span-2",
  md: "sm:col-span-2",
  sm: "",
};

/** Keeps the original scrapbook rhythm regardless of how many projects exist. */
const pattern = [
  { span: "lg", rot: -2 },
  { span: "sm", rot: 1.5 },
  { span: "md", rot: -1 },
  { span: "sm", rot: 2 },
  { span: "md", rot: -1.5 },
  { span: "sm", rot: 1 },
] as const;

export function ProjectGallery({ projects }: { projects: PublicProject[] }) {
  if (!projects.length) return null;

  return (
    <section aria-labelledby="projects-title" className="grain bg-paper px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="projects-title" className="font-sans text-[clamp(2rem,6.5vw,4rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Our recent <span className="font-serif italic lowercase">project</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {projects.map((p, i) => {
            const shape = pattern[i % pattern.length]!;
            return (
              <Reveal key={p.id} delay={i * 60} className={spanClass[shape.span]}>
                <PhotoCard
                  src={p.image_url}
                  alt={p.title}
                  caption={p.client_name ?? p.title}
                  rot={shape.rot}
                  ratio={shape.span === "lg" ? "aspect-square" : "aspect-[4/5]"}
                  className="w-full"
                  placeholder="PROJECT IMAGE NEEDED"
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
