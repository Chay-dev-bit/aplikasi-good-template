
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`/api/admin/categories/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil data kategori.");
        }

        setNamaKategori(result.data.nama_kategori);
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

    if (id) fetchCategory();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nama = namaKategori.trim();

    if (!nama) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_kategori: nama,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memperbarui kategori.");
      }

      alert("Kategori berhasil diperbarui.");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan kategori."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Memuat data kategori...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Kategori
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi kategori template.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="nama_kategori"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Nama Kategori
          </label>

          <input
            id="nama_kategori"
            type="text"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Masukkan nama kategori"
            maxLength={255}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
