import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function projectRoutes(app: FastifyInstance) {
  // GET all projects
  app.get('/projects', async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        date: 'desc',
      },
    })
    return projects
  })

  // POST create project
  app.post('/projects', async (request) => {
    // Basic validation schema (using zod usually, but keeping simple for now or manual)
    // To use zod properly we need fastify-type-provider-zod but I haven't installed it.
    // I'll assume body is correct for this initial step.
    const body = request.body as any
    
    // In a real app, use Zod to validate body
    const project = await prisma.project.create({
      data: {
        name: body.name,
        version: body.version,
        status: body.status,
        date: new Date(body.date), // Ensure date is Date object
      }
    })
    return project
  })
}
