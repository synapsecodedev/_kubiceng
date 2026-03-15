// api/index.ts — Vercel Serverless Function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: "emergency_debug_ok", 
    message: "If you see this, the entry point itself is working.",
    env: {
      has_db: !!process.env.DATABASE_URL
    }
  });
}
