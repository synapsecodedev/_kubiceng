import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Direct Prisma Instance for the handler
const prisma = new PrismaClient();

console.log("LAMBDA_INIT: Self-Contained Handler Loading");

const app = fastify({ logger: true });

let isConfigured = false;

async function configureApp() {
  if (isConfigured) return;
  
  await app.register(cors, { origin: "*" });
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

  // Minimal Diagnostic
  app.get("/test-ping", async () => {
    return { status: "alive", type: "self-contained", version: "1.2.0", time: new Date().toISOString() };
  });

  // Self-contained Health
  app.get("/health", async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "connected" };
    } catch (error: any) {
      return reply.status(500).send({ status: "error", message: error.message });
    }
  });

  // Self-contained Login (minimal version)
  app.post("/auth/login", async (request, reply) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
      });

      const parseResult = loginSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ message: "Dados inválidos", details: parseResult.error.flatten() });
      }

      const { email, password } = parseResult.data;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { subscription: true }
      });

      if (!user) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: "Credenciais inválidas" });
      }

      // Return user data (matching frontend expectations as much as possible)
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription
        }
      };
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      return reply.status(500).send({ message: "Erro interno no login", error: error.message });
    }
  });

  await app.ready();
  isConfigured = true;
  console.log("LAMBDA_INIT: Self-Contained Boot Success");
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
      error: "Fatal Crash Self-Contained",
      message: error.message,
      stack: error.stack
    });
  }
}
