// api/index.ts — Maximum Stability Vercel Handler
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Runtime port override for Supabase Pooler
let dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes(':5432')) {
  dbUrl = dbUrl.replace(':5432', ':6543');
}
if (!dbUrl.includes('pgbouncer=true')) {
  dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

// Global Prisma instance - Inlined to avoid bundling issues
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const app = Fastify({ 
  logger: false,
  pluginTimeout: 30000 
});

import { authRoutes } from "../backend/src/routes/auth.routes";
import { engenhariaRoutes } from "../backend/src/routes/engenharia.routes";
import { dashboardRoutes } from "../backend/src/routes/dashboard.routes";
import { financeiroRoutes } from "../backend/src/routes/financeiro.routes";
import { suprimentosRoutes } from "../backend/src/routes/suprimentos.routes";
import { execucaoRoutes } from "../backend/src/routes/execucao.routes";
import { pessoasRoutes } from "../backend/src/routes/pessoas.routes";
import { comercialRoutes } from "../backend/src/routes/comercial.routes";
import { adminRoutes } from "../backend/src/routes/admin.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";

let isReady = false;
async function buildApp() {
  if (isReady) return;
  await app.register(cors, { origin: "*" });

  // Register all routes from the backend
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(adminRoutes);
  await app.register(engenhariaRoutes);
  await app.register(execucaoRoutes);
  await app.register(financeiroRoutes);
  await app.register(pessoasRoutes);
  await app.register(suprimentosRoutes);
  await app.register(comercialRoutes);
  await app.register(dashboardRoutes);

  await app.ready();
  isReady = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    // Safety check for empty body
    const payload = req.body || undefined;

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
    console.error("CRITICAL ERROR:", error);
    res.status(500).json({
      error: "Vercel Boot Error",
      message: error.message,
      stack: error.stack
    });
  }
}
