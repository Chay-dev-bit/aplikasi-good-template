"use client";

import { useState } from "react";
import Link from "next/link";

const templates = [
  {
    id: 1,
    nama: "Business Plan Presentation",
    kategori: "Bisnis",
    harga: 75000,
    slide: 25,
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Minimalist Portfolio",
    kategori: "Portfolio",
    harga: 45000,
    slide: 18,
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Creative Pitch Deck",
    kategori: "Presentasi",
    harga: 60000,
    slide: 30,
    status: "Aktif",
  },
];

export default function KelolaTemplatePage() {
  const [search, setSearch] = useState("");

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

          <Link href="/admin/templates/create"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                + Tambah Template
            </Link>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Template</p>
            <p className="mt-3 text-3xl font-bold">{templates.length}</p>
            <p className="mt-2 text-xs text-slate-400">
              Seluruh template terdaftar
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Template Aktif</p>
            <p className="mt-3 text-3xl font-bold">
              {templates.filter((item) => item.status === "Aktif").length}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Template yang tersedia
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Kategori Digunakan</p>
            <p className="mt-3 text-3xl font-bold">
              {new Set(templates.map((item) => item.kategori)).size}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Kategori pada data contoh
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Daftar Template</h2>
              <p className="mt-1 text-sm text-slate-500">
                Kelola produk digital yang dijual.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari nama template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">No.</th>
                  <th className="px-6 py-4">Nama Template</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Jumlah Slide</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTemplates.map((template, index) => (
                  <tr
                    key={template.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">{index + 1}</td>
                    <td className="px-6 py-5 font-medium">
                      {template.nama}
                    </td>
                    <td className="px-6 py-5">{template.kategori}</td>
                    <td className="px-6 py-5 font-medium">
                      {formatRupiah(template.harga)}
                    </td>
                    <td className="px-6 py-5">{template.slide} slide</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            alert(`Edit ${template.nama} akan dibuat berikutnya.`)
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

                {filteredTemplates.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Template tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
            Menampilkan {filteredTemplates.length} dari {templates.length} template
          </div>
        </section>
      </div>
    </main>
  );
}
