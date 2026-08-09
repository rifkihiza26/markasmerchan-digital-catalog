import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSiteContext } from "@/hooks/useSiteContext";

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  const { site } = useSiteContext();
  const text = site.landing_page_content?.marquee?.text ?? "slay & serve";

  return (
    <div
      aria-hidden="true"
      className={cn("hairline grain overflow-hidden border-x-0 bg-yellow py-3", className)}
    >
      <div className="marquee-track gap-10 whitespace-nowrap font-sans text-sm font-bold uppercase tracking-[0.25em]">
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex gap-10 pr-10">
            {Array.from({ length: 6 }).map((__, j) => (
              <span key={j} className="flex items-center gap-10">
                <span>{children}</span>
                <span className="font-serif italic normal-case tracking-normal">{text}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
