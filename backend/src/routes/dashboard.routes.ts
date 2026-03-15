import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function dashboardRoutes(app: FastifyInstance) {
  // KPIs agregados
  app.get('/dashboard/kpis', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const filter = projectId ? { projectId } : {}
    const [
      totalProjetos,
      alertasCriticos,
      comprasPendentes,
      medicoesPendentes,
      saldoCaixa,
      funcionariosAtivos,
    ] = await Promise.all([
      prisma.project.count({ where: filter }),
      // Alertas críticos: contas vencidas + estoque crítico + treinamentos vencidos
      prisma.contaPagar.count({ where: { status: 'vencido', ...filter } }),
      prisma.requisicao.count({ where: { status: 'pendente_aprovacao', ...filter } }),
      prisma.medicao.count({ where: { status: 'pendente', ...filter } }),
      prisma.medicao.aggregate({ where: { status: 'aprovado', ...filter }, _sum: { liquido: true } }),
      prisma.funcionario.count({ where: { status: 'ativo', ...filter } }),
    ])

    // Estoque crítico
    const estoqueItems = await prisma.itemEstoque.findMany({ where: filter })
    const estoqueCritico = estoqueItems.filter(e => e.qtdAtual < e.qtdMinima).length

    const alertasTotal = alertasCriticos + estoqueCritico

    return {
      obrasAtivas: totalProjetos,
      saldoCaixa: saldoCaixa._sum.liquido ?? 0,
      alertasCriticos: alertasTotal,
      comprasPendentes,
      medicoesPendentes,
      funcionariosAtivos,
    }
  })

  // Alertas dinâmicos
  app.get('/alertas', async (request) => {
    const { projectId } = request.query as { projectId?: string }
    const filter = projectId ? { projectId } : {}
    const alertas: {
      id: string
      tipo: string
      categoria: string
      titulo: string
      descricao: string
      obra: string
      data: string
    }[] = []

    // Contas vencidas
    const contasVencidas = await prisma.contaPagar.findMany({ 
      where: { status: 'vencido', ...filter } 
    })
    for (const c of contasVencidas) {
      alertas.push({
        id: `cv-${c.id}`,
        tipo: 'critico',
        categoria: 'orcamento',
        titulo: 'Conta Vencida',
        descricao: `${c.fornecedor} - R$ ${c.valor.toFixed(2)}`,
        obra: 'Financeiro',
        data: new Date(c.vencimento).toLocaleDateString('pt-BR'),
      })
    }

    // Estoque crítico
    const estoqueItems = await prisma.itemEstoque.findMany({ where: filter })
    for (const e of estoqueItems.filter(x => x.qtdAtual < x.qtdMinima)) {
      alertas.push({
        id: `est-${e.id}`,
        tipo: 'critico',
        categoria: 'compras',
        titulo: 'Estoque Crítico',
        descricao: `${e.material}: ${e.qtdAtual} ${e.unidade} (mínimo: ${e.qtdMinima})`,
        obra: 'Almoxarifado',
        data: new Date().toLocaleDateString('pt-BR'),
      })
    }

    // Requisições pendentes há mais tempo
    const requisicoesPendentes = await prisma.requisicao.findMany({
      where: { status: 'pendente_aprovacao', ...filter },
      orderBy: { createdAt: 'asc' },
      take: 3,
    })
    for (const r of requisicoesPendentes) {
      alertas.push({
        id: `req-${r.id}`,
        tipo: 'atencao',
        categoria: 'compras',
        titulo: 'Compra Pendente',
        descricao: `${r.item} aguarda aprovação`,
        obra: r.obra,
        data: new Date(r.createdAt).toLocaleDateString('pt-BR'),
      })
    }

    // Medições pendentes
    const medicoesPendentes = await prisma.medicao.findMany({
      where: { status: 'pendente', ...filter },
      orderBy: { createdAt: 'asc' },
      take: 3,
    })
    for (const m of medicoesPendentes) {
      alertas.push({
        id: `med-${m.id}`,
        tipo: 'atencao',
        categoria: 'orcamento',
        titulo: 'Medição Pendente',
        descricao: `${m.empreiteiro} - ${m.servico}`,
        obra: m.periodo,
        data: new Date(m.createdAt).toLocaleDateString('pt-BR'),
      })
    }

    // Treinamentos vencidos
    const funcionariosVencidos = await prisma.funcionario.findMany({
      where: { status: 'treinamento_vencido', ...filter },
    })
    if (funcionariosVencidos.length > 0) {
      alertas.push({
        id: 'treinamentos-vencidos',
        tipo: 'atencao',
        categoria: 'seguranca',
        titulo: 'Treinamentos Vencidos',
        descricao: `${funcionariosVencidos.length} funcionário(s) com treinamento vencido`,
        obra: 'Gestão de Pessoas',
        data: new Date().toLocaleDateString('pt-BR'),
      })
    }

    return alertas
  })
}
