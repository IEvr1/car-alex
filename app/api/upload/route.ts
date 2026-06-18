import { NextRequest, NextResponse } from "next/server";
import { uploadCarImage } from "@/lib/blob";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const carId = formData.get("carId");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Δεν βρέθηκε αρχείο" }, { status: 400 });
    }

    if (typeof carId !== "string" || !carId) {
      return NextResponse.json({ error: "carId απαιτείται" }, { status: 400 });
    }

    const blob = await uploadCarImage(carId, file);

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Σφάλμα κατά το upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
