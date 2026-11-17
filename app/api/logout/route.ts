
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Berhasil logout",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal logout",
      },
      { status: 500 }
    );
  }
}
