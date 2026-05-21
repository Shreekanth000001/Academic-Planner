import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Global object to cache the Prisma instance in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Create a Postgres connection pool using your transaction URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// Initialize the client, injecting the adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma