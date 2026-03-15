import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

// Relative imports
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
import { profileRoutes } from "../backend/src/routes/profile.routes";

console.log("LAMBDA_INIT: Module Load");

const app = fastify({ 
  logger: true,
  pluginTimeout: 30000 
});

let isConfigured = false;

async function configureApp() {
  if (isConfigured) return;
  
  console.log("LAMBDA_INIT: Configuring Fastify...");
  
  await app.register(cors, { origin: "*" });
  
  app.get("/test-ping", async () => {
    return { status: "alive", time: new Date().toISOString() };
  });

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  });

  // Global Error Handler
  app.setErrorHandler((error: any, request, reply) => {
    console.error("FASTIFY INTERNAL ERROR:", error);
    reply.status(500).send({
      error: "Fastify Internal Error",
      message: error.message,
      code: error.code,
      url: request.url
    });
  });

  try {
    console.log("LAMBDA_INIT: Registering healthRoutes...");
    await app.register(healthRoutes as any);
    
    console.log("LAMBDA_INIT: Registering authRoutes...");
    await app.register(authRoutes as any);
    
    console.log("LAMBDA_INIT: Registering profileRoutes...");
    await app.register(profileRoutes as any);
    
    console.log("LAMBDA_INIT: Registering adminRoutes...");
    await app.register(adminRoutes as any);
    
    console.log("LAMBDA_INIT: Registering domain routes...");
    await app.register(engenhariaRoutes as any);
    await app.register(execucaoRoutes as any);
    await app.register(financeiroRoutes as any);
    await app.register(pessoasRoutes as any);
    await app.register(suprimentosRoutes as any);
    await app.register(comercialRoutes as any);
    await app.register(dashboardRoutes as any);

    console.log("LAMBDA_INIT: Calling app.ready()...");
    await app.ready();
    isConfigured = true;
    console.log("LAMBDA_INIT: Configuration Complete");
  } catch (err: any) {
    console.error("DIAGNOSTIC: Configuration Failed at stage:", isConfigured ? "Ready" : "Registration", err);
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await configureApp();
    
    // Normalize URL: remove /api prefix if present
    const url = req.url?.replace(/^\/api/, "") || "/";
    console.log(`LAMBDA_EXEC: ${req.method} ${url}`);
    
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
    console.error("HANDLER FATAL ERROR:", error);
    res.status(500).json({
      error: "Vercel Handler Crash",
      message: error.message,
      stack: error.stack,
      diag: "Failure in configureApp or injection"
    });
  }
}
