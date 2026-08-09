import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminMediaAssets,
  useUploadMediaAsset,
  useDeleteMediaAsset,
} from "@/hooks/use-admin-data";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const { data: mediaAssets = [], isLoading } = useAdminMediaAssets();
  const uploadMedia = useUploadMediaAsset();
  const deleteMedia = useDeleteMediaAsset();

  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<{ id: string; path: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;
    try {
      toast.loading("Mengunggah file media...", { id: "upload-toast" });
      await uploadMedia.mutateAsync({ file, folder: "products" });
      toast.success("File media berhasil diunggah!", { id: "upload-toast" });
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah media.", { id: "upload-toast" });
    } finally {
      e.target.value = "";
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL media berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAsset) return;
    try {
      await deleteMedia.mutateAsync(deletingAsset);
      toast.success("Media berhasil dihapus!");
      setDeletingAsset(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus media.");
    }
  };

  const filteredAssets = mediaAssets.filter(
    (asset) =>
      asset.file_name.toLowerCase().includes(search.toLowerCase()) ||
      asset.public_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Media Library
          </h1>
          <p className="text-ink/50 text-sm">
            Unggah dan kelola aset gambar produk, logo, dan file galeri merchandise.
          </p>
        </div>

        <div>
          <input
            type="file"
            id="media-upload-input"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadMedia.isPending}
            className="hidden"
          />
          <label
            htmlFor="media-upload-input"
            className={`h-10 px-4 bg-ink text-paper font-bold text-xs rounded-sm shadow-cut hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer inline-flex items-center gap-2 ${
              uploadMedia.isPending ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploadMedia.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploadMedia.isPending ? "Mengunggah..." : "Upload Media Baru"}</span>
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="bg-paper border border-ink/20 rounded-sm p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-ink/40" />
          <Input
            placeholder="Cari nama file media..."
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
            <p className="text-sm">Memuat aset media...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ink/40 bg-paper rounded-sm border border-ink/20 space-y-2">
            <ImageIcon className="h-10 w-10 mx-auto text-ink/30" />
            <p className="text-sm font-semibold text-ink/50">Belum ada file media</p>
            <p className="text-xs text-ink/40">Klik "Upload Media Baru" untuk mengunggah gambar.</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-paper border border-ink/20 rounded-sm overflow-hidden hover:border-ink/30 transition-all flex flex-col justify-between group"
            >
              <div className="h-44 w-full bg-note relative overflow-hidden flex items-center justify-center p-2">
                {asset.mime_type?.startsWith("image/") || asset.public_url.match(/\.(jpg|jpeg|png|webp|gif|svg)/i) ? (
                  <img
                    src={asset.public_url}
                    alt={asset.file_name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-ink/30" />
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-ink truncate" title={asset.file_name}>
                  {asset.file_name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-ink/40 font-mono">
                  <span>{asset.size_bytes ? `${Math.round(asset.size_bytes / 1024)} KB` : "-"}</span>
                  <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-3 border-t border-ink/15 bg-note flex items-center justify-between gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyUrl(asset.public_url, asset.id)}
                  className="text-ink/80 hover:text-ink hover:bg-muted text-xs flex items-center gap-1.5 flex-1 justify-center"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-ink/50" />
                      <span>Salin URL</span>
                    </>
                  )}
                </Button>

                <a
                  href={asset.public_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-ink/50 hover:text-ink hover:bg-muted rounded-lg"
                  title="Buka Gambar"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingAsset({ id: asset.id, path: asset.path })}
                  className="text-ink/50 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                  title="Hapus Media"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingAsset} onOpenChange={(open) => !open && setDeletingAsset(null)}>
        <AlertDialogContent className="bg-paper border-ink/20 text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-ink">
              Hapus File Media Ini?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/50 text-xs">
              File ini akan dihapus permanen. Gambar yang memakai URL file ini mungkin tidak dapat ditampilkan.
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
              Ya, Hapus Media
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
