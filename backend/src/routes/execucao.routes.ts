import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function execucaoRoutes(app: FastifyInstance) {
  // ===== RDO =====
  app.get('/rdos', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    return prisma.rdo.findMany({ 
      where: projectId ? { projectId } : {},
      orderBy: { data: 'desc' } 
    })
  })

  app.get('/rdos/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const rdo = await prisma.rdo.findUnique({ where: { id } })
    if (!rdo) return reply.code(404).send({ message: 'RDO não encontrado' })
    return rdo
  })

  app.post('/rdos', async (request, reply) => {
    const schema = z.object({
      obra: z.string(),
      data: z.string().optional(),
      climaManha: z.string(),
      climaTarde: z.string(),
      efetivoProprio: z.number().int().default(0),
      efetivoTerceiro: z.number().int().default(0),
      atividades: z.array(z.string()).default([]),
      fotos: z.number().int().default(0),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const rdo = await prisma.rdo.create({
      data: {
        obra: body.obra,
        data: body.data ? new Date(body.data) : new Date(),
        climaManha: body.climaManha,
        climaTarde: body.climaTarde,
        efetivoProprio: body.efetivoProprio,
        efetivoTerceiro: body.efetivoTerceiro,
        atividades: JSON.stringify(body.atividades),
        fotos: body.fotos,
        projectId: body.projectId,
      },
    })
    return reply.code(201).send(rdo)
  })

  // ===== FVS =====
  app.get('/fvs', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    return prisma.fichaVerificacao.findMany({ 
      where: projectId ? { projectId } : {},
      orderBy: { data: 'desc' } 
    })
  })

  app.post('/fvs', async (request, reply) => {
    const schema = z.object({
      titulo: z.string(),
      obra: z.string(),
      responsavel: z.string(),
      data: z.string().optional(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const fvs = await prisma.fichaVerificacao.create({
      data: {
        titulo: body.titulo,
        obra: body.obra,
        responsavel: body.responsavel,
        status: 'pendente',
        data: body.data ? new Date(body.data) : new Date(),
        projectId: body.projectId,
      },
    })
    return reply.code(201).send(fvs)
  })

  app.patch('/fvs/:id/assinar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.fichaVerificacao.update({ where: { id }, data: { status: 'aprovado' } })
  })

  // ===== ESTOQUE =====
  app.get('/estoque', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    return prisma.itemEstoque.findMany({ 
      where: projectId ? { projectId } : {},
      orderBy: { material: 'asc' } 
    })
  })

  app.post('/estoque', async (request, reply) => {
    const schema = z.object({
      material: z.string(),
      qtdAtual: z.number(),
      qtdMinima: z.number(),
      unidade: z.string(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const item = await prisma.itemEstoque.create({ data: body })
    return reply.code(201).send(item)
  })

  app.post('/estoque/entrada', async (request, reply) => {
    const schema = z.object({
      itemEstoqueId: z.string(),
      quantidade: z.number().positive(),
      observacao: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const [mov] = await prisma.$transaction([
      prisma.movimentacaoEstoque.create({
        data: {
          itemEstoqueId: body.itemEstoqueId,
          tipo: 'entrada',
          quantidade: body.quantidade,
          observacao: body.observacao,
        },
      }),
      prisma.itemEstoque.update({
        where: { id: body.itemEstoqueId },
        data: {
          qtdAtual: { increment: body.quantidade },
          ultimaEntrada: new Date(),
        },
      }),
    ])
    return reply.code(201).send(mov)
  })

  app.post('/estoque/saida', async (request, reply) => {
    const schema = z.object({
      itemEstoqueId: z.string(),
      quantidade: z.number().positive(),
      observacao: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const [mov] = await prisma.$transaction([
      prisma.movimentacaoEstoque.create({
        data: {
          itemEstoqueId: body.itemEstoqueId,
          tipo: 'saida',
          quantidade: body.quantidade,
          observacao: body.observacao,
        },
      }),
      prisma.itemEstoque.update({
        where: { id: body.itemEstoqueId },
        data: { qtdAtual: { decrement: body.quantidade } },
      }),
    ])
    return reply.code(201).send(mov)
  })
}

export default execucaoRoutes;

