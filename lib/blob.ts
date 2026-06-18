import { del, list, put } from "@vercel/blob";
import type { Car } from "./types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const CAR_METADATA_FILE = "metadata.json";

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Μη υποστηριζόμενος τύπος αρχείου. Χρησιμοποιήστε JPEG, PNG ή WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Το αρχείο υπερβαίνει το όριο των 5MB.");
  }
}

export function carFolderPrefix(carId: string) {
  return `cars/${carId}/`;
}

export function carMetadataPath(carId: string) {
  return `${carFolderPrefix(carId)}${CAR_METADATA_FILE}`;
}

export function isStoredBlobPath(pathname: string) {
  return pathname.startsWith("cars/") && !pathname.endsWith(CAR_METADATA_FILE);
}

export async function uploadCarImage(carId: string, file: File) {
  validateImageFile(file);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${carFolderPrefix(carId)}${Date.now()}-${safeName}`;

  return put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function deleteCarImage(pathname: string) {
  if (!isStoredBlobPath(pathname)) return;
  await del(pathname);
}

export async function deleteCarImages(pathnames: string[]) {
  await Promise.all(pathnames.map((pathname) => deleteCarImage(pathname)));
}

async function listAllBlobs(prefix: string) {
  const blobs = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix, cursor });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs;
}

export async function listCarMetadataBlobs() {
  const blobs = await listAllBlobs("cars/");
  return blobs.filter((blob) => blob.pathname.endsWith(CAR_METADATA_FILE));
}

export async function deleteCarFolder(carId: string) {
  const blobs = await listAllBlobs(carFolderPrefix(carId));
  await Promise.all(blobs.map((blob) => del(blob.pathname)));
}

function parseCarRecord(data: unknown): Car | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  if (typeof record.id !== "string") return null;
  if (typeof record.title !== "string") return null;
  if (typeof record.price !== "number") return null;
  if (!Array.isArray(record.images)) return null;

  return {
    id: record.id,
    title: record.title,
    price: record.price,
    year: typeof record.year === "number" ? record.year : null,
    mileage: typeof record.mileage === "number" ? record.mileage : null,
    fuel: typeof record.fuel === "string" ? record.fuel : null,
    transmission: typeof record.transmission === "string" ? record.transmission : null,
    description: typeof record.description === "string" ? record.description : null,
    images: record.images as Car["images"],
    featured: Boolean(record.featured),
    createdAt: new Date(String(record.createdAt)),
    updatedAt: new Date(String(record.updatedAt)),
  };
}

export async function fetchCarMetadata(url: string): Promise<Car | null> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return parseCarRecord(await response.json());
}

export async function saveCarMetadata(car: Car) {
  const payload = JSON.stringify({
    ...car,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  });

  return put(carMetadataPath(car.id), payload, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function getCarMetadataById(carId: string): Promise<Car | null> {
  const blobs = await listAllBlobs(carFolderPrefix(carId));
  const metadataBlob = blobs.find((blob) => blob.pathname === carMetadataPath(carId));
  if (!metadataBlob) return null;
  return fetchCarMetadata(metadataBlob.url);
}
