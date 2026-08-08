import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Briefcase,
  Users,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Menu,
  X,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

/* Inline ransom-note logo for sidebar — matches brand Logo.tsx */
const COLORS = ["bg-red", "bg-sky", "bg-yellow", "bg-violet", "bg-ink", "bg-paper"];
const FG = ["text-paper", "text-ink", "text-ink", "text-paper", "text-yellow", "text-red"];

function SidebarLetters({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <span className="inline-flex flex-wrap justify-center">
      {word.split("").map((ch, i) => {
        const k = (i + offset) % COLORS.length;
        const rot = ((i + offset) % 5) - 2;
        return (
          <span
            key={`${ch}-${i}`}
            className={`hairline inline-block px-[0.10em] py-[0.01em] leading-[0.9] ${COLORS[k]} ${FG[k]} ${i % 2 === 0 ? "font-serif italic" : "font-sans"}`}
            style={{ transform: `rotate(${rot}deg) translateY(${(i % 3) - 1}px)` }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

function SidebarLogo() {
  return (
    <span className="inline-flex flex-col items-center font-bold uppercase text-lg leading-none">
      <span className="sr-only">MarkasMerchan</span>
      <span aria-hidden="true" className="-mb-[0.08em]">
        <SidebarLetters word="MARKAS" />
      </span>
      <span aria-hidden="true">
        <SidebarLetters word="MERCHAN" offset={3} />
      </span>
    </span>
  );
}

function AdminLayout() {
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-violet mb-3" />
        <p className="text-ink/50 font-sans text-sm animate-pulse">Memuat Admin Panel MarkasMerchan...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-sm w-full text-center space-y-5 bg-paper border border-ink rounded-sm shadow-cut p-8">
          <div className="w-12 h-12 bg-red/10 text-red rounded-sm flex items-center justify-center mx-auto border border-red/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Akses Terbatas</h1>
            <p className="text-ink/50 text-sm mt-1">
              Anda harus login sebagai administrator untuk mengakses halaman ini.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/admin/login" })}
            className="w-full h-10 bg-ink text-paper font-bold text-sm rounded-sm shadow-cut hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Pergi ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Projects / Portfolio", href: "/admin/projects", icon: Briefcase },
    { label: "Partners & Clients", href: "/admin/partners", icon: Users },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-paper border-b border-ink sticky top-0 z-50">
        <SidebarLogo />
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-sm border border-ink/30 text-ink hover:bg-note transition-colors"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-60 bg-paper border-r border-ink flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "100dvh" }}
      >
        {/* Sidebar Header — logo */}
        <div className="p-5 border-b border-ink/20 flex items-center justify-between">
          <Link to="/admin" onClick={() => setIsMobileOpen(false)}>
            <SidebarLogo />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30 border border-ink/20 rounded-sm px-1.5 py-0.5 ml-2">
            CMS
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-ink text-paper border-ink shadow-[2px_2px_0_0_theme(colors.sky)] font-bold"
                    : "text-ink/60 hover:text-ink hover:bg-note border-transparent hover:border-ink/20"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-paper" : "text-ink/50"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-ink/20 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-sm bg-note border border-ink/20 text-xs font-medium text-ink/70 hover:text-ink hover:border-ink/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-sky" />
              View Storefront
            </span>
            <ExternalLink className="h-3 w-3 text-ink/40" />
          </a>

          <div className="flex items-center justify-between px-1 pt-1 border-t border-ink/10">
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-semibold text-ink truncate">{user?.email || "Admin User"}</p>
              <span className="text-[10px] text-green-600 font-medium">● Logged in</span>
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 rounded-sm border border-transparent text-ink/40 hover:text-red hover:border-red/30 hover:bg-red/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
