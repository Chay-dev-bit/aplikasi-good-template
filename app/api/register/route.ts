import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request:Request) {
    try {
        const body = await request.json();

        const {
            nama,
            email,
            noHp,
            password,
            confirmPassword,
        } = body;

        if (!nama || !email || !noHp || !password || !confirmPassword){
            return NextResponse.json(
                {
                    succsess: false,
                    message: "Semua field wajib diisi",
                },
                { status: 400}
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Konfirmasi password tidak sesuai",
                },
                { status: 404}
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                Email: email,
            },
        });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email sudah terdaftar",
                },
                {status: 404}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                Nama: nama,
                Email: email,
                No_hp: noHp,
                Password: hashedPassword,
                role: "Pembeli",
                status: "Aktif",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Register berhasil",
                user: {
                    ID: user.ID.toString(),
                    Nama: user.Nama,
                    Email: user.Email,
                },
            },
            {status: 201}
        );
    }catch (error) {
        console.error("Register error", error);

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan pada server",
            },
            { status: 500}
        );
    }
}