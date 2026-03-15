import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function comercialRoutes(app: FastifyInstance) {
  // ===== CLIENTES =====
  app.get('/clientes', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    return prisma.cliente.findMany({
      where: projectId ? { projectId } : {},
      include: { chamados: true },
      orderBy: { nome: 'asc' },
    })
  })

  app.post('/clientes', async (request, reply) => {
    const schema = z.object({
      nome: z.string(),
      unidade: z.string(),
      obra: z.string(),
      progresso: z.number().int().min(0).max(100).default(0),
      entregaPrevista: z.string().optional(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const cliente = await prisma.cliente.create({
      data: { ...body, status: 'em_construcao' },
    })
    return reply.code(201).send(cliente)
  })

  app.put('/clientes/:id', async (request) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      progresso: z.number().int().min(0).max(100).optional(),
      status: z.string().optional(),
      entregaPrevista: z.string().optional(),
    })
    const body = schema.parse(request.body)
    return prisma.cliente.update({ where: { id }, data: body })
  })

  // ===== CHAMADOS =====
  app.get('/chamados', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    return prisma.chamado.findMany({
      where: projectId ? { cliente: { projectId } } : {},
      include: { cliente: { select: { nome: true, unidade: true } } },
      orderBy: { createdAt: 'desc' },
    })
  })

  app.post('/chamados', async (request, reply) => {
    const schema = z.object({
      clienteId: z.string(),
      problema: z.string(),
      prioridade: z.enum(['alta', 'media', 'baixa']),
      garantia: z.boolean().default(true),
    })
    const body = schema.parse(request.body)
    const chamado = await prisma.chamado.create({
      data: { ...body, status: 'aberto' },
    })
    return reply.code(201).send(chamado)
  })

  app.patch('/chamados/:id/agendar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.chamado.update({ where: { id }, data: { status: 'agendado' } })
  })

  app.patch('/chamados/:id/concluir', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.chamado.update({ where: { id }, data: { status: 'concluido' } })
  })
}

export default comercialRoutes;

