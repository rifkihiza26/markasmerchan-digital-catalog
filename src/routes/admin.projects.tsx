import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/use-admin-data";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Image as ImageIcon,
  Loader2,
  Calendar,
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

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const { data: projects = [], isLoading } = useAdminProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryText, setGalleryText] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("");
    setClientName("");
    setProjectDate("");
    setDesc("");
    setImageUrl("");
    setGalleryText("");
    setSortOrder(0);
    setIsActive(true);
    setIsFeatured(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setSlug(p.slug || "");
    setCategory(p.category || "");
    setClientName(p.client_name || "");
    setProjectDate(p.project_date || "");
    setDesc(p.description || "");
    setImageUrl(p.image_url || "");
    setGalleryText(Array.isArray(p.gallery) ? p.gallery.join("\n") : "");
    setSortOrder(p.sort_order ?? 0);
    setIsActive(p.is_active ?? true);
    setIsFeatured(p.is_featured ?? false);
    setIsDialogOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul project wajib diisi.");
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    const galleryArray = galleryText
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        await updateProject.mutateAsync({
          id: editingId,
          title: title.trim(),
          slug: finalSlug,
          category: category.trim() || null,
          client_name: clientName.trim() || null,
          project_date: projectDate.trim() || null,
          description: desc.trim() || null,
          image_url: imageUrl.trim() || null,
          gallery: galleryArray,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
          is_featured: isFeatured,
        });
        toast.success("Project berhasil diperbarui!");
      } else {
        await createProject.mutateAsync({
          title: title.trim(),
          slug: finalSlug,
          category: category.trim() || null,
          client_name: clientName.trim() || null,
          project_date: projectDate.trim() || null,
          description: desc.trim() || null,
          image_url: imageUrl.trim() || null,
          gallery: galleryArray,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
          is_featured: isFeatured,
        });
        toast.success("Project baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan project.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteProject.mutateAsync(deletingId);
      toast.success("Project berhasil dihapus!");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus project.");
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Portfolio & Client Projects
          </h1>
          <p className="text-ink/50 text-sm">
            Kelola dokumentasi hasil kerja custom merch untuk klien dan event besar.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Project
        </Button>
      </div>

      {/* Search */}
      <div className="bg-paper border border-ink/20 rounded-sm p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-ink/40" />
          <Input
            placeholder="Cari judul project atau nama klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-note border-ink/20 text-ink rounded-sm h-10"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-ink/50 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data project...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ink/40 bg-paper rounded-sm border border-ink/20">
            Belum ada project portfolio.
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-paper border border-ink/20 rounded-sm overflow-hidden hover:border-ink/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full bg-note relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-ink/30">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {p.is_featured && (
                      <span className="p-1.5 rounded-lg bg-yellow text-ink font-bold text-xs shadow-md">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                        p.is_active
                          ? "bg-green-50 text-green-700 border border-emerald-500/30"
                          : "bg-background text-ink/50"
                      }`}
                    >
                      {p.is_active ? "Aktif" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-primary font-semibold">
                    <span>{p.category || "General"}</span>
                    {p.client_name && <span className="text-ink/50">Klien: {p.client_name}</span>}
                  </div>
                  <h3 className="font-bold text-ink text-lg leading-tight">{p.title}</h3>
                  {p.description && (
                    <p className="text-xs text-ink/50 line-clamp-2">{p.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-ink/15 bg-note flex items-center justify-between text-xs text-ink/50">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-ink/40" />
                  {p.project_date || "-"}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(p)}
                    className="text-ink/50 hover:text-ink h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(p.id)}
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
        <DialogContent className="bg-paper border-ink/20 text-ink max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink">
              {editingId ? "Edit Project Portfolio" : "Tambah Project Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Judul Project *</Label>
              <Input
                placeholder="Contoh: Merch Official Soundrenaline 2026"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Nama Klien / Partner</Label>
                <Input
                  placeholder="Contoh: Kilau Indonesia"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Kategori Project</Label>
                <Input
                  placeholder="Contoh: Event Merchandise"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Tanggal / Tahun Project</Label>
                <Input
                  placeholder="Contoh: Maret 2026"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink/80">Urutan (Sort Order)</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="bg-note border-ink/20 text-ink"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Deskripsi Project</Label>
              <Textarea
                placeholder="Cerita dan rincian pengerjaan project..."
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">URL Gambar Utama</Label>
              <Input
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">URL Galeri (1 URL per baris)</Label>
              <Textarea
                placeholder="https://.../1.jpg&#10;https://.../2.jpg"
                rows={2}
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                className="bg-note border-ink/20 text-ink font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ink/20">
              <div className="flex items-center justify-between p-3 rounded-sm bg-note border border-ink/20">
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="proj-active">
                  Aktif Ditampilkan
                </Label>
                <Switch id="proj-active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-sm bg-note border border-ink/20">
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="proj-featured">
                  Featured Showcase
                </Label>
                <Switch id="proj-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-ink/20">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createProject.isPending || updateProject.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Project"}
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
              Hapus Project Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/50 text-xs">
              Project ini akan dihapus permanen dari portofolio.
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
              Ya, Hapus Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
