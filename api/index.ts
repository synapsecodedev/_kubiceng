// api/index.ts — Cleaned Vercel Handler
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";

// Import central prisma (lazy-loaded proxy) - ensuring it's loaded
import "../backend/src/lib/prisma";

// Import all routes
import { engenhariaRoutes } from "../backend/src/routes/engenharia.routes";
import { execucaoRoutes } from "../backend/src/routes/execucao.routes";
import { financeiroRoutes } from "../backend/src/routes/financeiro.routes";
import { pessoasRoutes } from "../backend/src/routes/pessoas.routes";
import { suprimentosRoutes } from "../backend/src/routes/suprimentos.routes";
import { comercialRoutes } from "../backend/src/routes/comercial.routes";
import { dashboardRoutes } from "../backend/src/routes/dashboard.routes";
import { adminRoutes } from "../backend/src/routes/admin.routes";
import { authRoutes } from "../backend/src/routes/auth.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";

const app = Fastify({ 
  logger: false,
  pluginTimeout: 30000 
});

let isReady = false;
async function buildApp() {
  if (isReady) return;
  
  await app.register(cors, { origin: "*" });
  
  // Register routes - NO DUPLICATES
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
    
    // Inject the request into Fastify
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
    console.error("VERCEL API CRITICAL ERROR:", error);
    res.status(500).json({
      error: "Vercel Boot/Execution Error",
      message: error.message,
      stack: error.stack,
    });
  }
}
