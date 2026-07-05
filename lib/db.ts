import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Create PostgreSQL connection pool
const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// Prisma 7 requires adapter for direct database connections
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  globalForPrisma.pool = pool
}
