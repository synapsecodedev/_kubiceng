import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function adminRoutes(app: FastifyInstance) {
  // Middleware simples para verificar se é superadmin (em uma app real usaria JWT/roles no request)
  app.addHook('preHandler', async (request, reply) => {
    // Por enquanto passaremos o id do admin no header para simplificar
    const adminId = request.headers['x-admin-id'] as string
    if (!adminId) return

    const admin = await prisma.user.findUnique({ where: { id: adminId } })
    if (!admin || admin.role !== 'superadmin') {
      return reply.status(403).send({ message: 'Acesso negado: Somente superadministradores' })
    }
  })

  // Dashboard Admin KPIs
  app.get('/admin/dashboard', async () => {
    const [
      totalUsers,
      totalPlans,
      activeSubscriptions,
      trialSubscriptions,
      plansDistribution,
      revenueByPlan,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.plan.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.count({ where: { status: 'trial' } }),
      prisma.plan.findMany({
        select: {
          name: true,
          slug: true,
          _count: { select: { subscriptions: true } },
        },
      }),
      prisma.plan.findMany({
        select: {
          name: true,
          slug: true,
          price: true,
          _count: {
            select: {
              subscriptions: { where: { status: 'active' } },
            },
          },
        },
      }),
    ])

    const totalMRR = revenueByPlan.reduce((acc, p) => acc + (p.price * p._count.subscriptions), 0)

    return {
      kpis: {
        totalContas: totalUsers,
        totalPlanos: totalPlans,
        assinaturasAtivas: activeSubscriptions,
        assinaturasTrial: trialSubscriptions,
        mrr: totalMRR,
      },
      planos: plansDistribution.map(p => ({
        nome: p.name,
        slug: p.slug,
        quantidade: p._count.subscriptions,
      })),
      financeiro: revenueByPlan.map(p => ({
        nome: p.name,
        receita: p.price * p._count.subscriptions,
        assinantes: p._count.subscriptions,
      })),
    }
  })

  // Lista de Contas/Usuários
  app.get('/admin/users', async () => {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return users.map(u => ({
      id: u.id,
      nome: u.name,
      email: u.email,
      documento: u.document,
      tipoDocumento: u.documentType,
      plano: u.subscription?.plan.name ?? 'Sem Plano',
      status: u.subscription?.status ?? 'Inativo',
      dataCriacao: u.createdAt,
    }))
  })

  // Alterar Status da Assinatura
  app.patch('/admin/users/:id/status', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params)
    const { status } = z.object({ status: z.string() }).parse(request.body)

    const subscription = await prisma.subscription.findUnique({ where: { userId: id } })
    if (!subscription) {
      return reply.status(404).send({ message: 'Assinatura não encontrada' })
    }

    await prisma.subscription.update({
      where: { userId: id },
      data: { status },
    })

    return { message: 'Status atualizado com sucesso' }
  })

  // Gestão de Planos
  app.get('/admin/plans', async () => {
    return prisma.plan.findMany({
      include: {
        features: true,
      },
      orderBy: { price: 'asc' },
    })
  })

  // Atualizar Plano (features e limites)
  app.patch('/admin/plans/:id', async (request, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params)
    const planSchema = z.object({
      price: z.number().optional(),
      maxUsers: z.number().optional(),
      maxProjects: z.number().optional(),
      features: z.array(z.object({
        module: z.string(),
        enabled: z.boolean(),
      })).optional(),
    })

    const data = planSchema.parse(request.body)

    await prisma.$transaction(async (tx) => {
      // Atualiza campos básicos
      if (data.price !== undefined || data.maxUsers !== undefined || data.maxProjects !== undefined) {
        await tx.plan.update({
          where: { id },
          data: {
            price: data.price,
            maxUsers: data.maxUsers,
            maxProjects: data.maxProjects,
          },
        })
      }

      // Atualiza features
      if (data.features) {
        for (const f of data.features) {
          await tx.planFeature.update({
            where: {
              planId_module: {
                planId: id,
                module: f.module,
              },
            },
            data: { enabled: f.enabled },
          })
        }
      }
    })

    return { message: 'Plano atualizado com sucesso' }
  })
}

export default adminRoutes;
