import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Κωδικός απαιτείται" }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Λάθος κωδικός" }, { status: 401 });
    }

    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Σφάλμα σύνδεσης";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
