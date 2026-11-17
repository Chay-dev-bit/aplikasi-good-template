"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

type Kategori = {
  ID: string;
  nama_kategori: string;
};

export default function CreateTemplatePage() {
  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlahSlide, setJumlahSlide] = useState("");
  const [preview, setPreview] = useState<File | null>(null);
  const [fileTemplate, setFileTemplate] = useState<File | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(true);

  useEffect(() => {
    async function fetchKategori() {
      try {
        const response = await fetch("/api/admin/categories");
        const result = await response.json();

        if (response.ok && result.success) {
          setKategori(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      } finally {
        setLoadingKategori(false);
      }
    }

    fetchKategori();
  }, []);

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

    if (!preview || !fileTemplate) {
      alert("Gambar preview dan file PowerPoint wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("nama_template", nama);
    formData.append("slug", slug);
    formData.append("deskripsi", deskripsi);
    formData.append("kategori_id", kategoriId);
    formData.append("harga", harga);
    formData.append("jumlah_slide", jumlahSlide);
    formData.append("preview", preview);
    formData.append("upload_template", fileTemplate);

    // API penyimpanan akan dibuat pada langkah berikutnya.
    alert("Form siap. API penyimpanan belum dibuat.");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin/templates"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Kembali ke Kelola Template
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Tambah Template
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Masukkan informasi produk PowerPoint yang akan dijual.
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
              required
              value={nama}
              onChange={(e) => handleNamaChange(e.target.value)}
              placeholder="Contoh: Business Plan Presentation"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="business-plan-presentation"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-400">
              Dibuat otomatis dari nama, tetapi bisa diedit.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Deskripsi
            </label>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan isi dan kegunaan template..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Kategori
            </label>
            <select
              required
              value={kategoriId}
              onChange={(e) => setKategoriId(e.target.value)}
              disabled={loadingKategori}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {loadingKategori
                  ? "Memuat kategori..."
                  : "Pilih kategori"}
              </option>
              {kategori.map((item) => (
                <option key={item.ID} value={item.ID}>
                  {item.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Harga (Rp)
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="75000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Jumlah Slide
              </label>
              <input
                required
                type="number"
                min="1"
                step="1"
                value={jumlahSlide}
                onChange={(e) => setJumlahSlide(e.target.value)}
                placeholder="25"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Gambar Preview
            </label>
            <input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setPreview(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
            />
            <p className="mt-1 text-xs text-slate-400">
              Format yang diizinkan: JPG, PNG, atau WebP.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              File PowerPoint
            </label>
            <input
              required
              type="file"
              accept=".ppt,.pptx"
              onChange={(e) =>
                setFileTemplate(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
            />
            <p className="mt-1 text-xs text-slate-400">
              Pilih file PPT atau PPTX yang akan dijual.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/templates"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Simpan Template
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
