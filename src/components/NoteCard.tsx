import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Apple-Notes style card used throughout the reference layout. */
export function NoteCard({
  title,
  children,
  className,
  rot = 0,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  rot?: number;
}) {
  return (
    <div
      className={cn("shadow-soft rounded-md bg-note p-4 sm:p-6", className)}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div className="mb-3 flex items-center justify-between text-muted-foreground">
        <span className="font-sans text-xs font-medium">‹ Notes</span>
        <span aria-hidden="true" className="flex items-center gap-2 text-xs">
          <span className="inline-block h-4 w-4 rounded-full border border-current" />
          <span className="inline-block h-4 w-4 rounded-full border border-current" />
        </span>
      </div>
      {title ? <div className="mb-2">{title}</div> : null}
      <div className="font-sans text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}
