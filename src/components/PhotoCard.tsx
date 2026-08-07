import { cn } from "@/lib/utils";

/**
 * A "screenshot pasted onto the page" frame, matching the reference:
 * thin border, drop shadow, small filename caption underneath.
 * When no asset exists yet it renders a clearly labelled placeholder.
 */
export function PhotoCard({
  src,
  alt,
  caption,
  rot = 0,
  className,
  ratio = "aspect-[4/5]",
  placeholder = "ASSET NEEDED",
  float = false,
}: {
  src?: string | null;
  alt: string;
  caption?: string | null;
  rot?: number;
  className?: string;
  ratio?: string;
  placeholder?: string;
  float?: boolean;
}) {
  return (
    <figure
      className={cn("group inline-block", float && "float", className)}
      style={{ ["--rot" as string]: `${rot}deg`, transform: float ? undefined : `rotate(${rot}deg)` }}
    >
      <div className="hairline shadow-soft overflow-hidden bg-paper p-1">
        <div className={cn("grain relative w-full overflow-hidden bg-muted", ratio)}>
          {src ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center px-3 text-center">
              <span className="font-sans text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-muted-foreground">
                {placeholder}
                <span className="mt-1 block font-normal normal-case tracking-normal">{alt}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-1 inline-block bg-paper/80 px-1 font-sans text-[10px] tracking-wide text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
