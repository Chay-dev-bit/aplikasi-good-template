
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function CreateCategoryPage() {
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const nama = namaKategori.trim();

    if (!nama) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_kategori: nama,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menyimpan kategori."
        );
      }

      setSuccess("Kategori berhasil ditambahkan!");
      setNamaKategori("");

      setTimeout(() => {
        window.location.href = "/admin/categories";
      }, 1000);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan kategori."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="text-sm text-slate-500 hover:text-sky-600"
          >
            ← Kembali ke Kategori
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Tambah Kategori
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tambahkan kategori baru untuk mengelompokkan template PowerPoint.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="namaKategori"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama Kategori
            </label>

            <input
              id="namaKategori"
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              placeholder="Contoh: Business, Education, Portfolio"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              disabled={loading}
            />

            <p className="mt-2 text-xs text-slate-400">
              Masukkan nama kategori yang mudah dikenali pembeli.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/categories"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#0b1c2c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#162d42] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
