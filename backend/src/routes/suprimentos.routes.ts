import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function suprimentosRoutes(app: FastifyInstance) {
  // ===== REQUISIÇÕES =====
  app.get('/requisicoes', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const userId = request.headers['x-user-id'] as string;

    const filter: any = projectId ? { projectId } : {}
    if (userId && !projectId) {
      filter.project = { userId };
    }

    return prisma.requisicao.findMany({
      where: filter,
      include: { cotacoes: true },
      orderBy: { createdAt: 'desc' },
    })
  })

  app.post('/requisicoes', async (request, reply) => {
    const schema = z.object({
      item: z.string(),
      obra: z.string(),
      solicitante: z.string(),
      valor: z.number().positive(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const req = await prisma.requisicao.create({
      data: { ...body, status: 'pendente_aprovacao' },
    })
    return reply.code(201).send(req)
  })

  app.patch('/requisicoes/:id/aprovar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.requisicao.update({ where: { id }, data: { status: 'aprovado' } })
  })

  app.patch('/requisicoes/:id/cotar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.requisicao.update({ where: { id }, data: { status: 'cotacao' } })
  })

  // ===== COTAÇÕES =====
  app.get('/cotacoes', async (request) => {
    const userId = request.headers['x-user-id'] as string;
    const filter = userId ? { requisicao: { project: { userId } } } : {};

    return prisma.cotacao.findMany({
      where: filter as any,
      include: { requisicao: true },
      orderBy: { createdAt: 'desc' },
    })
  })

  app.post('/cotacoes', async (request, reply) => {
    const schema = z.object({
      requisicaoId: z.string(),
      fornecedor: z.string(),
      preco: z.number().positive(),
      prazo: z.string(),
      condicao: z.string(),
    })
    const body = schema.parse(request.body)
    const cotacao = await prisma.cotacao.create({ data: body })
    return reply.code(201).send(cotacao)
  })

  app.patch('/cotacoes/:id/selecionar', async (request) => {
    const { id } = request.params as { id: string }
    const cotacao = await prisma.cotacao.findUnique({ 
      where: { id },
      include: { requisicao: true }
    })
    if (!cotacao) return
    // Desmarcar todas da mesma requisição
    await prisma.cotacao.updateMany({
      where: { requisicaoId: cotacao.requisicaoId },
      data: { selecionada: false },
    })
    // Marcar a selecionada e criar OC
    const [updated] = await prisma.$transaction([
      prisma.cotacao.update({ where: { id }, data: { selecionada: true } }),
      prisma.ordemCompra.create({
        data: {
          fornecedor: cotacao.fornecedor,
          valor: cotacao.preco,
          status: 'aguardando',
          projectId: cotacao.requisicao.projectId,
        },
      }),
    ])
    return updated
  })

  // ===== ORDENS DE COMPRA =====
  app.get('/ordens-compra', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const userId = request.headers['x-user-id'] as string;

    const filter: any = projectId ? { projectId } : {}
    if (userId && !projectId) {
      filter.project = { userId };
    }

    return prisma.ordemCompra.findMany({ 
      where: filter,
      orderBy: { createdAt: 'desc' } 
    })
  })

  app.post('/ordens-compra', async (request, reply) => {
    const schema = z.object({
      fornecedor: z.string(),
      valor: z.number().positive(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const oc = await prisma.ordemCompra.create({ data: { ...body, status: 'aguardando' } })
    return reply.code(201).send(oc)
  })

  app.patch('/ordens-compra/:id/status', async (request) => {
    const { id } = request.params as { id: string }
    const schema = z.object({ status: z.enum(['aguardando', 'transito', 'entregue', 'cancelado']) })
    const body = schema.parse(request.body)
    return prisma.ordemCompra.update({ where: { id }, data: { status: body.status } })
  })
}

export default suprimentosRoutes;

