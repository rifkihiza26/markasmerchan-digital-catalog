import { useState, useRef } from "react";
import { Upload, X, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { uploadMediaFile } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  folder?: string;
  aspectRatio?: "square" | "video" | "auto";
  className?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  label,
  description,
  folder = "uploads",
  aspectRatio = "auto",
  className = "",
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, WEBP, SVG, dll)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");
      return;
    }

    try {
      setUploading(true);
      const { path, url } = await uploadMediaFile(file, folder);

      // Register in the media library so it can be reused later (non-blocking).
      await supabase.from("media_assets").insert({
        file_name: file.name,
        path,
        public_url: url,
        mime_type: file.type,
        size_bytes: file.size,
        folder,
      });

      onChange(url);
      toast.success("Foto berhasil diunggah!");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl("");
      toast.success("URL Gambar telah diterapkan");
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-ink uppercase tracking-widest block">
          {label}
        </label>
      )}

      {/* Upload Box / Preview Frame */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${folder}-${label || "img"}`}
        />

        {value ? (
          /* State 1: Photo uploaded - Display image preview with frame */
          <div className="relative rounded-sm border border-ink/20 bg-note overflow-hidden group p-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-16 w-16 rounded-sm border border-ink/20 bg-paper overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt={label || "Preview"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink truncate">Foto Terpasang</p>
                <p className="text-[11px] text-ink/50 truncate font-mono max-w-[200px] md:max-w-[300px]">
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 bg-paper border border-ink text-ink font-bold text-xs rounded-sm hover:bg-muted transition-colors flex items-center gap-1"
              >
                <Upload className="h-3.5 w-3.5" />
                Ganti
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-ink/40 hover:text-red hover:bg-red/10 rounded-sm transition-colors"
                title="Hapus foto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* State 2: No photo uploaded - Display elegant frame placeholder */
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="border-2 border-dashed border-ink/20 hover:border-ink/50 bg-note hover:bg-paper rounded-sm p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 group"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-violet" />
                <p className="text-xs font-bold text-ink animate-pulse">Mengunggah gambar...</p>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-paper border border-ink/20 group-hover:border-ink flex items-center justify-center transition-colors">
                  <Upload className="h-5 w-5 text-ink/50 group-hover:text-ink transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Klik untuk Upload Foto</p>
                  <p className="text-[11px] text-ink/40 mt-0.5">
                    PNG, JPG, WEBP atau SVG (Maks. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL Alternate Toggle */}
      {!showUrlInput ? (
        <div className="flex items-center justify-between text-[11px] text-ink/50">
          {description && <span>{description}</span>}
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-violet font-semibold hover:underline flex items-center gap-1 ml-auto"
          >
            <LinkIcon className="h-3 w-3" />
            Atau masukkan URL
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-ink/10">
          <Input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="h-8 text-xs bg-paper border-ink/30 focus:border-violet"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="h-8 px-3 bg-ink text-paper font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1"
          >
            <Check className="h-3.5 w-3.5" />
            Terapkan
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="h-8 p-1.5 text-ink/40 hover:text-ink text-xs"
          >
            Batal
          </button>
        </div>
      )}
    </div>
  );
}
