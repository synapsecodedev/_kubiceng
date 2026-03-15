// api/index.ts — Vercel Serverless Function entry point
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { engenhariaRoutes } from "../backend/src/routes/engenharia.routes";
import { execucaoRoutes } from "../backend/src/routes/execucao.routes";
import { financeiroRoutes } from "../backend/src/routes/financeiro.routes";
import { pessoasRoutes } from "../backend/src/routes/pessoas.routes";
import { suprimentosRoutes } from "../backend/src/routes/suprimentos.routes";
import { comercialRoutes } from "../backend/src/routes/comercial.routes";
import { dashboardRoutes } from "../backend/src/routes/dashboard.routes";
import { authRoutes } from "../backend/src/routes/auth.routes";
import { adminRoutes } from "../backend/src/routes/admin.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";

const app = Fastify({ logger: false });

let isReady = false;
async function buildApp() {
  if (isReady) return;
  await app.register(cors, { origin: "*" });
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
    // Basic diagnostic for root API calls
    if (req.url === '/api' || req.url === '/api/') {
      return res.status(200).json({ 
        status: "kubic_api_ready", 
        message: "KubicEng API is online and functional."
      });
    }

    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    // Fastify's inject expects payload as string/buffer if we want it to parse it as JSON
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
      error: "Internal Server Error (api/index.ts)",
      message: error.message,
      stack: error.stack,
    });
  }
}
