// api/index.ts — Consolidated Vercel Handler
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Import all routes
// Note: We use top-level imports now because Prisma is lazy-loaded in lib/prisma.ts
import { engenhariaRoutes } from "../backend/src/routes/engenharia.routes";
import { execucaoRoutes } from "../backend/src/routes/execucao.routes";
import { financeiroRoutes } from "../backend/src/routes/financeiro.routes";
import { pessoasRoutes } from "../backend/src/routes/pessoas.routes";
import { suprimentosRoutes } from "../backend/src/routes/suprimentos.routes";
import { comercialRoutes } from "../backend/src/routes/comercial.routes";
import { dashboardRoutes } from "../backend/src/routes/dashboard.routes";
import { adminRoutes } from "../backend/src/routes/admin.routes";

// Runtime port override for Supabase Pooler
let dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes(':5432')) {
  dbUrl = dbUrl.replace(':5432', ':6543');
}
if (!dbUrl.includes('pgbouncer=true')) {
  dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

// Global Prisma instance for inline routes
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const app = Fastify({ logger: false });

// Schemas
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  document: z.string().optional(),
  documentType: z.enum(["cpf", "cnpj"]).optional(),
  planSlug: z.string(),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

let isReady = false;
async function buildApp() {
  if (isReady) return;
  await app.register(cors, { origin: "*" });

  // Inline Health Check
  app.get("/health", async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "connected" };
    } catch (err) {
      return { status: "error", database: String(err) };
    }
  });

  // Inline Authentication Routes (maintained for maximum stability)
  app.post("/auth/login", async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const { email, password } = body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          subscription: {
            include: {
              plan: {
                include: {
                  features: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        subscription: user.subscription
          ? {
              status: user.subscription.status,
              plan: user.subscription.plan.name,
              slug: user.subscription.plan.slug,
              features: user.subscription.plan.features.reduce(
                (acc: any, f: any) => {
                  acc[f.module] = f.enabled;
                  return acc;
                },
                {} as Record<string, boolean>,
              ),
            }
          : null,
      };
    } catch (err: any) {
      console.error(err);
      return reply.status(500).send({ message: "Erro interno no processo de login", error: err.message });
    }
  });

  app.post("/auth/register", async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      const { name, email, password, document, documentType, planSlug } = body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(400).send({ message: "Email já cadastrado" });
      }

      const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
      if (!plan) {
        return reply.status(404).send({ message: "Plano não encontrado" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            document: document || null,
            documentType: documentType || null,
            role: "user",
          },
        });

        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);

        await tx.subscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status: "trial",
            trialEnd,
          },
        });

        return user;
      });

      return {
        user: { id: result.id, name: result.name, email: result.email },
        message: "Usuário registrado com sucesso"
      };
    } catch (err: any) {
      console.error(err);
      return reply.status(500).send({ 
        message: "Erro no processamento do registro", 
        error: err.message 
      });
    }
  });

  // Register all external routes
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
    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload: req.body,
    });

    res.status(response.statusCode);
    const contentType = response.headers["content-type"];
    if (contentType) res.setHeader("content-type", contentType);
    res.send(response.body);
  } catch (error: any) {
    res.status(500).json({
      error: "Critical Function Crash",
      message: error.message,
      stack: error.stack
    });
  }
}
