export function slugify(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isSafeSlug(value: string) {
  return /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value) && value.length <= 160;
}
