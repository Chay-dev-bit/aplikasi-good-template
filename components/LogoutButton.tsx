
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    const data = await response.json();

    if (response.ok && data.success) {
      router.refresh();
      router.push("/");
      alert(data.message || "Berhasil logout");
    } else {
      alert(data.message || "Gagal logout");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full cursor-pointer bg-[#0b1c2c] px-5 py-2 text-sm text-white hover:bg-[#162d42]"
    >
      Keluar
    </button>
  );
}
