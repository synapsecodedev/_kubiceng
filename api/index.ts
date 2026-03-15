// api/index.ts — Consolidated Vercel Handler
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

// Global Prisma instance
const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const app = Fastify({ logger: false });

// Registration Schema
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  document: z.string().optional(),
  documentType: z.enum(["cpf", "cnpj"]).optional(),
  planSlug: z.string(),
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

  // Inline Registration
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

      const result = await prisma.$transaction(async (tx) => {
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
