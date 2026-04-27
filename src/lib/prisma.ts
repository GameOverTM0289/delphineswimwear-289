import { PrismaClient } from '@prisma/client';

// Singleton pattern: avoid spinning up multiple clients in dev hot-reload
// and across serverless invocations on Vercel.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (err) {
    console.error('[prisma] failed to instantiate client:', err);
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export const dbReady = (): boolean => prisma !== null;
