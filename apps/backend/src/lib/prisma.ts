// Prisma client singleton
// Run `npx prisma generate` before first use

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prismaInstance: any;

function getPrismaClient() {
  if (!prismaInstance) {
    // Dynamic require so TypeScript doesn't fail before `prisma generate` is run
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();
