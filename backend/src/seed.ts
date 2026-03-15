import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  // ===== SEED DE PLANOS =====
  const planCount = await prisma.plan.count()
  if (planCount === 0) {
    console.log('Seeding plans...')
    const allModules = ['dashboard', 'engenharia', 'suprimentos', 'execucao', 'financeiro', 'pessoas', 'comercial']
    const plansData = [
      { slug: 'start', name: 'Start', description: 'Para pequenas obras', price: 199, maxUsers: 1, maxProjects: 1, enabledModules: ['dashboard', 'engenharia', 'financeiro'] },
      { slug: 'pro', name: 'Pro', description: 'Para construtoras em crescimento', price: 499, maxUsers: 5, maxProjects: 3, enabledModules: ['dashboard', 'engenharia', 'suprimentos', 'execucao', 'financeiro'] },
      { slug: 'business', name: 'Business', description: 'Gestão completa', price: 999, maxUsers: 15, maxProjects: 10, enabledModules: allModules },
      { slug: 'custom', name: 'Personalizado', description: 'Monte seu plano ideal', price: 0, maxUsers: 100, maxProjects: 50, enabledModules: allModules },
    ]

    for (const pd of plansData) {
      const { enabledModules, ...planFields } = pd
      const plan = await prisma.plan.create({ data: planFields })
      await prisma.planFeature.createMany({
        data: allModules.map(mod => ({
          planId: plan.id,
          module: mod,
          enabled: enabledModules.includes(mod),
        })),
      })
    }
    console.log('✅ Plans seeded!')
  }

  // ===== USERS =====
  const adminEmail = 'admin@kubiceng.com'
  const hedpoEmail = 'hedpo_s@hotmail.com'
  const hash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('Kubic$Eng2026', 10)
  const businessPlan = await prisma.plan.findUnique({ where: { slug: 'business' } })

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!admin) {
    admin = await prisma.user.create({
      data: { name: 'Super Admin', email: adminEmail, passwordHash: hash, role: 'superadmin' },
    })
    if (businessPlan) {
      await prisma.subscription.create({ data: { userId: admin.id, planId: businessPlan.id, status: 'active' } })
    }
  }

  let hedpo = await prisma.user.findUnique({ where: { email: hedpoEmail } })
  if (!hedpo) {
    hedpo = await prisma.user.create({
      data: { name: 'Hedpo', email: hedpoEmail, passwordHash: userHash, role: 'user' },
    })
    if (businessPlan) {
      await prisma.subscription.create({ data: { userId: hedpo.id, planId: businessPlan.id, status: 'active' } })
    }
  }

  // ===== CLEAN OLD DATA =====
  console.log('Cleaning old records...')
  await prisma.chamado.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.ordemCompra.deleteMany();
  await prisma.cotacao.deleteMany();
  await prisma.requisicao.deleteMany();
  await prisma.medicao.deleteMany();
  await prisma.contaPagar.deleteMany();
  await prisma.itemEstoque.deleteMany();
  await prisma.fichaVerificacao.deleteMany();
  await prisma.rdo.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.project.deleteMany();

  // ===== DEMO DATA (HEDPO) =====
  console.log('Seeding Hedpo demo data...')
  
  const proj1 = await prisma.project.create({
    data: {
      name: 'Residencial Torres do Mar',
      version: 'v3.2',
      status: 'aprovado',
      userId: hedpo.id,
      date: new Date('2026-01-20'),
      scheduleItems: {
        create: [
          { stage: 'Fundação', startDate: new Date('2026-01-01'), endDate: new Date('2026-02-28'), progress: 100, status: 'concluido' },
          { stage: 'Estrutura', startDate: new Date('2026-03-01'), endDate: new Date('2026-06-30'), progress: 68, status: 'andamento' },
          { stage: 'Alvenaria', startDate: new Date('2026-05-01'), endDate: new Date('2026-08-31'), progress: 35, status: 'andamento' },
        ],
      },
      budgetItems: {
        create: [
          { item: 'Fundação e Estrutura', budgetedAmount: 4500000, realizedAmount: 4200000 },
          { item: 'Alvenaria', budgetedAmount: 2800000, realizedAmount: 2900000 },
        ],
      },
    },
  })

  await prisma.rdo.create({
    data: { projectId: proj1.id, obra: proj1.name, data: new Date('2026-01-25'), climaManha: 'sol', climaTarde: 'sol', efetivoProprio: 45, efetivoTerceiro: 23, atividades: JSON.stringify(['Concretagem laje 12º andar']), fotos: 12 },
  })

  await prisma.contaPagar.create({
    data: { projectId: proj1.id, fornecedor: 'Constrular', valor: 18250, vencimento: new Date('2026-01-30'), status: 'pendente' },
  })
  
  await prisma.contaPagar.create({
    data: { projectId: proj1.id, fornecedor: 'MetalPro', valor: 12300, vencimento: new Date('2026-01-10'), status: 'vencido' },
  })

  await prisma.medicao.create({
    data: { projectId: proj1.id, empreiteiro: 'Construtora ABC', servico: 'Alvenaria', periodo: 'Jan/2026', executado: '68%', valor: 34500, retencao: 1725, liquido: 32775, status: 'aprovado' },
  })

  await prisma.requisicao.create({
    data: { projectId: proj1.id, item: '500 sacos de Cimento', obra: proj1.name, solicitante: 'João Silva', valor: 18500, status: 'pendente_aprovacao' },
  })

  await prisma.itemEstoque.create({
    data: { projectId: proj1.id, material: 'Cimento CP-II', qtdAtual: 150, qtdMinima: 200, unidade: 'sacos' },
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
