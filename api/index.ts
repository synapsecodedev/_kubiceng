// api/index.ts — Vercel Serverless Function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "../backend/src/routes/auth.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";

const app = Fastify({ logger: false });

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
  // Unmistakable new status marker
  if (req.url === '/api/version') {
    return res.status(200).json({ version: "v4_stable_auth_only" });
  }

  try {
    if (req.url === '/api' || req.url === '/api/') {
      return res.status(200).json({ status: "v4_ready" });
    }

    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    // Support body processing
    const payload = req.body && typeof req.body === 'object' 
      ? JSON.stringify(req.body) 
      : req.body;

    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload,
    });

    res.status(response.statusCode);
    const contentType = response.headers["content-type"];
    if (contentType) res.setHeader("content-type", contentType);
    res.send(response.body);
  } catch (error: any) {
    console.error("VERCEL API ERROR:", error);
    res.status(500).json({
      error: "Internal Server Error (api/index_v4)",
      message: error.message,
      stack: error.stack,
    });
  }
}
