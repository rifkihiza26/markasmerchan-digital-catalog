import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-admin-data";
import { slugify } from "@/lib/slug";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { toast } from "sonner";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDesc("");
    setImageUrl("");
    setSortOrder(0);
    setIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id);
    setName(c.name || "");
    setSlug(c.slug || "");
    setDesc(c.description || "");
    setImageUrl(c.image_url || "");
    setSortOrder(c.sort_order ?? 0);
    setIsActive(c.is_active ?? true);
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
      toast.error("Nama kategori wajib diisi.");
      return;
    }

    const finalSlug = slug.trim() || slugify(name);

    try {
      if (editingId) {
        await updateCategory.mutateAsync({
          id: editingId,
          name: name.trim(),
          slug: finalSlug,
          description: desc.trim() || null,
          image_url: imageUrl.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
        });
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await createCategory.mutateAsync({
          name: name.trim(),
          slug: finalSlug,
          description: desc.trim() || null,
          image_url: imageUrl.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
        });
        toast.success("Kategori baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan kategori.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteCategory.mutateAsync(deletingId);
      toast.success("Kategori berhasil dihapus!");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus kategori.");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-primary" />
            Kategori Produk
          </h1>
          <p className="text-ink/50 text-sm">
            Kelola kategori produk merchandise (Contoh: Apparel, Accessories, Drinkware, dll).
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Search */}
      <div className="bg-paper border border-ink/20 rounded-sm p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-ink/40" />
          <Input
            placeholder="Cari nama kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-note border-ink/20 text-ink rounded-sm h-10"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-ink/50 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data kategori...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-ink/40 bg-paper rounded-sm border border-ink/20">
            Belum ada kategori.
          </div>
        ) : (
          filteredCategories.map((c) => (
            <div
              key={c.id}
              className="bg-paper border border-ink/20 rounded-sm p-5 space-y-4 hover:border-ink/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-ink/30">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <FolderTree className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-base">{c.name}</h3>
                    <p className="text-xs text-ink/50 font-mono">/{c.slug}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.is_active
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-muted text-ink/50"
                  }`}
                >
                  {c.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {c.description && (
                <p className="text-xs text-ink/50 line-clamp-2">{c.description}</p>
              )}

              <div className="pt-3 border-t border-ink/15 flex items-center justify-between text-xs text-ink/40">
                <span>Urutan: {c.sort_order}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(c)}
                    className="text-ink/50 hover:text-ink h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(c.id)}
                    className="text-ink/50 hover:text-red-400 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-paper border-ink/20 text-ink max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink">
              {editingId ? "Edit Kategori Produk" : "Tambah Kategori Produk"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Nama Kategori *</Label>
              <Input
                placeholder="Contoh: Apparel & Outerwear"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Slug *</Label>
              <Input
                placeholder="apparel-outerwear"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="bg-note border-ink/20 text-ink font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Deskripsi</Label>
              <Textarea
                placeholder="Keterangan singkat kategori..."
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <ImageUploadInput
              label="Foto Kategori"
              value={imageUrl}
              onChange={setImageUrl}
              folder="categories"
              description="Unggah gambar sampul untuk kategori ini."
            />

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ink/20">
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
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="cat-active">
                  Aktif
                </Label>
                <Switch id="cat-active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-ink/20">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-paper border-ink/20 text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-ink">
              Hapus Kategori Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/50 text-xs">
              Produk yang menggunakan kategori ini akan dialihkan ke tanpa kategori.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-ink/30 text-ink/80">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-ink font-semibold"
            >
              Ya, Hapus Kategori
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
