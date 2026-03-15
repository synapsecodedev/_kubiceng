import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";

console.log("LAMBDA_INIT: Starting FULL KubicEng API Handler");

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

const app = fastify({ 
  logger: true,
  pluginTimeout: 30000 
});

let isReady = false;

async function buildApp() {
  if (isReady) return;
  console.log("LAMBDA_INIT: Building App...");
  
  await app.register(cors, { origin: "*" });

  app.get("/ping", async () => {
    return { status: "pong", timestamp: new Date().toISOString() };
  });

  try {
    // Register all routes
    console.log("LAMBDA_INIT: Registering healthRoutes...");
    await app.register(healthRoutes);
    console.log("LAMBDA_INIT: Registering authRoutes...");
    await app.register(authRoutes);
    console.log("LAMBDA_INIT: Registering profileRoutes...");
    await app.register(profileRoutes);
    console.log("LAMBDA_INIT: Registering adminRoutes...");
    await app.register(adminRoutes);
    console.log("LAMBDA_INIT: Registering other business routes...");
    await app.register(engenhariaRoutes);
    await app.register(execucaoRoutes);
    await app.register(financeiroRoutes);
    await app.register(pessoasRoutes);
    await app.register(suprimentosRoutes);
    await app.register(comercialRoutes);
    await app.register(dashboardRoutes);

    console.log("LAMBDA_INIT: Calling app.ready()...");
    await app.ready();
    isReady = true;
    console.log("LAMBDA_INIT: App is Ready");
  } catch (err: any) {
    console.error("DIAGNOSTIC: Route Registration Failed", err);
    // Attach current registration stage if helpful
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
      error: "Vercel Worker Error",
      message: error.message,
      stack: error.stack,
      diag: "Crash in unified handler registration or execution"
    });
  }
}

// SELF TEST (only runs if executed directly via npx tsx)
if (process.argv[1].endsWith('index.ts')) {
   console.log("SELF TEST STARTING...");
   buildApp().then(() => {
     console.log("SELF TEST SUCCESS: App built successfully");
     process.exit(0);
   }).catch(err => {
     console.error("SELF TEST FAILED:", err);
     process.exit(1);
   });
}
