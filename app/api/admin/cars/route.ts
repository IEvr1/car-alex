import { NextRequest, NextResponse } from "next/server";
import { deleteCarImages } from "@/lib/blob";
import {
  createCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from "@/lib/cars";
import { requireAdmin } from "@/lib/auth";
import type { CarFormData, CarImage } from "@/lib/types";

function parseCarBody(body: unknown): CarFormData | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;

  if (typeof data.title !== "string" || !data.title.trim()) return null;
  if (typeof data.price !== "number" || data.price < 0) return null;
  if (!Array.isArray(data.images)) return null;

  const images: CarImage[] = data.images.filter(
    (img): img is CarImage =>
      typeof img === "object" &&
      img !== null &&
      typeof (img as CarImage).url === "string" &&
      typeof (img as CarImage).pathname === "string"
  );

  return {
    id: typeof data.id === "string" ? data.id : undefined,
    title: data.title.trim(),
    price: data.price,
    year: typeof data.year === "number" ? data.year : null,
    mileage: typeof data.mileage === "number" ? data.mileage : null,
    fuel: typeof data.fuel === "string" ? data.fuel : null,
    transmission: typeof data.transmission === "string" ? data.transmission : null,
    description: typeof data.description === "string" ? data.description : null,
    images,
    featured: Boolean(data.featured),
  };
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allCars = await getAllCars();
  return NextResponse.json(allCars);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = parseCarBody(await request.json());
  if (!body) {
    return NextResponse.json({ error: "Μη έγκυρα δεδομένα" }, { status: 400 });
  }

  const car = await createCar(body);
  return NextResponse.json(car, { status: 201 });
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const id = typeof payload.id === "string" ? payload.id : null;
  const body = parseCarBody(payload);

  if (!id || !body) {
    return NextResponse.json({ error: "Μη έγκυρα δεδομένα" }, { status: 400 });
  }

  const existing = await getCarById(id);
  if (!existing) {
    return NextResponse.json({ error: "Δεν βρέθηκε αυτοκίνητο" }, { status: 404 });
  }

  const removedImages = existing.images.filter(
    (img) => !body.images.some((current) => current.pathname === img.pathname)
  );

  if (removedImages.length > 0) {
    await deleteCarImages(removedImages.map((img) => img.pathname));
  }

  const car = await updateCar(id, body);
  return NextResponse.json(car);
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id απαιτείται" }, { status: 400 });
  }

  const deleted = await deleteCar(id);
  if (!deleted) {
    return NextResponse.json({ error: "Δεν βρέθηκε αυτοκίνητο" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
