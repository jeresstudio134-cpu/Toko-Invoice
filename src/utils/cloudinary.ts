import type { Product } from '../types';

// Semua foto produk; mendukung data lama yang hanya punya imageUrl
export const getProductImages = (p: Product): string[] =>
  (p.images && p.images.length ? p.images : p.imageUrl ? [p.imageUrl] : []).filter(Boolean);

// Perkecil foto HP sebelum diupload (sisi terpanjang maks 1600px)
export async function resizeImage(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    return await new Promise(resolve =>
      canvas.toBlob(b => resolve(b || file), 'image/jpeg', quality)
    );
  } catch {
    return file;
  }
}

// Upload unsigned langsung dari browser ke Cloudinary
export async function uploadImage(
  file: File,
  cloudName?: string,
  uploadPreset?: string
): Promise<string> {
  const cName = (
    cloudName ||
    (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ||
    (import.meta as any).env?.CLOUDINARY_CLOUD_NAME ||
    ''
  ).trim();
  const cPreset = (
    uploadPreset ||
    (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET ||
    (import.meta as any).env?.CLOUDINARY_UPLOAD_PRESET ||
    ''
  ).trim();

  if (!cName || !cPreset) {
    throw new Error(
      'Cloud Name & Upload Preset Cloudinary belum diisi di Environment Variables (VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET).'
    );
  }
  const blob = await resizeImage(file);
  const form = new FormData();
  form.append('file', blob, file.name.replace(/\.[^.]+$/, '') + '.jpg');
  form.append('upload_preset', cPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || 'Upload ke Cloudinary gagal');
  return data.secure_url as string;
}

// Minta Cloudinary mengirim versi yang lebih kecil & ringan
export function optimizedUrl(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('/upload/f_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}