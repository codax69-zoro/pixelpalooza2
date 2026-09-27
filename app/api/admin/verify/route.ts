import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// SHA-256 hash of the master festival organizer passcode
// This prevents the plaintext passcode from ever existing in source code, repositories, or client bundles.
const MASTER_HASH =
  process.env.ORGANIZER_PASSCODE_HASH ||
  "64df054a478c31e62514c51b6bbf3f5a52f0341addcc7e2e14f1c1d938b71aba";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { success: false, error: "Organizer passcode required" },
        { status: 400 }
      );
    }

    // Compute cryptographic SHA-256 hash of provided passcode
    const hashedAttempt = crypto
      .createHash("sha256")
      .update(passcode.trim())
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const isMatch =
      hashedAttempt.length === MASTER_HASH.length &&
      crypto.timingSafeEqual(
        Buffer.from(hashedAttempt),
        Buffer.from(MASTER_HASH)
      );

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Access denied: Invalid organizer passcode" },
        { status: 401 }
      );
    }

    // Passcode validated successfully
    const response = NextResponse.json({
      success: true,
      message: "Organizer session authorized",
    });

    // Set secure session cookie
    response.cookies.set("gdgoc_admin_session", "authenticated", {
      httpOnly: false, // accessible to client for route protection
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server authentication error" },
      { status: 500 }
    );
  }
}
