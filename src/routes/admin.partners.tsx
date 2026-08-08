import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminPartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from "@/hooks/use-admin-data";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

export const Route = createFileRoute("/admin/partners")({
  component: AdminPartners,
});

function AdminPartners() {
  const { data: partners = [], isLoading } = useAdminPartners();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
    setSortOrder(0);
    setIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setName(p.name || "");
    setLogoUrl(p.logo_url || "");
    setWebsiteUrl(p.website_url || "");
    setSortOrder(p.sort_order ?? 0);
    setIsActive(p.is_active ?? true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama partner wajib diisi.");
      return;
    }

    try {
      if (editingId) {
        await updatePartner.mutateAsync({
          id: editingId,
          name: name.trim(),
          logo_url: logoUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
        });
        toast.success("Partner berhasil diperbarui!");
      } else {
        await createPartner.mutateAsync({
          name: name.trim(),
          logo_url: logoUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
          sort_order: Number(sortOrder) || 0,
          is_active: isActive,
        });
        toast.success("Partner baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan partner.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deletePartner.mutateAsync(deletingId);
      toast.success("Partner berhasil dihapus!");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus partner.");
    }
  };

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Brand Partners & Klien
          </h1>
          <p className="text-ink/50 text-sm">
            Kelola logo partner dan brand yang telah mempercayakan pembuatan merchandise ke MarkasMerchan.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Partner
        </Button>
      </div>

      {/* Search */}
      <div className="bg-paper border border-ink/20 rounded-sm p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-ink/40" />
          <Input
            placeholder="Cari nama partner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-note border-ink/20 text-ink rounded-sm h-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-ink/50 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data partner...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ink/40 bg-paper rounded-sm border border-ink/20">
            Belum ada partner terdaftar.
          </div>
        ) : (
          filteredPartners.map((p) => (
            <div
              key={p.id}
              className="bg-paper border border-ink/20 rounded-sm p-5 hover:border-ink/30 transition-all flex flex-col items-center text-center space-y-3"
            >
              <div className="h-20 w-full rounded-sm bg-note border border-ink/20 flex items-center justify-center p-3 overflow-hidden">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <Users className="h-8 w-8 text-ink/30" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-ink text-base">{p.name}</h3>
                {p.website_url && (
                  <a
                    href={p.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    Kunjungi Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="pt-3 border-t border-ink/15 w-full flex items-center justify-between text-xs text-ink/50">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.is_active
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-muted text-ink/50"
                  }`}
                >
                  {p.is_active ? "Aktif" : "Nonaktif"}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(p)}
                    className="text-ink/50 hover:text-ink h-7 w-7"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(p.id)}
                    className="text-ink/50 hover:text-red-400 h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-paper border-ink/20 text-ink max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink">
              {editingId ? "Edit Brand Partner" : "Tambah Brand Partner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">Nama Partner / Brand *</Label>
              <Input
                placeholder="Contoh: Gojek Indonesia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">URL Logo Image</Label>
              <Input
                placeholder="https://..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-ink/80">URL Website Partner (Opsional)</Label>
              <Input
                placeholder="https://partnerbrand.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="bg-note border-ink/20 text-ink"
              />
            </div>

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
                <Label className="text-xs font-semibold text-ink/80 cursor-pointer" htmlFor="partner-active">
                  Aktif
                </Label>
                <Switch id="partner-active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-ink/20">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createPartner.isPending || updatePartner.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Partner"}
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
              Hapus Partner Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/50 text-xs">
              Partner ini akan dihapus dari daftar.
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
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
