import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

// Import all routes from backend
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
import { profileRoutes } from "../backend/src/routes/profile.routes";

console.log("LAMBDA_INIT: Global Handlers Loading");

const app = fastify({ logger: true });

let isConfigured = false;

async function configureApp() {
  if (isConfigured) return;
  
  await app.register(cors, { 
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });
  
  await app.register(multipart);

  // Register all backend modules
  await app.register(healthRoutes as any);
  await app.register(authRoutes as any);
  await app.register(adminRoutes as any);
  await app.register(engenhariaRoutes as any);
  await app.register(execucaoRoutes as any);
  await app.register(financeiroRoutes as any);
  await app.register(pessoasRoutes as any);
  await app.register(suprimentosRoutes as any);
  await app.register(comercialRoutes as any);
  await app.register(dashboardRoutes as any);
  await app.register(profileRoutes as any);

  await app.ready();
  isConfigured = true;
  console.log("LAMBDA_INIT: Global Boot Success");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await configureApp();
    
    // Normalize URL for Fastify inject (remove /api prefix)
    const url = req.url?.replace(/^\/api/, "") || "/";
    console.log(`LAMBDA_EXEC: ${req.method} ${url}`);
    
    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload: req.body || undefined,
    });

    res.status(response.statusCode);
    
    // Copy headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        res.setHeader(key, value);
      }
    });

    res.send(response.body);
    
  } catch (error: any) {
    console.error("HANDLER FATAL:", error);
    res.status(500).json({
      error: "Fatal Lambda Crash",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}
