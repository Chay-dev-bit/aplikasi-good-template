
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Mengambil seluruh kategori
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

// POST: Menambahkan kategori baru
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const namaKategori = body.nama_kategori?.trim();

    if (!namaKategori) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama kategori wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Memeriksa apakah kategori sudah ada
    const existingCategory = await prisma.kategori.findFirst({
      where: {
        nama_kategori: namaKategori,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori tersebut sudah tersedia.",
        },
        { status: 409 }
      );
    }

    // Menyimpan kategori ke database
    const category = await prisma.kategori.create({
      data: {
        nama_kategori: namaKategori,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil ditambahkan.",
        data: {
          ID: category.ID.toString(),
          nama_kategori: category.nama_kategori,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Gagal menambahkan kategori:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menyimpan kategori.",
      },
      { status: 500 }
    );
  }
}
