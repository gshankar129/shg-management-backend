import "dotenv/config";
// import { PrismaClient } from "@prisma/client";
import pkgPrisma from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';

const {PrismaClient}= pkgPrisma;
const globalForPrisma = globalThis;

// Initialize the database client only once across serverless invocations
function createPrismaClient() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Keep max connections per serverless function instance to 1
  });


    // const pool = new pg.Pool({connectionString: process.env.DATABASE_URL})
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter
  });
  // const prisma = new PrismaClient({
  //   adapter
  // });

  // return prisma;
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;