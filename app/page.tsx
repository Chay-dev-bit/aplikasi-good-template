
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1 font-sans bg-gradient-to-b from-[#d9f3ff] via-[#edf8fc] to-white">
      <nav className="flex w-full items-center justify-between px-6 py-6 bg-white">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-black font-bold">
            GoodTemplate
          </Link>

          <ul className="flex items-center gap-6 text-sm text-gray-500">
            <li><Link href="#">Marketplace</Link></li>
            <li><Link href="#">Kategori</Link></li>
            <li><Link href="#">Jual</Link></li>
          </ul>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center rounded-full border border-gray-200 px-4 py-2">
            <span className="mr-2 text-gray-400">⌕</span>
            <input
              type="text"
              placeholder="Cari template..."
              className="w-32 bg-transparent text-sm outline-none placeholder:text-gray-400 text-black"
            />
          </div>

          <Link href="#" className="text-sm text-black">
            Keranjang
          </Link>

          {user ? (
            <>
              <span className="text-sm font-medium text-black">
                Halo, {user.Nama || "Pengguna"}
              </span>

              {user.role === "Admin" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-gray-200 px-5 py-2 text-sm text-black hover:bg-gray-50"
                >
                  Dashboard Admin
                </Link>
              )}

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-gray-200 px-5 py-2 text-sm text-black transition-colors hover:bg-gray-50"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#0b1c2c] px-5 py-2 text-sm text-white transition-colors hover:bg-[#162d42]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[radial-gradient(circle_at_75%_20%,#c9efff_0%,#eaf8fc_38%,#ffffff_78%)]">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-8 py-16">
          <div className="z-10 w-1/2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#08aeea]" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                Marketplace Template Presentasi
              </span>
            </div>

            <h1 className="max-w-2xl text-6xl font-bold leading-[1.05] tracking-tight text-[#0b1c2c]">
              PPT yang{" "}
              <span className="text-[#08aeea]">dipajang</span>{" "}
              seperti karya, bukan file.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-gray-500">
              Beli desain presentasi kelas studio dari kreator
              independen. Pilih template yang sesuai dengan kebutuhanmu.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="#"
                className="rounded-full bg-[#0b1c2c] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#162d42]"
              >
                Jelajahi template
              </Link>
            </div>
          </div>

          <div className="relative flex w-1/2 justify-center">
            <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#bdeeff]/50 blur-3xl" />

            <div className="relative h-[600px] w-full max-w-[650px]">
              <div className="absolute right-0 top-4 z-20 w-[75%] rotate-[-3deg] overflow-hidden rounded-[24px] bg-white px-6 py-4 shadow-[0_30px_70px_rgba(15,40,60,0.15)]">
                <Image
                  src="/images/hero-launch.jpg"
                  alt="Series B presentation template"
                  width={800}
                  height={600}
                  className="block w-full rounded-2xl"
                />
              </div>

              <div className="absolute bottom-0 right-[-3%] z-10 w-[75%] rotate-[2deg] overflow-hidden rounded-[24px] bg-white px-6 py-4 shadow-[0_30px_70px_rgba(15,40,60,0.15)]">
                <Image
                  src="/images/hero-series.jpg"
                  alt="Launch 2026 presentation template"
                  width={800}
                  height={600}
                  className="block w-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
