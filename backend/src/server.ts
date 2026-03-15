import fastify from "fastify";
import cors from "@fastify/cors";
import { engenhariaRoutes } from "./routes/engenharia.routes";
import { execucaoRoutes } from "./routes/execucao.routes";
import { financeiroRoutes } from "./routes/financeiro.routes";
import { pessoasRoutes } from "./routes/pessoas.routes";
import { suprimentosRoutes } from "./routes/suprimentos.routes";
import { comercialRoutes } from "./routes/comercial.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { authRoutes } from "./routes/auth.routes";
import { adminRoutes } from "./routes/admin.routes";
import { healthRoutes } from "./routes/health.routes";
import { profileRoutes } from "./routes/profile.routes";
import multipart from "@fastify/multipart";
import { prisma } from "./lib/prisma";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(healthRoutes);
app.register(authRoutes);
app.register(adminRoutes);
app.register(engenhariaRoutes);
app.register(execucaoRoutes);
app.register(financeiroRoutes);
app.register(pessoasRoutes);
app.register(suprimentosRoutes);
app.register(comercialRoutes);
app.register(dashboardRoutes);
app.register(profileRoutes);
app.register(multipart);

app.get("/test-db", async (request, reply) => {
  try {
    const result = await (prisma as any).$queryRaw`SELECT 1 as connected`;
    return { success: true, result };
  } catch (err) {
    return reply.status(500).send({ 
      success: false, 
      error: String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
  }
});

const port = Number(process.env.PORT) || 3333;

app.listen({ 
  port,
  host: "0.0.0.0" 
}).then(() => {
  console.log(`HTTP Server running on port ${port}`);
});
