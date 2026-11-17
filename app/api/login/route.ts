import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            email,
            password,
        } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    succsess: false,
                    message: "Email dan Password wajib diisi",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                Email: email,
            },
        });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email atau password salah",
                },
                { status: 401 }
            );
        }

        if (!user.Password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Akun tidak memiliki password",
                },
                { status: 401 }
            );
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.Password
        );

        if (!passwordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email atau password salah",
                },
                { status: 401 }
            );
        }

        if (user.status !== "Aktif") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Akun anda tidak aktif",
                },
                { status: 403 }
            );
        }
        await createSession(user.ID);

        return NextResponse.json(
            {
                success: true,
                message: "Login Berhasil",
                user: {
                    ID: user.ID.toString(),
                    Nama: user.Nama,
                    Email: user.Email,
                    role: user.role,
                },
            });
    } catch (error) {
        console.error("Login error", error);

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat login",
            },
            { status: 500 }
        );
    }
}