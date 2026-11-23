import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{ id: string }>;
};

async function checkAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        return {
            error: NextResponse.json(
                { success: false, message: "Silakan login terlebih dahulu." },
                { status: 401 }
            ),
        };
    }

    if (user.role !== "Admin") {
        return {
            error: NextResponse.json(
                { success: false, message: "Kamu tidak memiliki akses." },
                { status: 403 }
            ),
        };
    }

    return { user };
}

// GET: Mengambil detail template
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
                { success: false, message: "ID template tidak valid." },
                { status: 400 }
            );
        }

        const template = await prisma.template.findUnique({
            where: { ID: BigInt(id) },
            include: { kategori: true },
        });

        if (!template) {
            return NextResponse.json(
                { success: false, message: "Template tidak ditemukan." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                ID: template.ID.toString(),
                nama_template: template.nama_template ?? "",
                slug: template.slug ?? "",
                deskripsi: template.deskripsi ?? "",
                harga: Number(template.harga ?? 0),
                jumlah_slide: template.jumlah_slide ?? 1,
                kategori_id: template.kategori_id.toString(),
                preview_image: template.preview_image,
                upload_template: template.upload_template,
            },
        });
    } catch (error) {
        console.error("Gagal mengambil detail template:", error);

        return NextResponse.json(
            { success: false, message: "Gagal mengambil detail template." },
            { status: 500 }
        );
    }
}

// PUT: Memperbarui template
export async function PUT(
    request: NextRequest,
    { params }: RouteContext
) {
    let newPreviewPath = "";
    let newTemplatePath = "";

    try {
        const auth = await checkAdmin();
        if (auth.error) return auth.error;

        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { success: false, message: "ID template tidak valid." },
                { status: 400 }
            );
        }

        const templateId = BigInt(id);

        const oldTemplate = await prisma.template.findUnique({
            where: { ID: templateId },
        });

        if (!oldTemplate) {
            return NextResponse.json(
                { success: false, message: "Template tidak ditemukan." },
                { status: 404 }
            );
        }

        const formData = await request.formData();

        const nama = String(formData.get("nama_template") ?? "").trim();
        const slug = String(formData.get("slug") ?? "").trim();
        const deskripsi = String(formData.get("deskripsi") ?? "").trim();
        const kategoriId = String(formData.get("kategori_id") ?? "");
        const hargaRaw = String(formData.get("harga") ?? "");
        const jumlahSlideRaw = String(formData.get("jumlah_slide") ?? "");

        const preview = formData.get("preview");
        const fileTemplate = formData.get("upload_template");

        if (
            !nama ||
            !slug ||
            !deskripsi ||
            !kategoriId ||
            !hargaRaw ||
            !jumlahSlideRaw
        ) {
            return NextResponse.json(
                { success: false, message: "Semua field wajib diisi." },
                { status: 400 }
            );
        }

        if (!/^\d+$/.test(kategoriId)) {
            return NextResponse.json(
                { success: false, message: "Kategori tidak valid." },
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

        const kategori = await prisma.kategori.findUnique({
            where: { ID: BigInt(kategoriId) },
        });

        if (!kategori) {
            return NextResponse.json(
                { success: false, message: "Kategori tidak ditemukan." },
                { status: 400 }
            );
        }

        const slugExists = await prisma.template.findFirst({
            where: {
                slug,
                NOT: { ID: templateId },
            },
        });

        if (slugExists) {
            return NextResponse.json(
                { success: false, message: "Slug sudah digunakan template lain." },
                { status: 409 }
            );
        }

        const updateData: {
            nama_template: string;
            slug: string;
            deskripsi: string;
            harga: number;
            jumlah_slide: number;
            kategori_id: bigint;
            preview_image?: string;
            upload_template?: string;
        } = {
            nama_template: nama,
            slug,
            deskripsi,
            harga,
            jumlah_slide: jumlahSlide,
            kategori_id: BigInt(kategoriId),
        };

        const previewDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "previews"
        );

        const templateDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "templates"
        );

        // Preview baru bersifat opsional
        if (preview instanceof File && preview.size > 0) {
            const ext = path.extname(preview.name).toLowerCase();

            if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
                return NextResponse.json(
                    { success: false, message: "Format preview harus JPG, PNG, atau WebP." },
                    { status: 400 }
                );
            }

            if (preview.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, message: "Ukuran preview maksimal 5 MB." },
                    { status: 400 }
                );
            }

            await mkdir(previewDir, { recursive: true });

            const filename = `${randomUUID()}${ext}`;
            newPreviewPath = path.join(previewDir, filename);

            await writeFile(
                newPreviewPath,
                Buffer.from(await preview.arrayBuffer())
            );

            updateData.preview_image = `/uploads/previews/${filename}`;
        }

        // File PowerPoint baru juga opsional
        if (fileTemplate instanceof File && fileTemplate.size > 0) {
            const ext = path.extname(fileTemplate.name).toLowerCase();

            if (![".ppt", ".pptx"].includes(ext)) {
                if (newPreviewPath) await unlink(newPreviewPath).catch(() => { });

                return NextResponse.json(
                    { success: false, message: "File template harus PPT atau PPTX." },
                    { status: 400 }
                );
            }

            if (fileTemplate.size > 50 * 1024 * 1024) {
                if (newPreviewPath) await unlink(newPreviewPath).catch(() => { });

                return NextResponse.json(
                    { success: false, message: "Ukuran file PowerPoint maksimal 50 MB." },
                    { status: 400 }
                );
            }

            await mkdir(templateDir, { recursive: true });

            const filename = `${randomUUID()}${ext}`;
            newTemplatePath = path.join(templateDir, filename);

            await writeFile(
                newTemplatePath,
                Buffer.from(await fileTemplate.arrayBuffer())
            );

            updateData.upload_template = filename;
        }

        const updatedTemplate = await prisma.template.update({
            where: { ID: templateId },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: "Template berhasil diperbarui.",
            data: {
                ID: updatedTemplate.ID.toString(),
                nama_template: updatedTemplate.nama_template,
            },
        });
    } catch (error) {
        if (newPreviewPath) await unlink(newPreviewPath).catch(() => { });
        if (newTemplatePath) await unlink(newTemplatePath).catch(() => { });

        console.error("Gagal memperbarui template:", error);

        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memperbarui template." },
            { status: 500 }
        );
    }
}


