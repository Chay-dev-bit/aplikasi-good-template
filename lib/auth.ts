import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import prisma from "@/lib/prisma";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: bigint) {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const session = await prisma.session.findUnique({
    where: {
      token_hash: tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expires_at <= new Date()) {
    return null;
  }

  if (session.user.status !== "Aktif") {
    return null;
  }

  return session.user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    await prisma.session.deleteMany({
      where: {
        token_hash: tokenHash,
      },
    });
  }

  cookieStore.delete("session_token");
}
