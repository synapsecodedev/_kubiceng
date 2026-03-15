// api/index.ts — Vercel Serverless Function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "../backend/src/routes/auth.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";
// Import other routes if needed, but let's keep it minimal for debug

const app = Fastify({ logger: true });

let isReady = false;
async function buildApp() {
  if (isReady) return;
  await app.register(cors, { origin: "*" });
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.ready();
  isReady = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple diagnostic
  if (req.url === '/api/debug') {
    return res.status(200).json({ 
      status: "debug_ok", 
      env: {
        has_db: !!process.env.DATABASE_URL,
        has_direct: !!process.env.DIRECT_URL
      }
    });
  }

  try {
    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload: req.body,
    });

    res.status(response.statusCode);
    const contentType = response.headers["content-type"];
    if (contentType) res.setHeader("content-type", contentType);
    res.send(response.body);
  } catch (error: any) {
    console.error("VERCEL API ERROR:", error);
    res.status(500).json({
      error: "Internal Server Error (Diagnostic)",
      message: error.message,
      stack: error.stack,
    });
  }
}
