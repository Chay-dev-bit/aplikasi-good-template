import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
    host : "localhost",
    user: "root",
    password: "",
    database: "goodtemplate",
    connectionLimit: 5,
});

const prisma = new PrismaClient({
    adapter,
});

export default prisma;