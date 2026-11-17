
"use client";

import { useEffect, useState } from "react";

type Template = {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  kategori: string;
  harga: number;
  slide: number;
  preview: string | null;
  upload_template: string;
};

export default function KelolaTemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/admin/templates");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Gagal mengambil data template."
          );
        }

        setTemplates(result.data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.nama.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (harga: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(harga);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Admin / Kelola Template
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Kelola Template
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Kelola seluruh template PowerPoint di GoodTemplate.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Template</p>
            <p className="mt-3 text-3xl font-bold">{templates.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Kategori Digunakan</p>
            <p className="mt-3 text-3xl font-bold">
              {new Set(templates.map((item) => item.kategori)).size}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Status Data</p>
            <p className="mt-3 text-lg font-semibold">
              {loading
                ? "Memuat..."
                : error
                  ? "Gagal memuat"
                  : "Terhubung"}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Daftar Template</h2>
              <p className="mt-1 text-sm text-slate-500">
                Data template dari database.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari nama template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
            />
          </div>

          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Memuat data template...
            </p>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">No.</th>
                    <th className="px-6 py-4">Nama Template</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Jumlah Slide</th>
                    <th className="px-6 py-4">Upload Template</th>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4">Deskripsi</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTemplates.map((template, index) => (
                    <tr key={template.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5">{index + 1}</td>
                      <td className="px-6 py-5 font-medium">
                        {template.nama}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.slug}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {formatRupiah(template.harga)}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.slide} slide
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.upload_template ? (
                          <a
                            href={template.upload_template}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Lihat Template
                          </a>
                        ) : (
                          "Belum diunggah"
                        )}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.preview ? (
                          <a
                            href={template.preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Lihat Preview
                          </a>
                        ) : (
                          "Belum diunggah"
                        )}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.deskripsi ? (
                          <span className="text-slate-800">
                            {template.deskripsi}
                          </span>
                        ) : (
                          "Belum diunggah"
                        )}
                      </td>
                      <td className="px-6 py-5 font-medium">
                        {template.kategori}
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        Belum tersedia
                      </td>
                    </tr>
                  ))}

                  {filteredTemplates.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        {search
                          ? "Template tidak ditemukan."
                          : "Belum ada template di database."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
              Menampilkan {filteredTemplates.length} dari {templates.length} template
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
