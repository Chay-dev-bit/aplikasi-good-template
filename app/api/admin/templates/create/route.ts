
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.kategori.findMany({
      orderBy: {
        ID: "desc",
      },
    });

    const data = categories.map((item) => ({
      ID: item.ID.toString(),
      nama_kategori: item.nama_kategori ?? "Tanpa Nama",
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kategori",
      },
      { status: 500 }
    );
  }
}
