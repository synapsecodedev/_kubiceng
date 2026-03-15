import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

<<<<<<< HEAD
// Static imports to ensure Vercel bundles them
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
import { prisma } from "../backend/src/lib/prisma";

=======
>>>>>>> 1a39ddb1614c55327206f8b376ca9935a45fddab
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
    return { status: "alive", time: new Date().toISOString(), bundled: true };
  });

  app.get("/db-check", async () => {
     try {
       await prisma.$queryRaw`SELECT 1`;
       return { status: "connected" };
     } catch (e: any) {
       return { status: "error", error: e.message };
     }
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
      url: request.url
    });
  });

  try {
<<<<<<< HEAD
    console.log("LAMBDA_INIT: Registering Routes...");
    
    const safeRegister = async (name: string, routeFn: any) => {
      console.log(`LAMBDA_INIT: Registering ${name}...`);
      try {
        await app.register(routeFn as any);
      } catch (e: any) {
        console.error(`LAMBDA_INIT: Failed to register ${name}`, e);
        throw new Error(`Registration Failure: ${name} -> ${e.message}`);
      }
    };

    await safeRegister("healthRoutes", healthRoutes);
    await safeRegister("authRoutes", authRoutes);
    await safeRegister("profileRoutes", profileRoutes);
    await safeRegister("adminRoutes", adminRoutes);
    await safeRegister("engenhariaRoutes", engenhariaRoutes);
    await safeRegister("execucaoRoutes", execucaoRoutes);
    await safeRegister("financeiroRoutes", financeiroRoutes);
    await safeRegister("pessoasRoutes", pessoasRoutes);
    await safeRegister("suprimentosRoutes", suprimentosRoutes);
    await safeRegister("comercialRoutes", comercialRoutes);
    await safeRegister("dashboardRoutes", dashboardRoutes);
=======
    console.log("LAMBDA_INIT: Registering Routes (Dynamic)...");
    
    // Helper to register routes with isolation
    const register = async (name: string, path: string) => {
      console.log(`LAMBDA_INIT: Loading ${name}...`);
      try {
        const module = await import(path);
        const routeFn = module[name] || module.default;
        await app.register(routeFn as any);
      } catch (e: any) {
        console.error(`LAMBDA_INIT: Failed to load ${name}`, e);
        throw new Error(`Module Load Failure: ${name} -> ${e.message}`);
      }
    };

    await register("healthRoutes", "../backend/src/routes/health.routes");
    await register("authRoutes", "../backend/src/routes/auth.routes");
    await register("profileRoutes", "../backend/src/routes/profile.routes");
    await register("adminRoutes", "../backend/src/routes/admin.routes");
    await register("engenhariaRoutes", "../backend/src/routes/engenharia.routes");
    await register("execucaoRoutes", "../backend/src/routes/execucao.routes");
    await register("financeiroRoutes", "../backend/src/routes/financeiro.routes");
    await register("pessoasRoutes", "../backend/src/routes/pessoas.routes");
    await register("suprimentosRoutes", "../backend/src/routes/suprimentos.routes");
    await register("comercialRoutes", "../backend/src/routes/comercial.routes");
    await register("dashboardRoutes", "../backend/src/routes/dashboard.routes");
>>>>>>> 1a39ddb1614c55327206f8b376ca9935a45fddab

    await app.ready();
    isConfigured = true;
    console.log("LAMBDA_INIT: Configuration Complete");
  } catch (err: any) {
    console.error("DIAGNOSTIC: Configuration Failed", err);
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await configureApp();
    
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
