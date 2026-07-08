import type { SupabaseClient } from "@supabase/supabase-js";

// Shared client-side helpers for the `designs` storage bucket. Used by every
// admin panel that uploads or replaces a photo, so upload naming, cache headers,
// and cleanup behave identically everywhere.

const BUCKET = "designs";

// Longest edge (px) uploaded photos are downscaled to. 1600 comfortably covers
// the largest slot the site renders (the hero) at 2× on retina, while turning a
// 12 MP phone photo of several MB into a few hundred KB.
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Downscale + re-encode a raster photo in the browser before upload. Phone
 * cameras produce multi-MB images that would otherwise be served verbatim to
 * visitors on mobile data. Non-raster inputs (svg/gif) and images that don't
 * actually get smaller are returned untouched.
 */
async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  // Keep the original if re-encoding didn't help (e.g. an already-tiny image).
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.\w+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

/** Compress, then upload under a random name; returns the public URL. */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const optimized = await compressImage(file);
  const ext = (optimized.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, optimized, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Extract the storage object path from a public URL, or null if the URL isn't
 * an uploaded file in our bucket (e.g. a bundled `/designs/d01.svg` placeholder
 * or an externally-hosted URL) — those must never be deleted.
 */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

/**
 * Delete an uploaded image by its public URL. No-ops for placeholders and
 * external URLs. Best-effort: a failed cleanup never blocks the caller (an
 * orphaned object is far less bad than a broken save).
 */
export async function removeImage(
  supabase: SupabaseClient,
  url: string | null | undefined
): Promise<void> {
  if (!url) return;
  const path = storagePathFromUrl(url);
  if (!path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    /* orphan cleanup is best-effort */
  }
}