// DELETE: Menghapus template
export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const auth = await checkAdmin();
        if (auth.error) return auth.error;

        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { success: false, message: "ID template tidak valid." },
                { status: 400 }
            );
        }

        const template = await prisma.template.findUnique({
            where: { ID: BigInt(id) },
        });

        if (!template) {
            return NextResponse.json(
                { success: false, message: "Template tidak ditemukan." },
                { status: 404 }
            );
        }

        // Hapus data database terlebih dahulu.
        // Jika masih terhubung dengan transaksi, database akan menolak penghapusan.
        await prisma.template.delete({
            where: { ID: BigInt(id) },
        });

        // Bersihkan file setelah penghapusan database berhasil.
        const publicDir = path.resolve(process.cwd(), "public");

        const filesToDelete: string[] = [];

        if (template.preview_image) {
            const relativePath = template.preview_image.replace(/^[/\\]+/, "");
            const previewPath = path.resolve(publicDir, relativePath);

            if (previewPath.startsWith(publicDir + path.sep)) {
                filesToDelete.push(previewPath);
            }
        }

        if (template.upload_template) {
            const templatePath = path.resolve(
                publicDir,
                "uploads",
                "templates",
                path.basename(template.upload_template)
            );

            if (templatePath.startsWith(publicDir + path.sep)) {
                filesToDelete.push(templatePath);
            }
        }

        for (const filePath of filesToDelete) {
            await unlink(filePath).catch((error) => {
                console.error("Gagal menghapus file:", filePath, error);
            });
        }

        return NextResponse.json({
            success: true,
            message: "Template berhasil dihapus.",
        });
    } catch (error) {
        console.error("Gagal menghapus template:", error);

        // P2003 adalah foreign key constraint pada Prisma.
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2003"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Template tidak dapat dihapus karena masih digunakan pada data lain atau riwayat transaksi.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat menghapus template.",
            },
            { status: 500 }
        );
    }
}
