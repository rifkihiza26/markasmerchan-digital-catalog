import { useEffect, useRef, useState } from "react";

/**
 * Decorative cursor follower. Desktop / fine-pointer only, and disabled for
 * users who prefer reduced motion. Native cursor stays for keyboard users.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    document.body.classList.add("has-custom-cursor");
    setActive(true);

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      setLabel(el ? (el.getAttribute("data-cursor") ?? null) : null);
    };

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <div
        className={
          label
            ? "hairline grid h-16 w-16 place-items-center rounded-full bg-red font-sans text-[11px] font-bold uppercase tracking-widest text-paper transition-all duration-200"
            : "hairline h-3 w-3 rounded-full bg-ink transition-all duration-200"
        }
      >
        {label}
      </div>
    </div>
  );
}
