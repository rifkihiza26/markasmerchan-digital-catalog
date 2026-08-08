import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useAdminProducts,
  useAdminCategories,
  useAdminProjects,
  useAdminPartners,
} from "@/hooks/use-admin-data";
import {
  Package,
  FolderTree,
  Briefcase,
  Users,
  Plus,
  ArrowUpRight,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useAdminProducts();
  const { data: categories = [], isLoading: loadingCategories } = useAdminCategories();
  const { data: projects = [], isLoading: loadingProjects } = useAdminProjects();
  const { data: partners = [], isLoading: loadingPartners } = useAdminPartners();

  const activeProducts = products.filter((p) => p.is_active);
  const featuredProducts = products.filter((p) => p.is_featured);

  const stats = [
    {
      title: "TOTAL PRODUK",
      value: products.length,
      subtitle: `${activeProducts.length} aktif, ${featuredProducts.length} featured`,
      icon: Package,
      color: "bg-sky/10 text-sky border-sky/30",
      href: "/admin/products",
    },
    {
      title: "KATEGORI PRODUK",
      value: categories.length,
      subtitle: `${categories.filter((c) => c.is_active).length} kategori aktif`,
      icon: FolderTree,
      color: "bg-green-50 text-green-700 border-green-200",
      href: "/admin/categories",
    },
    {
      title: "PROJECT PORTFOLIO",
      value: projects.length,
      subtitle: `${projects.filter((p) => p.is_active).length} ditampilkan di web`,
      icon: Briefcase,
      color: "bg-violet/10 text-violet border-violet/30",
      href: "/admin/projects",
    },
    {
      title: "BRAND PARTNERS",
      value: partners.length,
      subtitle: `${partners.filter((p) => p.is_active).length} logo partner aktif`,
      icon: Users,
      color: "bg-yellow/20 text-ink border-yellow",
      href: "/admin/partners",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-ink/15">
        <div>
          <h1 className="text-2xl font-bold font-sans text-ink tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-ink/50 mt-0.5">Ringkasan katalog digital dan manajemen konten.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/products">
            <button className="h-9 px-3.5 bg-ink text-paper font-bold text-xs rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Tambah Produk
            </button>
          </Link>
          <Link to="/admin/projects">
            <button className="h-9 px-3.5 bg-paper border border-ink text-ink font-bold text-xs rounded-sm hover:bg-note transition-colors flex items-center gap-1.5">
              <FolderPlus className="h-3.5 w-3.5" />
              Tambah Project
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.href}
              className="bg-paper border border-ink/20 rounded-sm p-4 hover:border-ink transition-all duration-150 group block"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-sm ${stat.color} border`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink/30 group-hover:text-ink transition-colors" />
              </div>
              <div className="mt-3 space-y-0.5">
                <p className="text-ink/50 text-[11px] font-bold tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-black text-ink tracking-tight">{stat.value}</h3>
                <p className="text-xs text-ink/50">{stat.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 bg-paper border border-ink/20 rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <div>
              <h2 className="text-base font-bold text-ink">Produk Terbaru</h2>
              <p className="text-xs text-ink/50">Item merchandise yang baru ditambahkan ke katalog</p>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-violet hover:underline">
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-2.5">
            {loadingProducts ? (
              <div className="py-8 text-center text-ink/40 text-sm">Memuat data produk...</div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-ink/40 text-sm bg-note rounded-sm border border-ink/15">
                Belum ada produk. Klik "Tambah Produk" untuk menambahkan produk baru.
              </div>
            ) : (
              products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-sm bg-note border border-ink/15 hover:border-ink/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-sm bg-paper border border-ink/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.featured_image ? (
                        <img
                          src={product.featured_image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-ink/40" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink truncate">{product.name}</p>
                      <p className="text-xs text-ink/50 truncate font-mono">
                        {product.product_categories?.name || "Tanpa Kategori"} • /{product.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.is_active
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-muted text-ink/50"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Draft"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-paper border border-ink/20 rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <h2 className="text-base font-bold text-ink">Kategori Produk</h2>
            <Link to="/admin/categories" className="text-xs font-bold text-violet hover:underline">
              Kelola →
            </Link>
          </div>
          <div className="space-y-2">
            {loadingCategories ? (
              <div className="py-4 text-center text-ink/40 text-xs">Memuat kategori...</div>
            ) : categories.length === 0 ? (
              <div className="text-xs text-ink/40 py-2">Belum ada kategori.</div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between text-xs py-2.5 px-3 rounded-sm bg-note border border-ink/10"
                >
                  <span className="font-bold text-ink">{cat.name}</span>
                  <span className="text-ink/40 font-mono">/{cat.slug}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
