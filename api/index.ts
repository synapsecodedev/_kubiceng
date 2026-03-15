import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";

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

    // Dynamic imports to prevent boot-time crashes
    const { authRoutes } = await import("../backend/src/routes/auth.routes") as any;
    const { engenhariaRoutes } = await import("../backend/src/routes/engenharia.routes") as any;
    const { dashboardRoutes } = await import("../backend/src/routes/dashboard.routes") as any;
    const { financeiroRoutes } = await import("../backend/src/routes/financeiro.routes") as any;
    const { suprimentosRoutes } = await import("../backend/src/routes/suprimentos.routes") as any;
    const { execucaoRoutes } = await import("../backend/src/routes/execucao.routes") as any;
    const { pessoasRoutes } = await import("../backend/src/routes/pessoas.routes") as any;
    const { comercialRoutes } = await import("../backend/src/routes/comercial.routes") as any;
    const { adminRoutes } = await import("../backend/src/routes/admin.routes") as any;
    const { healthRoutes } = await import("../backend/src/routes/health.routes") as any;

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
      error: "Vercel Worker Error (Fixed Path)",
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
