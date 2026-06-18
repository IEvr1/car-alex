import { del, put } from "@vercel/blob";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Μη υποστηριζόμενος τύπος αρχείου. Χρησιμοποιήστε JPEG, PNG ή WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Το αρχείο υπερβαίνει το όριο των 5MB.");
  }
}

export async function uploadCarImage(carId: string, file: File) {
  validateImageFile(file);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `cars/${carId}/${Date.now()}-${safeName}`;

  return put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function deleteCarImage(pathname: string) {
  await del(pathname);
}

export async function deleteCarImages(pathnames: string[]) {
  await Promise.all(pathnames.map((pathname) => del(pathname)));
}
