// api/index.ts — Maximum Stability Vercel Handler
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Runtime port override for Supabase Pooler
let dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes(':5432')) {
  dbUrl = dbUrl.replace(':5432', ':6543');
}
if (!dbUrl.includes('pgbouncer=true')) {
  dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

// Global Prisma instance - Inlined to avoid bundling issues
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const app = Fastify({ 
  logger: false,
  pluginTimeout: 30000 
});

// Schemas
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  document: z.string().optional(),
  documentType: z.enum(["cpf", "cnpj"]).optional(),
  planSlug: z.string().default("pro"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

let isReady = false;
async function buildApp() {
  if (isReady) return;
  await app.register(cors, { origin: "*" });

  // --- HEALTH ---
  app.get("/health", async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "connected", timestamp: new Date().toISOString() };
    } catch (err: any) {
      return { status: "error", message: err.message };
    }
  });

  // --- LOGIN ---
  app.post("/auth/login", async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const { email, password } = body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          subscription: {
            include: {
              plan: { include: { features: true } },
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
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        subscription: user.subscription ? {
          status: user.subscription.status,
          plan: user.subscription.plan.name,
          slug: user.subscription.plan.slug,
          features: user.subscription.plan.features.reduce((acc: any, f: any) => {
            acc[f.module] = f.enabled;
            return acc;
          }, {}),
        } : null,
      };
    } catch (err: any) {
      console.error(err);
      return reply.status(500).send({ message: "Erro no login", error: err.message });
    }
  });

  // --- REGISTER ---
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
      return reply.status(500).send({ message: "Erro no registro", error: err.message });
    }
  });

  // --- SESSION CHECK ---
  app.get("/auth/me/:userId", async (request, reply) => {
    try {
      const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: {
            include: { plan: { include: { features: true } } },
          },
        },
      });

      if (!user) return reply.status(404).send({ message: "Não encontrado" });

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        subscription: user.subscription ? {
          status: user.subscription.status,
          plan: user.subscription.plan.name,
          slug: user.subscription.plan.slug,
          features: user.subscription.plan.features.reduce((acc: any, f: any) => {
            acc[f.module] = f.enabled;
            return acc;
          }, {}),
        } : null,
      };
    } catch (err: any) {
      return reply.status(500).send({ message: "Erro na sessão", error: err.message });
    }
  });

  await app.ready();
  isReady = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await buildApp();
    const url = req.url?.replace(/^\/api/, "") || "/";
    
    // Safety check for empty body
    const payload = req.body || undefined;

    const response = await app.inject({
      method: req.method as any,
      url,
      headers: req.headers as any,
      payload,
    });

    res.status(response.statusCode);
    const contentType = response.headers["content-type"];
    if (contentType) res.setHeader("content-type", contentType);
    res.send(response.body);
  } catch (error: any) {
    console.error("CRITICAL ERROR:", error);
    res.status(500).json({
      error: "Vercel Boot Error",
      message: error.message,
      stack: error.stack
    });
  }
}
