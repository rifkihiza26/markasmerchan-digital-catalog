import { cn } from "@/lib/utils";

const COLORS = ["bg-red", "bg-sky", "bg-yellow", "bg-violet", "bg-ink", "bg-paper"];
const FG = ["text-paper", "text-ink", "text-ink", "text-paper", "text-yellow", "text-red"];

function Letters({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <span className="inline-flex flex-wrap justify-center">
      {word.split("").map((ch, i) => {
        const k = (i + offset) % COLORS.length;
        const rot = ((i + offset) % 5) - 2;
        return (
          <span
            key={`${ch}-${i}`}
            className={cn(
              "hairline inline-block px-[0.12em] py-[0.02em] leading-[0.9]",
              COLORS[k],
              FG[k],
              i % 2 === 0 ? "font-serif italic" : "font-sans",
            )}
            style={{ transform: `rotate(${rot}deg) translateY(${(i % 3) - 1}px)` }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

/** Ransom-note / cut-out wordmark, per the brand reference. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center font-bold uppercase", className)}>
      <span className="sr-only">MarkasMerchan</span>
      <span aria-hidden="true" className="-mb-[0.12em]">
        <Letters word="MARKAS" />
      </span>
      <span aria-hidden="true">
        <Letters word="MERCHAN" offset={3} />
      </span>
    </span>
  );
}
