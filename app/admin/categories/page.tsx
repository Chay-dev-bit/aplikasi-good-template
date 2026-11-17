"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Kategori = {
  ID: string;
  nama_kategori: string;
};

export default function KelolaKategoriPage() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchKategori() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil kategori.");
      }

      setKategori(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKategori();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Admin / Kategori
            </p>

            <h1 className="text-3xl font-bold text-slate-800">
              Kelola Kategori
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kelola kategori template PowerPoint GoodTemplate.
            </p>
          </div>

          <Link
            href="/admin/categories/create"
            className="rounded-xl bg-[#0b1c2c] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#162d42]"
          >
            + Tambah Kategori
          </Link>
        </div>

        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Kategori
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {kategori.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Status Data
            </p>

            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              {loading
                ? "Memuat..."
                : error
                  ? "Gagal memuat"
                  : "Terhubung"}
            </h2>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800">
              Daftar Kategori
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Data kategori dari database.
            </p>
          </div>

          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Memuat data kategori...
            </p>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-600">{error}</p>

              <button
                onClick={fetchKategori}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">No.</th>
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {kategori.map((item, index) => (
                    <tr key={item.ID} className="hover:bg-slate-50">
                      <td className="px-6 py-5 text-slate-800">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5 font-medium text-slate-800">
                        {item.nama_kategori}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              alert(`Edit ${item.nama_kategori} akan dibuat berikutnya.`)
                            }
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              alert("Fitur hapus akan dibuat berikutnya.")
                            }
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {kategori.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        Belum ada kategori.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
