import {
  deleteCarFolder,
  fetchCarMetadata,
  getCarMetadataById,
  listCarMetadataBlobs,
  saveCarMetadata,
} from "./blob";
import type { Car, CarFormData } from "./types";

export async function getAllCars() {
  const metadataBlobs = await listCarMetadataBlobs();
  const cars = await Promise.all(
    metadataBlobs.map((blob) => fetchCarMetadata(blob.url))
  );

  return cars
    .filter((car): car is Car => car !== null)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getCarById(id: string) {
  return getCarMetadataById(id);
}

export async function createCar(data: CarFormData & { id?: string }) {
  const id = data.id ?? crypto.randomUUID();
  const now = new Date();

  const existing = await getCarById(id);
  if (existing) {
    throw new Error("Το αυτοκίνητο υπάρχει ήδη");
  }

  const car: Car = {
    id,
    title: data.title,
    price: data.price,
    year: data.year ?? null,
    mileage: data.mileage ?? null,
    fuel: data.fuel ?? null,
    transmission: data.transmission ?? null,
    description: data.description ?? null,
    images: data.images,
    featured: data.featured ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await saveCarMetadata(car);
  return car;
}

export async function updateCar(id: string, data: CarFormData) {
  const existing = await getCarById(id);
  if (!existing) return null;

  const car: Car = {
    ...existing,
    title: data.title,
    price: data.price,
    year: data.year ?? null,
    mileage: data.mileage ?? null,
    fuel: data.fuel ?? null,
    transmission: data.transmission ?? null,
    description: data.description ?? null,
    images: data.images,
    featured: data.featured ?? false,
    updatedAt: new Date(),
  };

  await saveCarMetadata(car);
  return car;
}

export async function deleteCar(id: string) {
  const existing = await getCarById(id);
  if (!existing) return null;

  await deleteCarFolder(id);
  return existing;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number | null) {
  if (mileage == null) return null;
  return new Intl.NumberFormat("el-GR").format(mileage) + " χλμ";
}
