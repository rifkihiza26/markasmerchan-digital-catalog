import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Our Product" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);

  const pill =
    "hairline rounded-full bg-paper/80 px-5 py-2 font-sans text-sm backdrop-blur transition-colors hover:bg-yellow";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4">
      <nav aria-label="Utama" className="pointer-events-auto mx-auto max-w-5xl">
        <div className="hidden items-center justify-center gap-3 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className={pill}
              activeProps={{ className: "bg-sky font-bold" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 md:hidden">
          <Link to="/" className={cn(pill, "font-bold uppercase tracking-tight")}>
            MarkasMerchan
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="hairline grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper/80 backdrop-blur"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <ul id="mobile-nav" className="mt-3 flex flex-col gap-2 md:hidden">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                  className={cn(pill, "block w-full text-center")}
                  activeProps={{ className: "bg-sky font-bold" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
