import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function financeiroRoutes(app: FastifyInstance) {
  // ===== CONTAS A PAGAR =====
  app.get('/contas-pagar', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const userId = request.headers['x-user-id'] as string;
    
    const filter: any = projectId ? { projectId } : {}
    if (userId && !projectId) {
      filter.project = { userId };
    }

    return prisma.contaPagar.findMany({ 
      where: filter,
      orderBy: { vencimento: 'asc' } 
    })
  })

  app.post('/contas-pagar', async (request, reply) => {
    const schema = z.object({
      fornecedor: z.string(),
      valor: z.number().positive(),
      vencimento: z.string(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const conta = await prisma.contaPagar.create({
      data: {
        fornecedor: body.fornecedor,
        valor: body.valor,
        vencimento: new Date(body.vencimento),
        status: 'pendente',
        projectId: body.projectId,
      },
    })
    return reply.code(201).send(conta)
  })

  app.patch('/contas-pagar/:id/pagar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.contaPagar.update({ where: { id }, data: { status: 'pago' } })
  })

  // ===== MEDIÇÕES =====
  app.get('/medicoes', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const userId = request.headers['x-user-id'] as string;

    const filter: any = projectId ? { projectId } : {}
    if (userId && !projectId) {
      filter.project = { userId };
    }

    return prisma.medicao.findMany({ 
      where: filter,
      orderBy: { createdAt: 'desc' } 
    })
  })

  app.post('/medicoes', async (request, reply) => {
    const schema = z.object({
      empreiteiro: z.string(),
      servico: z.string(),
      periodo: z.string(),
      executado: z.string(),
      valor: z.number().positive(),
      projectId: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const retencao = body.valor * 0.05
    const medicao = await prisma.medicao.create({
      data: {
        empreiteiro: body.empreiteiro,
        servico: body.servico,
        periodo: body.periodo,
        executado: body.executado,
        valor: body.valor,
        retencao,
        liquido: body.valor - retencao,
        status: 'pendente',
        projectId: body.projectId,
      },
    })
    return reply.code(201).send(medicao)
  })

  app.patch('/medicoes/:id/aprovar', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.medicao.update({ where: { id }, data: { status: 'aprovado' } })
  })

  // ===== FLUXO DE CAIXA (agregado) =====
  app.get('/fluxo-caixa', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const userId = request.headers['x-user-id'] as string;

    const filter: any = projectId ? { projectId } : {}
    if (userId && !projectId) {
      filter.project = { userId };
    }

    const medicoes = await prisma.medicao.findMany({ where: { status: 'aprovado', ...filter } })
    const contas = await prisma.contaPagar.findMany({ where: { status: 'pago', ...filter } })

    // Agrupa por mês
    const meses: Record<string, { mes: string; receita: number; despesa: number }> = {}

    for (const med of medicoes) {
      const key = new Date(med.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (!meses[key]) meses[key] = { mes: key, receita: 0, despesa: 0 }
      meses[key].receita += med.liquido / 1000
    }

    for (const c of contas) {
      const key = new Date(c.vencimento).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (!meses[key]) meses[key] = { mes: key, receita: 0, despesa: 0 }
      meses[key].despesa += c.valor / 1000
    }

    return Object.values(meses).sort((a, b) => a.mes.localeCompare(b.mes))
  })
}

export default financeiroRoutes;

