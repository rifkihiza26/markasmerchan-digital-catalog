import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminProducts,
  useAdminCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-admin-data";
import { slugify } from "@/lib/slug";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products = [], isLoading, error } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Form Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [material, setMaterial] = useState("");
  const [specsText, setSpecsText] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [galleryText, setGalleryText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Delete Alert State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setCategoryId("");
    setShortDesc("");
    setDesc("");
    setMaterial("");
    setSpecsText("");
    setFeaturedImage("");
    setGalleryText("");
    setIsActive(true);
    setIsFeatured(false);
    setSortOrder(0);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setName(p.name || "");
    setSlug(p.slug || "");
    setCategoryId(p.category_id || "");
    setShortDesc(p.short_description || "");
    setDesc(p.description || "");
    setMaterial(p.material || "");
    setSpecsText(Array.isArray(p.specifications) ? p.specifications.join("\n") : "");
    setFeaturedImage(p.featured_image || "");
    setGalleryText(Array.isArray(p.gallery) ? p.gallery.join("\n") : "");
    setIsActive(p.is_active ?? true);
    setIsFeatured(p.is_featured ?? false);
    setSortOrder(p.sort_order ?? 0);
    setIsDialogOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama produk tidak boleh kosong.");
      return;
    }

    const finalSlug = slug.trim() || slugify(name);
    const specsArray = specsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const galleryArray = galleryText
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        await updateProduct.mutateAsync({
          id: editingId,
          name: name.trim(),
          slug: finalSlug,
          category_id: categoryId || null,
          short_description: shortDesc.trim() || null,
          description: desc.trim() || null,
          material: material.trim() || null,
          specifications: specsArray,
          featured_image: featuredImage.trim() || null,
          gallery: galleryArray,
          is_active: isActive,
          is_featured: isFeatured,
          sort_order: Number(sortOrder) || 0,
        });
        toast.success("Produk berhasil diperbarui!");
      } else {
        await createProduct.mutateAsync({
          name: name.trim(),
          slug: finalSlug,
          category_id: categoryId || null,
          short_description: shortDesc.trim() || null,
          description: desc.trim() || null,
          material: material.trim() || null,
          specifications: specsArray,
          featured_image: featuredImage.trim() || null,
          gallery: galleryArray,
          is_active: isActive,
          is_featured: isFeatured,
          sort_order: Number(sortOrder) || 0,
        });
        toast.success("Produk baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan produk.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct.mutateAsync(deletingId);
      toast.success("Produk berhasil dihapus!");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus produk.");
    }
  };

  const handleToggleActive = async (p: any) => {
    try {
      await updateProduct.mutateAsync({
        id: p.id,
        is_active: !p.is_active,
      });
      toast.success(`Status ${p.name} diubah menjadi ${!p.is_active ? "Aktif" : "Nonaktif"}`);
    } catch (err: any) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handleToggleFeatured = async (p: any) => {
    try {
      await updateProduct.mutateAsync({
        id: p.id,
        is_featured: !p.is_featured,
      });
      toast.success(`Featured status ${p.name} diubah.`);
    } catch (err: any) {
      toast.error("Gagal memperbarui featured status.");
    }
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category_id === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Manajemen Produk
          </h1>
          <p className="text-ink/50 text-sm">
            Kelola katalog merchandise, spesifikasi material, galeri foto, dan status penayangan.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper border border-ink/20 rounded-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-ink/40" />
          <Input
            placeholder="Cari nama produk atau slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-note border-ink/20 text-ink rounded-sm h-10"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-56 bg-note border-ink/20 text-ink rounded-sm h-10">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-paper border-ink/20 text-ink">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-paper border border-ink/20 rounded-sm overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-16 text-center text-ink/50 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-ink/40 space-y-3">
            <Package className="h-12 w-12 mx-auto text-ink/30" />
            <p className="text-base font-semibold text-ink/50">Tidak ada produk ditemukan</p>
            <p className="text-xs text-ink/40">Coba ubah kata kunci pencarian atau tambah produk baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink/80">
              <thead className="bg-note text-ink/50 text-xs uppercase font-semibold border-b border-ink/20">
                <tr>
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4 text-center">Urutan</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-sm bg-muted overflow-hidden flex-shrink-0 border border-ink/30 flex items-center justify-center">
                          {p.featured_image ? (
                            <img src={p.featured_image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-ink/40" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-ink text-base">{p.name}</p>
                          <p className="text-xs text-ink/50 font-mono">/products/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-ink/80 border border-ink/30">
                        {p.product_categories?.name || "Umum"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink/50">{p.material || "-"}</td>
                    <td className="px-6 py-4 text-center font-mono text-xs">{p.sort_order}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.is_featured
                            ? "bg-yellow/20 text-ink border border-yellow"
                            : "text-ink/30 hover:text-ink/50"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          p.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-muted text-ink/50 border-ink/30"
                        }`}
                      >
                        {p.is_active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {p.is_active ? "Aktif" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-background text-ink/50 hover:text-ink hover:bg-muted transition-colors"
                          title="Lihat Produk di Web"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(p)}
                          className="text-ink/50 hover:text-ink hover:bg-muted"
                          title="Edit Produk"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(p.id)}
                          className="text-ink/50 hover:text-red-400 hover:bg-red-500/10"
                          title="Hapus Produk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-paper border-ink/20 text-ink max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {editingId ? "Edit Produk Merchandise" : "Tambah Produk Merchandise Baru"}
            </DialogTitle>
            <DialogDescription className="text-ink/50 text-xs">
              Isi detail produk merchandise di bawah ini untuk diperbarui di katalog digital.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Nama Produk *</Label>
                <Input
                  placeholder="Contoh: Heavyweight Custom Hoodie"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">URL Slug *</Label>
                <Input
                  placeholder="heavyweight-custom-hoodie"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="bg-note border-ink/20 text-ink font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Kategori Produk</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="bg-note border-ink/20 text-ink">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-paper border-ink/20 text-ink">
                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Bahan / Material</Label>
                <Input
                  placeholder="Contoh: Cotton Fleece 330gsm"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Deskripsi Singkat</Label>
              <Input
                placeholder="Ringkasan singkat produk untuk preview card..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Deskripsi Lengkap</Label>
              <Textarea
                placeholder="Penjelasan detail keunggulan dan spesifikasi produk..."
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">
                Spesifikasi (1 poin per baris)
              </Label>
              <Textarea
                placeholder="Bahan Cotton Combed 24s&#10;Sablon Plastisol High Density&#10;Jahitan Rantai Standard Distro"
                rows={3}
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                className="bg-note border-ink/20 text-ink font-mono text-xs"
              />
            </div>

            <ImageUploadInput
              label="Foto Utama Produk"
              value={featuredImage}
              onChange={setFeaturedImage}
              folder="products"
              description="Unggah file gambar dari komputer Anda atau gunakan URL."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-ink/20">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Urutan (Sort Order)</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-note border border-ink/20">
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="is-active-toggle">
                  Status Aktif
                </Label>
                <Switch
                  id="is-active-toggle"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-note border border-ink/20">
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="is-featured-toggle">
                  Produk Unggulan (Beranda)
                </Label>
                <Switch
                  id="is-featured-toggle"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-ink/20">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="text-ink/50 hover:text-ink"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {createProduct.isPending || updateProduct.isPending
                  ? "Menyimpan..."
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-paper border-ink/20 text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-ink">
              Hapus Produk Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/50 text-xs">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-ink/30 text-ink/80 hover:bg-slate-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-ink font-semibold"
            >
              Ya, Hapus Produk
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
