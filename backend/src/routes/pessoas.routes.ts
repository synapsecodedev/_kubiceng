import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function pessoasRoutes(app: FastifyInstance) {
  // ===== FUNCIONÁRIOS =====
  app.get('/funcionarios', async () => {
    return prisma.funcionario.findMany({ orderBy: { nome: 'asc' } })
  })

  app.get('/funcionarios/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const func = await prisma.funcionario.findUnique({
      where: { id },
      include: { registrosPonto: { orderBy: { data: 'desc' }, take: 30 } },
    })
    if (!func) return reply.code(404).send({ message: 'Funcionário não encontrado' })
    return func
  })

  app.post('/funcionarios', async (request, reply) => {
    const schema = z.object({
      nome: z.string(),
      funcao: z.string(),
      obra: z.string(),
      tipo: z.enum(['proprio', 'terceiro']),
      nr35: z.string().optional(),
      nr10: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const func = await prisma.funcionario.create({
      data: { ...body, status: 'ativo' },
    })
    return reply.code(201).send(func)
  })

  app.put('/funcionarios/:id', async (request) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      nome: z.string().optional(),
      funcao: z.string().optional(),
      obra: z.string().optional(),
      tipo: z.enum(['proprio', 'terceiro']).optional(),
      status: z.string().optional(),
      nr35: z.string().optional(),
      nr10: z.string().optional(),
    })
    const body = schema.parse(request.body)
    return prisma.funcionario.update({ where: { id }, data: body })
  })

  // ===== EPIs =====
  app.get('/epis', async () => {
    return prisma.itemEpi.findMany({ orderBy: { item: 'asc' } })
  })

  app.post('/epis', async (request, reply) => {
    const schema = z.object({
      item: z.string(),
      qtdDisponivel: z.number().int(),
      qtdMinima: z.number().int(),
    })
    const body = schema.parse(request.body)
    const epi = await prisma.itemEpi.create({ data: body })
    return reply.code(201).send(epi)
  })

  app.post('/epis/distribuicao', async (request, reply) => {
    const schema = z.object({
      epiId: z.string(),
      quantidade: z.number().int().positive(),
    })
    const body = schema.parse(request.body)
    const epi = await prisma.itemEpi.update({
      where: { id: body.epiId },
      data: {
        qtdDisponivel: { decrement: body.quantidade },
        ultimaDistribuicao: new Date(),
      },
    })
    return reply.code(200).send(epi)
  })

  // ===== PONTO =====
  app.get('/ponto', async (request) => {
    const { data } = request.query as { data?: string }
    const date = data ? new Date(data) : new Date()
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    return prisma.registroPonto.findMany({
      where: { data: { gte: start, lte: end } },
      include: { funcionario: { select: { nome: true } } },
    })
  })

  app.post('/ponto', async (request, reply) => {
    const schema = z.object({
      funcionarioId: z.string(),
      data: z.string().optional(),
      entrada: z.string().optional(),
      saidaAlmoco: z.string().optional(),
      voltaAlmoco: z.string().optional(),
      saida: z.string().optional(),
      totalHoras: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const ponto = await prisma.registroPonto.create({
      data: {
        funcionarioId: body.funcionarioId,
        data: body.data ? new Date(body.data) : new Date(),
        entrada: body.entrada,
        saidaAlmoco: body.saidaAlmoco,
        voltaAlmoco: body.voltaAlmoco,
        saida: body.saida,
        totalHoras: body.totalHoras,
      },
    })
    return reply.code(201).send(ponto)
  })
}
