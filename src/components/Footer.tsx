import { Link } from "@tanstack/react-router";
import { useSiteContext, useWaLink } from "@/hooks/useSiteContext";

export function Footer() {
  const { site, contact } = useSiteContext();
  const wa = useWaLink();

  return (
    <footer className="grain hairline border-x-0 border-b-0 bg-ink px-4 py-14 text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-sans text-2xl font-bold uppercase tracking-tight">{site.brand_name}</p>
          <p className="mt-1 font-serif text-lg italic text-yellow">{site.description}</p>
          <p className="mt-4 max-w-xs font-sans text-sm text-paper/70">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="font-sans text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-paper/50">Menu</p>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow">Home</Link></li>
            <li><Link to="/products" className="hover:text-yellow">Our Product</Link></li>
            <li><Link to="/about" className="hover:text-yellow">About us</Link></li>
            <li><Link to="/contact" className="hover:text-yellow">Contact</Link></li>
          </ul>
        </nav>

        <div className="font-sans text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-paper/50">Social</p>
          <ul className="space-y-2">
            {contact.instagram_url ? (
              <li>
                <a
                  href={contact.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-yellow"
                >
                  Instagram
                </a>
              </li>
            ) : null}
            <li>
              <a href={wa} target="_blank" rel="noreferrer" className="hover:text-yellow">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="font-sans text-xs text-paper/50">
          <p>© {new Date().getFullYear()} {site.brand_name}.</p>
          <p className="mt-2">{site.footer_text}</p>
        </div>
      </div>
    </footer>
  );
}
