import { randomUUID } from "node:crypto";

export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function validateImage(file: Pick<File, "size" | "type">) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("نوع الصورة غير مسموح.");
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error("حجم الصورة يجب ألا يتجاوز 10MB.");
}

export function safeStoragePath(userId: string, mimeType: string) {
  if (!/^[0-9a-f-]{36}$/i.test(userId)) throw new Error("معرّف المستخدم غير صالح.");
  const ext: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"
  };
  const suffix = ext[mimeType];
  if (!suffix) throw new Error("نوع الصورة غير مسموح.");
  return `${userId}/news/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${suffix}`;
}
