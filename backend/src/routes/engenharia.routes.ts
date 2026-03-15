import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function engenhariaRoutes(app: FastifyInstance) {
  // GET all projects
  app.get('/projects', async (request) => {
    const userId = request.headers['x-user-id'] as string;
    const filter = userId ? { userId } : {};
    return prisma.project.findMany({ 
      where: filter as any,
      orderBy: { date: 'desc' } 
    })
  })

  // POST create project
  app.post('/projects', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string;
    const schema = z.object({
      name: z.string().min(1),
      version: z.string().min(1),
      status: z.string().min(1),
      date: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const project = await prisma.project.create({
      data: {
        name: body.name,
        version: body.version,
        status: body.status,
        date: body.date ? new Date(body.date) : new Date(),
        userId: userId as any, // Associar ao usuário logado
      },
    })
    return reply.code(201).send(project)
  })

  // PUT update project
  app.put('/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      name: z.string().optional(),
      version: z.string().optional(),
      status: z.string().optional(),
    })
    const body = schema.parse(request.body)
    const project = await prisma.project.update({ where: { id }, data: body })
    return project
  })

  // DELETE project
  app.delete('/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.project.delete({ where: { id } })
    return reply.code(204).send()
  })

  // GET schedule items for a project
  app.get('/projects/:id/schedule', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.scheduleItem.findMany({ where: { projectId: id }, orderBy: { startDate: 'asc' } })
  })

  // POST schedule item
  app.post('/projects/:id/schedule', async (request, reply) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      stage: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      progress: z.number().int().min(0).max(100).default(0),
      status: z.string(),
    })
    const body = schema.parse(request.body)
    const item = await prisma.scheduleItem.create({
      data: {
        projectId: id,
        stage: body.stage,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        progress: body.progress,
        status: body.status,
      },
    })
    return reply.code(201).send(item)
  })

  // PUT update schedule item progress
  app.put('/projects/:id/schedule/:itemId', async (request) => {
    const { itemId } = request.params as { id: string; itemId: string }
    const schema = z.object({
      progress: z.number().int().min(0).max(100).optional(),
      status: z.string().optional(),
    })
    const body = schema.parse(request.body)
    return prisma.scheduleItem.update({ where: { id: itemId }, data: body })
  })

  // GET budget items
  app.get('/projects/:id/budget', async (request) => {
    const { id } = request.params as { id: string }
    return prisma.budgetItem.findMany({ where: { projectId: id } })
  })

  // POST budget item
  app.post('/projects/:id/budget', async (request, reply) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      item: z.string(),
      budgetedAmount: z.number(),
      realizedAmount: z.number(),
    })
    const body = schema.parse(request.body)
    const budgetItem = await prisma.budgetItem.create({ data: { projectId: id, ...body } })
    return reply.code(201).send(budgetItem)
  })

  // PUT update budget item
  app.put('/projects/:id/budget/:itemId', async (request) => {
    const { itemId } = request.params as { id: string; itemId: string }
    const schema = z.object({
      realizedAmount: z.number().optional(),
      budgetedAmount: z.number().optional(),
    })
    const body = schema.parse(request.body)
    return prisma.budgetItem.update({ where: { id: itemId }, data: body })
  })
}

export default engenhariaRoutes;

