import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { cars } from "./schema";
import type { CarFormData } from "./types";

export async function getAllCars() {
  return getDb().select().from(cars).orderBy(desc(cars.createdAt));
}

export async function getCarById(id: string) {
  const [car] = await getDb().select().from(cars).where(eq(cars.id, id)).limit(1);
  return car ?? null;
}

export async function createCar(data: CarFormData & { id?: string }) {
  const [car] = await getDb()
    .insert(cars)
    .values({
      id: data.id,
      title: data.title,
      price: data.price,
      year: data.year ?? null,
      mileage: data.mileage ?? null,
      fuel: data.fuel ?? null,
      transmission: data.transmission ?? null,
      description: data.description ?? null,
      images: data.images,
      featured: data.featured ?? false,
    })
    .returning();

  return car;
}

export async function updateCar(id: string, data: CarFormData) {
  const [car] = await getDb()
    .update(cars)
    .set({
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
    })
    .where(eq(cars.id, id))
    .returning();

  return car ?? null;
}

export async function deleteCar(id: string) {
  const [car] = await getDb().delete(cars).where(eq(cars.id, id)).returning();
  return car ?? null;
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
