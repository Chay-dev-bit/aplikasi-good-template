"use client"

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(data.message);
                return;
            }

            alert(data.message);

            console.log(data.user);

            if (data.user.role === "Admin") {
                window.location.href = "/admin";
            } else if (data.user.role === "Pembeli") {
                window.location.href = "/";
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi Kesalahan. Silahkan coba lagi");
        }
    };

    return (
        <main className="min-h-screen bg-[#f7fbfd] text-[#0b1c2c]">

            <div className="flex min-h-screen">

                {/* ================= LEFT ================= */}
                <section className="relative hidden w-1/2 overflow-hidden bg-[radial-gradient(circle_at_70%_20%,#c9efff_0%,#eaf8fc_40%,#f7fbfd_80%)] lg:flex">

                    {/* Decorative circle */}
                    <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#c9efff]/50 blur-3xl" />

                    {/* Decorative shape */}
                    <div className="absolute right-[-80px] top-[-60px] h-72 w-72 rounded-full bg-[#dff6ff]" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-12">

                        {/* Logo */}
                        <div>
                            <a
                                href="/"
                                className="text-xl font-bold tracking-tight text-[#0b1c2c]"
                            >
                                GoodTemplate
                            </a>
                        </div>

                        {/* Content */}
                        <div className="max-w-lg">

                            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                                Marketplace Template Presentasi
                            </p>

                            <h2 className="text-5xl font-bold leading-[1.08] tracking-tight">
                                Presentasi yang baik
                                <span className="text-[#08aeea]"> dimulai di sini.</span>
                            </h2>

                            <p className="mt-6 max-w-md text-base leading-7 text-gray-500">
                                Temukan template presentasi yang sesuai dengan
                                kebutuhanmu, atau bagikan karya terbaikmu kepada
                                audiens yang tepat.
                            </p>

                            {/* Mockup */}
                            <div className="relative mt-10 h-48 w-full max-w-md">

                                {/* Back card */}
                                <div
                                    className="absolute right-0 top-0 w-72 rotate-[-4deg] rounded-2xl border border-white/80 bg-white shadow-[0_20px_50px_rgba(15,40,60,0.12)]">
                                    <img
                                        src="/images/hero-series.jpg"
                                        alt="Template presentasi"
                                        className="block w-full"
                                    />
                                </div>

                                {/* Front card */}
                                <div className="absolute bottom-[-30px] left-4 w-72 rotate-[3deg] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_20px_50px_rgba(15,40,60,0.15)]" >
                                    <img
                                        src="/images/hero-launch.jpg"
                                        alt="Template presentasi"
                                        className="block w-full"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Footer kecil */}
                        <p className="text-xs text-gray-400">
                            © 2026 GoodTemplate
                        </p>

                    </div>
                </section>


                {/* ================= RIGHT ================= */}
                <section className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">

                    <div className="w-full max-w-md">

                        {/* Heading */}
                        <div className="mb-8">

                            <p className="mb-3 text-sm font-medium text-[#08aeea]">
                                Selamat datang kembali
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-[#0b1c2c]">
                                Masuk ke GoodTemplate
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Masuk untuk melanjutkan dan mengakses template
                                yang kamu miliki.
                            </p>

                        </div>


                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-[#0b1c2c]"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    required
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#0b1c2c] outline-none transition placeholder:text-gray-400 focus:border-[#08aeea]  focus:ring-4 focus:ring-[#08aeea]/10" />
                            </div>
                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-[#0b1c2c]">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password"
                                    required
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#0b1c2c] outline-none transition placeholder:text-gray-400 focus:border-[#08aeea] focus:ring-4 focus:ring-[#08aeea]/10" />
                            </div>


                            {/* Login button */}
                            <button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-[#0b1c2c] text-sm font-semibold text-white transition hover:bg-[#162d42] active:scale-[0.99]">
                                Masuk
                            </button>

                        </form>


                        {/* Register */}
                        <p className="mt-7 text-center text-sm text-gray-500">

                            Belum punya akun?{" "}

                            <Link
                                href="/register"
                                className="font-semibold text-[#0b1c2c] transition hover:text-[#08aeea]"
                            >
                                Daftar sekarang
                            </Link>

                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}