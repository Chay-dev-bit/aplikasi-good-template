
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Kategori = {
  ID: string;
  nama_kategori: string;
};

type TemplateData = {
  ID: string;
  nama_template: string;
  slug: string;
  deskripsi: string;
  harga: number;
  jumlah_slide: number;
  kategori_id: string;
  preview_image: string | null;
  upload_template: string | null;
};

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlahSlide, setJumlahSlide] = useState("");

  const [preview, setPreview] = useState<File | null>(null);
  const [fileTemplate, setFileTemplate] = useState<File | null>(null);

  const [previewLama, setPreviewLama] = useState<string | null>(null);
  const [templateLama, setTemplateLama] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [templateResponse, kategoriResponse] = await Promise.all([
          fetch(`/api/admin/templates/${id}`),
          fetch("/api/admin/categories"),
        ]);

        const templateResult = await templateResponse.json();
        const kategoriResult = await kategoriResponse.json();

        if (!templateResponse.ok || !templateResult.success) {
          throw new Error(
            templateResult.message || "Gagal mengambil data template."
          );
        }

        if (!kategoriResponse.ok || !kategoriResult.success) {
          throw new Error(
            kategoriResult.message || "Gagal mengambil data kategori."
          );
        }

        const data: TemplateData = templateResult.data;

        setNama(data.nama_template);
        setSlug(data.slug);
        setDeskripsi(data.deskripsi);
        setKategoriId(data.kategori_id);
        setHarga(String(data.harga));
        setJumlahSlide(String(data.jumlah_slide));
        setPreviewLama(data.preview_image);
        setTemplateLama(data.upload_template);
        setKategori(kategoriResult.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  function handleNamaChange(value: string) {
    setNama(value);

    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("nama_template", nama);
      formData.append("slug", slug);
      formData.append("deskripsi", deskripsi);
      formData.append("kategori_id", kategoriId);
      formData.append("harga", harga);
      formData.append("jumlah_slide", jumlahSlide);

      if (preview) {
        formData.append("preview", preview);
      }

      if (fileTemplate) {
        formData.append("upload_template", fileTemplate);
      }

      const response = await fetch(`/api/admin/templates/${id}`, {
        method: "PUT",
        body: formData,
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `Server mengirim respons kosong (HTTP ${response.status}).`
        );
      }

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("Respons server tidak valid.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui template.");
      }

      alert("Template berhasil diperbarui!");
      router.push("/admin/templates");
      router.refresh();
    } catch (err) {
      console.error("Gagal mengedit template:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui template."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <p className="text-center text-slate-500">
          Memuat data template...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Link
            href="/admin/templates"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Kembali ke daftar template
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-slate-500">
            Admin / Kelola Template / Edit
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Edit Template
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Perbarui informasi dan file template PowerPoint.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nama Template
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => handleNamaChange(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama template"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="nama-template"
            />
            <p className="mt-1 text-xs text-slate-500">
              Slug digunakan sebagai identitas URL template.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan deskripsi template"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Kategori
              </label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Pilih kategori</option>
                {kategori.map((item) => (
                  <option key={item.ID} value={item.ID}>
                    {item.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Harga (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Contoh: 50000"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Jumlah Slide
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={jumlahSlide}
              onChange={(e) => setJumlahSlide(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan jumlah slide"
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 font-semibold">File Preview</h2>

            {previewLama && (
              <div className="mb-4">
                <p className="mb-2 text-sm text-slate-500">
                  Preview saat ini:
                </p>
                <img
                  src={previewLama}
                  alt="Preview template saat ini"
                  className="h-44 w-auto rounded-xl border border-slate-200 object-cover"
                />
              </div>
            )}

            <label className="mb-2 block text-sm font-medium">
              Ganti Preview (Opsional)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                setPreview(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Format JPG, PNG, WebP. Maksimal 5 MB.
            </p>

            {preview && (
              <p className="mt-2 text-sm text-green-600">
                File baru: {preview.name}
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 font-semibold">File PowerPoint</h2>

            {templateLama && (
              <p className="mb-3 text-sm text-slate-600">
                File saat ini:{" "}
                <span className="font-medium">{templateLama}</span>
              </p>
            )}

            <label className="mb-2 block text-sm font-medium">
              Ganti File Template (Opsional)
            </label>
            <input
              type="file"
              accept=".ppt,.pptx"
              onChange={(e) =>
                setFileTemplate(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Format PPT atau PPTX. Maksimal 50 MB.
            </p>

            {fileTemplate && (
              <p className="mt-2 text-sm text-green-600">
                File baru: {fileTemplate.name}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/templates"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
