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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Menghitung pagination
  const totalPages = Math.max(
    1,
    Math.ceil(kategori.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedKategori = kategori.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const endIndex = Math.min(
    startIndex + itemsPerPage,
    kategori.length
  );

  async function handleDelete(category: Kategori) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus kategori "${category.nama_kategori}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${category.ID}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menghapus kategori."
        );
      }

      setKategori((current) =>
        current.filter((item) => item.ID !== category.ID)
      );

      alert("Kategori berhasil dihapus.");

    } catch (error) {
      console.error("Gagal menghapus kategori:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus kategori."
      );
    }
  }

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
                  {paginatedKategori.map((item, index) => (
                    <tr key={item.ID} className="hover:bg-slate-50">
                      <td className="px-6 py-5 text-slate-800">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5 font-medium text-slate-800">
                        {item.nama_kategori}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/categories/${item.ID}/edit`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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

              {/* Pagination */}
              {kategori.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row">
                  <p className="text-sm text-slate-500">
                    Menampilkan {startIndex + 1} - {endIndex} dari{" "}
                    {kategori.length} kategori
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(safeCurrentPage - 1)
                      }
                      disabled={safeCurrentPage === 1}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Sebelumnya
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${safeCurrentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(safeCurrentPage + 1)
                      }
                      disabled={safeCurrentPage === totalPages}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}
