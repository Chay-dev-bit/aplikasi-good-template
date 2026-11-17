import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      include: {
        kategori: true,
      },
      orderBy: {
        ID: "desc",
      },
    });

    const data = templates.map((template) => ({
      id: template.ID.toString(),
      nama: template.nama_template ?? "Tanpa Nama",
      slug: template.slug ?? "",
      deskripsi: template.deskripsi ?? "",
      harga: Number(template.harga ?? 0),
      upload_template: template.upload_template ?? "",
      slide: template.jumlah_slide ?? 0,
      preview: template.preview_image,
      kategori: template.kategori.nama_kategori ?? "Tanpa Kategori",
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Gagal mengambil template:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data template",
      },
      { status: 500 }
    );
  }
}
