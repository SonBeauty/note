import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Prisma client singleton.
 *
 * Next.js hot-reload tạo lại module liên tục ở dev — không cache vào globalThis
 * thì mỗi lần reload lại mở thêm một connection pool tới Postgres.
 *
 * Prisma 7 bỏ query engine nhị phân, bắt buộc dùng driver adapter (node-postgres).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL chưa được cấu hình");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
