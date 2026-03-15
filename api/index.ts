import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";

// Static imports using backend alias for Vercel stability
import { authRoutes } from "backend/routes/auth.routes";
import { engenhariaRoutes } from "backend/routes/engenharia.routes";
import { dashboardRoutes } from "backend/routes/dashboard.routes";
import { financeiroRoutes } from "backend/routes/financeiro.routes";
import { suprimentosRoutes } from "backend/routes/suprimentos.routes";
import { execucaoRoutes } from "backend/routes/execucao.routes";
import { pessoasRoutes } from "backend/routes/pessoas.routes";
import { comercialRoutes } from "backend/routes/comercial.routes";
import { adminRoutes } from "backend/routes/admin.routes";
import { healthRoutes } from "backend/routes/health.routes";
import { profileRoutes } from "backend/routes/profile.routes";

const app = fastify({ 
  logger: true,
  pluginTimeout: 30000 
});

let isReady = false;

async function buildApp() {
  if (isReady) return;
  
  await app.register(cors, { origin: "*" });

  try {
    // Environmental sanity check
    if (!process.env.DATABASE_URL) {
      console.warn("DIAGNOSTIC: DATABASE_URL is missing from environment");
    }

    // Register all routes
    await app.register(healthRoutes);
    await app.register(authRoutes);
    await app.register(profileRoutes);
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
  } catch (err: any) {
    console.error("DIAGNOSTIC: Route Registration Failed", err);
    throw err;
  }
}

// Set global error handler
app.setErrorHandler((error: any, request, reply) => {
  console.error("FASTIFY ERROR:", error);
  reply.status(500).send({
    error: "Fastify Error",
    message: error.message,
    url: request.url,
  });
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload: req.body || undefined,
    });

    res.status(response.statusCode);
    const contentType = response.headers["content-type"];
    if (contentType) res.setHeader("content-type", contentType);
    res.send(response.body);
  } catch (error: any) {
    console.error("HANDLER CRASH:", error);
    res.status(500).json({
      error: "Vercel Worker Error (Alias Resolution)",
      message: error.message,
      stack: error.stack,
      diagnostics: {
        isReady,
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL
      }
    });
  }
}
