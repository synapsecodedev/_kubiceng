import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

// Core routes only for stability test
import { authRoutes } from "../backend/src/routes/auth.routes";
import { engenhariaRoutes } from "../backend/src/routes/engenharia.routes";
import { healthRoutes } from "../backend/src/routes/health.routes";
import { profileRoutes } from "../backend/src/routes/profile.routes";
import { adminRoutes } from "../backend/src/routes/admin.routes";
import { prisma } from "../backend/src/lib/prisma";

console.log("LAMBDA_INIT: Module Load Started");

const app = fastify({ 
  logger: true,
  pluginTimeout: 10000 
});

let isConfigured = false;

// Global process listeners for hidden crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("CRITICAL: Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("CRITICAL: Uncaught Exception:", err);
});

async function configureApp() {
  if (isConfigured) return;
  
  console.log("LAMBDA_INIT: Configuring plugins...");
  await app.register(cors, { origin: "*" });
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

  // Minimal test endpoints
  app.get("/test-ping", async () => {
    return { status: "alive", core_only: true, time: new Date().toISOString() };
  });

  app.get("/test-env", async () => {
    return { 
      keys: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("SUPABASE")),
      node: process.version
    };
  });

  app.setErrorHandler((error: any, request, reply) => {
    console.error("FASTIFY ERROR:", error);
    reply.status(500).send({ error: "Internal Error", message: error.message });
  });

  try {
    console.log("LAMBDA_INIT: Registering Core Routes...");
    await app.register(healthRoutes as any);
    await app.register(authRoutes as any);
    await app.register(profileRoutes as any);
    await app.register(adminRoutes as any);
    await app.register(engenhariaRoutes as any);

    console.log("LAMBDA_INIT: Waiting for app.ready()...");
    await app.ready();
    
    isConfigured = true;
    console.log("LAMBDA_INIT: Boot Success");
  } catch (err: any) {
    console.error("LAMBDA_INIT: Boot Failed", err);
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
    if (response.headers["content-type"]) {
      res.setHeader("content-type", response.headers["content-type"]);
    }
    res.send(response.body);
    
  } catch (error: any) {
    console.error("HANDLER FATAL:", error);
    res.status(500).json({
      error: "Fatal Crash",
      message: error.message,
      stack: error.stack
    });
  }
}
