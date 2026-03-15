// api/index.ts — VERIFY DEPLOYMENT v6
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: "deployment_v6_confirmed", 
    timestamp: new Date().toISOString()
  });
}
