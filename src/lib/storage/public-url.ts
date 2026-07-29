export function publicMediaUrl(path: string | null) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return null;
  const safe = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/public-media/${safe}`;
}
