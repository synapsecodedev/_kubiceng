import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  // Login
  app.post('/auth/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginSchema.parse(request.body)

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
    })

    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Credenciais inválidas' })
    }

    // Retorna dados do user + plano + features
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      subscription: user.subscription ? {
        status: user.subscription.status,
        plan: user.subscription.plan.name,
        slug: user.subscription.plan.slug,
        features: user.subscription.plan.features.reduce((acc, f) => {
          acc[f.module] = f.enabled
          return acc
        }, {} as Record<string, boolean>),
      } : null,
    }
  })

  // Registro (Cria conta e assinatura)
  app.post('/auth/register', async (request, reply) => {
    const registerSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      document: z.string().optional(),
      documentType: z.enum(['cpf', 'cnpj']).optional(),
      planSlug: z.string().default('pro'),
    })

    const { name, email, password, document, documentType, planSlug } = registerSchema.parse(request.body)

    // Verifica se user já existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return reply.status(400).send({ message: 'Email já cadastrado' })
    }

    // Busca o plano escolhido
    const plan = await prisma.plan.findUnique({ where: { slug: planSlug } })
    if (!plan) {
      return reply.status(404).send({ message: 'Plano não encontrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Cria o usuário e a assinatura em uma transação
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          document,
          documentType,
          role: 'user',
        },
      })

      const trialDays = 7
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + trialDays)

      const subscription = await tx.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: 'trial',
          trialEnd,
        },
        include: {
          plan: {
            include: {
              features: true,
            },
          },
        },
      })

      return { user, subscription }
    })

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      subscription: {
        status: result.subscription.status,
        plan: result.subscription.plan.name,
        slug: result.subscription.plan.slug,
        features: result.subscription.plan.features.reduce((acc, f) => {
          acc[f.module] = f.enabled
          return acc
        }, {} as Record<string, boolean>),
      },
    }
  })

  // Get Me (Verificar sessão/dados atuais)
  app.get('/auth/me/:userId', async (request, reply) => {
    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params)

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
    })

    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado' })
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      subscription: user.subscription ? {
        status: user.subscription.status,
        plan: user.subscription.plan.name,
        slug: user.subscription.plan.slug,
        features: user.subscription.plan.features.reduce((acc, f) => {
          acc[f.module] = f.enabled
          return acc
        }, {} as Record<string, boolean>),
      } : null,
    }
  })
}
