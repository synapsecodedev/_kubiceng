import fastify from 'fastify'
import cors from '@fastify/cors'
import { engenhariaRoutes } from './routes/engenharia.routes'
import { execucaoRoutes } from './routes/execucao.routes'
import { financeiroRoutes } from './routes/financeiro.routes'
import { pessoasRoutes } from './routes/pessoas.routes'
import { suprimentosRoutes } from './routes/suprimentos.routes'
import { comercialRoutes } from './routes/comercial.routes'
import { dashboardRoutes } from './routes/dashboard.routes'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(engenhariaRoutes)
app.register(execucaoRoutes)
app.register(financeiroRoutes)
app.register(pessoasRoutes)
app.register(suprimentosRoutes)
app.register(comercialRoutes)
app.register(dashboardRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server running on http://localhost:3333')
})
