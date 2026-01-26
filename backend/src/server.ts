import fastify from 'fastify'
import cors from '@fastify/cors'
import { projectRoutes } from './routes/project.routes'

const app = fastify()

app.register(cors, {
  origin: '*', // Allow all for dev
})

app.register(projectRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server running on http://localhost:3333')
})
