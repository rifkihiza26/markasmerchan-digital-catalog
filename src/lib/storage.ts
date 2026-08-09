import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

/** ~10 years, in seconds. The bucket is private (workspace policy blocks public buckets), so
 * we persist a long-lived signed URL instead of a public URL. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export function buildMediaPath(file: File, folder = "uploads") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "-");
  const name = `${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${ext}`;
  return `${safeFolder}/${name}`;
}

export async function getMediaUrl(path: string) {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error) throw error;
  return data.signedUrl;
}

/** Uploads to the private media bucket and returns a long-lived signed URL. Throws on failure. */
export async function uploadMediaFile(file: File, folder = "uploads") {
  const path = buildMediaPath(file, folder);

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true, contentType: file.type });

  if (uploadError) {
    throw new Error(
      uploadError.message?.includes("row-level security") || uploadError.message?.includes("Unauthorized")
        ? "Akses ditolak: akun Anda belum memiliki hak admin untuk mengunggah file."
        : `Gagal mengunggah file: ${uploadError.message}`,
    );
  }

  const url = await getMediaUrl(path);
  return { path, url };
}
