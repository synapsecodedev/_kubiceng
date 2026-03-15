import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  // Login
  app.post("/auth/login", async (request, reply) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
      });

      const parseResult = loginSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply
          .status(400)
          .send({
            message: "Dados inválidos",
            details: parseResult.error.flatten(),
          });
      }

      const { email, password } = parseResult.data;

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

      // Retorna dados do user + plano + features
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: (user as any).avatarUrl,
          companyName: (user as any).companyName,
          companyCnpj: (user as any).companyCnpj,
          companyAddress: (user as any).companyAddress,
          companyLogoUrl: (user as any).companyLogoUrl,
        },
        subscription: user.subscription
          ? {
               status: user.subscription.status,
               plan: user.subscription.plan.name,
               slug: user.subscription.plan.slug,
               features: user.subscription.plan.features.reduce(
                 (acc, f) => {
                   acc[f.module] = f.enabled;
                   return acc;
                 },
                 {} as Record<string, boolean>,
               ),
             }
          : null,
      };
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      return reply.status(500).send({ 
        message: "Erro interno no servidor", 
        error: String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
    }
  });

  // Registro (Cria conta e assinatura)
  app.post("/auth/register", async (request, reply) => {
    try {
      const registerSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        document: z.string().optional(),
        documentType: z.enum(["cpf", "cnpj"]).optional(),
        planSlug: z.string().default("pro"),
      });

      const parseResult = registerSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply
          .status(400)
          .send({
            message: "Dados inválidos",
            details: parseResult.error.flatten(),
          });
      }

      console.log('--- Register Request Received ---', request.body);
      const { name, email, password, document, documentType, planSlug } =
        parseResult.data;

      console.log('1. Checking existing user for:', email);
      // Verifica se user já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        console.log('   User already exists');
        return reply.status(400).send({ message: "Email já cadastrado" });
      }

      console.log('2. Finding plan for slug:', planSlug);
      // Busca o plano escolhido
      const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
      if (!plan) {
        console.log('   Plan not found');
        return reply.status(404).send({ message: "Plano não encontrado" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // Cria o usuário e a assinatura em uma transação
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            document,
            documentType,
            role: "user",
          },
        });

        const trialDays = 7;
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + trialDays);

        const subscription = await tx.subscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status: "trial",
            trialEnd,
          },
          include: {
            plan: {
              include: {
                features: true,
              },
            },
          },
        });

        return { user, subscription };
      });

      return {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          avatarUrl: (result.user as any).avatarUrl,
          companyName: (result.user as any).companyName,
          companyCnpj: (result.user as any).companyCnpj,
          companyAddress: (result.user as any).companyAddress,
          companyLogoUrl: (result.user as any).companyLogoUrl,
        },
        subscription: {
          status: result.subscription.status,
          plan: result.subscription.plan.name,
          slug: result.subscription.plan.slug,
          features: result.subscription.plan.features.reduce(
            (acc, f) => {
              acc[f.module] = f.enabled;
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        },
      };
    } catch (err) {
      console.error('FATAL REGISTRATION ERROR:', err);
      return reply
        .status(500)
        .send({ 
          message: "Erro ao registrar usuário", 
          error: String(err),
          stack: err instanceof Error ? err.stack : undefined
        });
    }
  });

  // Sync (Google Login / OAuth)
  app.post("/auth/sync", async (request, reply) => {
    try {
      const syncSchema = z.object({
        email: z.string().email(),
        name: z.string(),
        avatarUrl: z.string().url().optional(),
      });

      const parseResult = syncSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply.status(400).send({
          message: "Dados inválidos",
          details: parseResult.error.flatten(),
        });
      }

      const { email, name, avatarUrl } = parseResult.data;

      // Busca user ou cria um novo se não existir
      let user = await prisma.user.findUnique({
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
        // Se não existir, cria com plano pro (trial)
        const plan = await prisma.plan.findUnique({ where: { slug: "pro" } });
        if (!plan) {
          return reply.status(404).send({ message: "Plano padrão não encontrado" });
        }

        user = await prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              email,
              name,
              avatarUrl,
              passwordHash: "", // Login social não usa senha local
              role: "user",
            } as any,
          });

          const trialDays = 7;
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + trialDays);

          await tx.subscription.create({
            data: {
              userId: newUser.id,
              planId: plan.id,
              status: "trial",
              trialEnd,
            },
          });

          return tx.user.findUnique({
            where: { id: newUser.id },
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
        });
      }

      if (!user) {
        return reply.status(500).send({ message: "Falha ao sincronizar usuário" });
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: (user as any).avatarUrl,
          companyName: (user as any).companyName,
          companyCnpj: (user as any).companyCnpj,
          companyAddress: (user as any).companyAddress,
          companyLogoUrl: (user as any).companyLogoUrl,
        },
        subscription: user.subscription
          ? {
               status: user.subscription.status,
               plan: user.subscription.plan.name,
               slug: user.subscription.plan.slug,
               features: user.subscription.plan.features.reduce(
                 (acc, f) => {
                   acc[f.module] = f.enabled;
                   return acc;
                 },
                 {} as Record<string, boolean>,
               ),
             }
          : null,
      };
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ message: "Erro na sincronização", error: String(err) });
    }
  });

  // Get Me (Verificar sessão/dados atuais)
  app.get("/auth/me/:userId", async (request, reply) => {
    try {
      const { userId } = z
        .object({ userId: z.string().uuid() })
        .parse(request.params);

      const user = await prisma.user.findUnique({
        where: { id: userId },
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
        return reply.status(404).send({ message: "Usuário não encontrado" });
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: (user as any).avatarUrl,
          companyName: (user as any).companyName,
          companyCnpj: (user as any).companyCnpj,
          companyAddress: (user as any).companyAddress,
          companyLogoUrl: (user as any).companyLogoUrl,
        },
        subscription: user.subscription
          ? {
               status: user.subscription.status,
               plan: user.subscription.plan.name,
               slug: user.subscription.plan.slug,
               features: user.subscription.plan.features.reduce(
                 (acc, f) => {
                   acc[f.module] = f.enabled;
                   return acc;
                 },
                 {} as Record<string, boolean>,
               ),
             }
          : null,
      };
    } catch (err) {
      console.error(err);
      return reply
        .status(500)
        .send({ message: "Erro interno", error: String(err) });
    }
  });
}

export default authRoutes;
