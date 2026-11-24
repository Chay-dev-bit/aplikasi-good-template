import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{ id: string }>;
}

async function checkAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: NextResponse.json(
                { success: false, message: "Silahkan login terlebih dahulu" },
                { status: 401 }
            ),
        };
    }

    if (user.role !== "Admin") {
        return {
            error: NextResponse.json(
                { success: false, message: "Anda tidak memiliki akses ke halaman ini. " },
                { status: 404 }
            ),
        };
    }

    return { user };
}

// GET method untuk mengambuk detail data
export async function GET(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const auth = await checkAdmin();
        if (auth.error) return auth.error;

        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { success: false, message: "ID tidak valid" },
                { status: 400 }
            );
        }

        const category = await prisma.kategori.findUnique({
            where: { ID: BigInt(id) }
        });

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Kategori tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                ID: category.ID.toString(),
                nama_kategori: category.nama_kategori ?? "",
            },
        });
    } catch (error) {
        console.error("Gagal mengambil detail data kategori:", error);

        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat mengambil detail data kategori"},
            { status: 500 }
        );
    }
}

// PUT method untuk mengapdate data
export async function PUT(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        // Periksa autentikasi dan hak akses admin
        const auth = await checkAdmin();
        if (auth.error) return auth.error;

        // Ambil ID dari URL
        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { success: false, message: "ID tidak valid." },
                { status: 400 }
            );
        }

        // Ambil data dari request
        const body = await request.json();
        const namaKategori = String(body.nama_kategori ?? "").trim();

        // Validasi input
        if (!namaKategori) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Nama kategori wajib diisi."
                },
                { status: 400 }
            );
        }

        if (namaKategori.length > 255) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Nama kategori maksimal 255 karakter."
                },
                { status: 400 }
            );
        }

        // Periksa apakah kategori tersedia
        const existingCategory = await prisma.kategori.findUnique({
            where: {
                ID: BigInt(id)
            }
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Kategori tidak ditemukan."
                },
                { status: 404 }
            );
        }

        // Periksa apakah nama kategori sudah digunakan kategori lain
        const duplicateCategory = await prisma.kategori.findFirst({
            where: {
                nama_kategori: namaKategori,
                NOT: {
                    ID: BigInt(id)
                }
            }
        });

        if (duplicateCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Nama kategori sudah digunakan."
                },
                { status: 409 }
            );
        }

        // Perbarui data kategori
        const updatedCategory = await prisma.kategori.update({
            where: {
                ID: BigInt(id)
            },
            data: {
                nama_kategori: namaKategori
            }
        });

        return NextResponse.json({
            success: true,
            message: "Kategori berhasil diperbarui.",
            data: {
                ID: updatedCategory.ID.toString(),
                nama_kategori: updatedCategory.nama_kategori
            }
        });

    } catch (error) {
        console.error("Gagal memperbarui kategori:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat memperbarui kategori."
            },
            { status: 500 }
        );
    }
}


// DELETE method untuk menghapus kategori
export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        // Periksa autentikasi dan hak akses admin
        const auth = await checkAdmin();
        if (auth.error) return auth.error;

        // Ambil ID dari URL
        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { success: false, message: "ID tidak valid." },
                { status: 400 }
            );
        }

        const categoryId = BigInt(id);

        // Periksa apakah kategori tersedia
        const category = await prisma.kategori.findUnique({
            where: {
                ID: categoryId
            }
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Kategori tidak ditemukan."
                },
                { status: 404 }
            );
        }

        // Periksa apakah kategori masih digunakan template
        const templateCount = await prisma.template.count({
            where: {
                kategori_id: categoryId
            }
        });

        if (templateCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${templateCount} template.`
                },
                { status: 409 }
            );
        }

        // Hapus kategori dari database
        await prisma.kategori.delete({
            where: {
                ID: categoryId
            }
        });

        return NextResponse.json({
            success: true,
            message: "Kategori berhasil dihapus."
        });

    } catch (error) {
        console.error("Gagal menghapus kategori:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat menghapus kategori."
            },
            { status: 500 }
        );
    }
}