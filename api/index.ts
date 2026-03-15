import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

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
