// api/index.ts — Vercel Serverless Function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";

// Runtime port override for Supabase Pooler (Vercel/Production)
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes(':5432')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(':5432', ':6543');
  console.log('Runtime DATABASE_URL port override to 6543');
}
if (process.env.DIRECT_URL && process.env.DIRECT_URL.includes(':5432')) {
  process.env.DIRECT_URL = process.env.DIRECT_URL.replace(':5432', ':6543');
}

// Delayed initialization to catch boot errors
let app: any;

async function initApp() {
  if (app) return app;
  
  const fastify = Fastify({ logger: true });
  
  // Dynamic imports to handle potential bundling issues
  const { authRoutes } = await import("../backend/src/routes/auth.routes");
  const { healthRoutes } = await import("../backend/src/routes/health.routes");

  await fastify.register(cors, { origin: "*" });
  await fastify.register(healthRoutes);
  await fastify.register(authRoutes);
  await fastify.ready();
  
  app = fastify;
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ultra-stable debug route
  if (req.url === '/api/debug-v5') {
    return res.status(200).json({ 
      status: "debug_v5_booted", 
      env_db: !!process.env.DATABASE_URL,
      db_port: process.env.DATABASE_URL?.split(':')[3]?.split('/')[0] || "unknown"
    });
  }

  try {
    const server = await initApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    const payload = req.body && typeof req.body === 'object' 
      ? JSON.stringify(req.body) 
      : req.body;

    const response = await server.inject({
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
    console.error("V5 BOOT ERROR:", error);
    res.status(500).json({
      error: "Vercel Boot Error (v5)",
      message: error.message,
      stack: error.stack,
      prisma_hint: error.message?.includes('Prisma') ? "Prisma Init Failed" : undefined
    });
  }
}
