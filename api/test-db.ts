import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("DB_TEST: Starting connection test...");
  const prisma = new PrismaClient();
  
  try {
    console.log("DB_TEST: Testing queryRaw...");
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("DB_TEST: Success", result);
    
    res.status(200).json({ 
      status: "success", 
      message: "Database connection successful",
      result,
      env: {
        has_db_url: !!process.env.DATABASE_URL
      }
    });
  } catch (error: any) {
    console.error("DB_TEST: Failed", error);
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed",
      error: error.message,
      stack: error.stack
    });
  } finally {
    await prisma.$disconnect();
  }
}
