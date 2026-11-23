
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let previewPath = "";
  let templatePath = "";

  try {
    // 1. Autentikasi admin
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    if (user.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    // 2. Ambil data form
    const formData = await request.formData();

    const nama = String(formData.get("nama_template") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const deskripsi = String(formData.get("deskripsi") || "").trim();
    const kategoriId = String(formData.get("kategori_id") || "");
    const hargaRaw = String(formData.get("harga") || "");
    const jumlahSlideRaw = String(formData.get("jumlah_slide") || "");

    const preview = formData.get("preview");
    const fileTemplate = formData.get("upload_template");

    if (!nama || !slug || !deskripsi || !kategoriId || !hargaRaw || !jumlahSlideRaw) {
      return NextResponse.json(
        { success: false, message: "Semua informasi wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(kategoriId)) {
      return NextResponse.json(
        { success: false, message: "ID kategori tidak valid." },
        { status: 400 }
      );
    }

    const harga = Number(hargaRaw);
    const jumlahSlide = Number(jumlahSlideRaw);

    if (!Number.isSafeInteger(harga) || harga < 0) {
      return NextResponse.json(
        { success: false, message: "Harga tidak valid." },
        { status: 400 }
      );
    }

    if (!Number.isSafeInteger(jumlahSlide) || jumlahSlide < 1) {
      return NextResponse.json(
        { success: false, message: "Jumlah slide tidak valid." },
        { status: 400 }
      );
    }

    if (
      !(preview instanceof File) ||
      !(fileTemplate instanceof File) ||
      preview.size === 0 ||
      fileTemplate.size === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Pilih gambar preview dan file PowerPoint." },
        { status: 400 }
      );
    }

    // 3. Validasi kategori
    const kategoriBigInt = BigInt(kategoriId);

    const kategori = await prisma.kategori.findUnique({
      where: { ID: kategoriBigInt },
    });

    if (!kategori) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukan." },
        { status: 400 }
      );
    }

    // 4. Validasi slug
    const slugExists = await prisma.template.findUnique({
      where: { slug },
    });

    if (slugExists) {
      return NextResponse.json(
        { success: false, message: "Slug sudah digunakan." },
        { status: 409 }
      );
    }

    // 5. Validasi ekstensi
    const previewExt = path.extname(preview.name).toLowerCase();
    const templateExt = path.extname(fileTemplate.name).toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".webp"].includes(previewExt)) {
      return NextResponse.json(
        { success: false, message: "Format gambar tidak valid." },
        { status: 400 }
      );
    }

    if (![".ppt", ".pptx"].includes(templateExt)) {
      return NextResponse.json(
        { success: false, message: "File harus PPT atau PPTX." },
        { status: 400 }
      );
    }

    if (preview.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Gambar maksimal 5 MB." },
        { status: 400 }
      );
    }

    if (fileTemplate.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File PowerPoint maksimal 50 MB." },
        { status: 400 }
      );
    }

    // 6. Simpan file
    const previewDir = path.join(process.cwd(), "public/uploads/previews");
    const templateDir = path.join(process.cwd(), "public/uploads/templates");

    await mkdir(previewDir, { recursive: true });
    await mkdir(templateDir, { recursive: true });

    const previewName = `${randomUUID()}${previewExt}`;
    const templateName = `${randomUUID()}${templateExt}`;

    previewPath = path.join(previewDir, previewName);
    templatePath = path.join(templateDir, templateName);

    await writeFile(previewPath, Buffer.from(await preview.arrayBuffer()));
    await writeFile(templatePath, Buffer.from(await fileTemplate.arrayBuffer()));

    // 7. Simpan database
    const newTemplate = await prisma.template.create({
      data: {
        nama_template: nama,
        slug,
        deskripsi,
        harga,
        jumlah_slide: jumlahSlide,
        kategori_id: kategoriBigInt,
        preview_image: `/uploads/previews/${previewName}`,
        upload_template: templateName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Template berhasil disimpan.",
        data: {
          ID: newTemplate.ID.toString(),
          nama_template: newTemplate.nama_template,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("GAGAL MENYIMPAN TEMPLATE:", error);

    if (previewPath) await unlink(previewPath).catch(() => {});
    if (templatePath) await unlink(templatePath).catch(() => {});

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan template.",
      },
      { status: 500 }
    );
  }
}

