import { prisma } from './lib/prisma'

async function main() {
  const count = await prisma.project.count()
  if (count > 0) {
    console.log('Database already seeded — skipping.')
    return
  }

  console.log('Seeding database...')

  // ===== ENGENHARIA =====
  const proj1 = await prisma.project.create({
    data: {
      name: 'Projeto Arquitetônico - Torres do Mar',
      version: 'v3.2',
      status: 'aprovado',
      date: new Date('2026-01-20'),
      scheduleItems: {
        create: [
          { stage: 'Fundação', startDate: new Date('2026-01-01'), endDate: new Date('2026-02-28'), progress: 100, status: 'concluido' },
          { stage: 'Estrutura', startDate: new Date('2026-03-01'), endDate: new Date('2026-06-30'), progress: 68, status: 'andamento' },
          { stage: 'Alvenaria', startDate: new Date('2026-05-01'), endDate: new Date('2026-08-31'), progress: 35, status: 'andamento' },
          { stage: 'Instalações', startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), progress: 0, status: 'nao_iniciado' },
          { stage: 'Acabamento', startDate: new Date('2026-10-01'), endDate: new Date('2026-11-30'), progress: 0, status: 'nao_iniciado' },
        ],
      },
      budgetItems: {
        create: [
          { item: 'Fundação e Estrutura', budgetedAmount: 4500000, realizedAmount: 4200000 },
          { item: 'Alvenaria e Vedação', budgetedAmount: 2800000, realizedAmount: 2900000 },
          { item: 'Instalações', budgetedAmount: 3200000, realizedAmount: 1800000 },
          { item: 'Acabamento', budgetedAmount: 4000000, realizedAmount: 300000 },
        ],
      },
    },
  })

  await prisma.project.createMany({
    data: [
      { name: 'Estrutural Edifício Plaza', version: 'v1.5', status: 'revisao', date: new Date('2026-01-15') },
      { name: 'Instalações Hidráulicas - Bloco B', version: 'v2.0', status: 'aprovado', date: new Date('2026-01-10') },
    ],
  })

  // ===== EXECUÇÃO =====
  await prisma.rdo.createMany({
    data: [
      { obra: 'Residencial Torres do Mar', data: new Date('2026-01-25'), climaManha: 'sol', climaTarde: 'sol', efetivoProprio: 45, efetivoTerceiro: 23, atividades: JSON.stringify(['Concretagem laje 12º andar', 'Instalação hidráulica 10º andar', 'Alvenaria 8º andar']), fotos: 12 },
      { obra: 'Residencial Torres do Mar', data: new Date('2026-01-24'), climaManha: 'sol', climaTarde: 'chuva', efetivoProprio: 42, efetivoTerceiro: 20, atividades: JSON.stringify(['Preparação de armadura laje 12', 'Revestimento 9º andar']), fotos: 8 },
    ],
  })

  await prisma.fichaVerificacao.createMany({
    data: [
      { titulo: 'Conferência de Armadura - Laje 12', obra: 'Residencial Torres do Mar', responsavel: 'João Silva - Eng. Civil', status: 'aprovado', data: new Date('2026-01-24') },
      { titulo: 'Verificação de Prumo - Pilares 11º Andar', obra: 'Residencial Torres do Mar', responsavel: 'Carlos Oliveira - Eng. Civil', status: 'pendente', data: new Date('2026-01-23') },
    ],
  })

  await prisma.itemEstoque.createMany({
    data: [
      { material: 'Cimento CP-II', qtdAtual: 350, qtdMinima: 200, unidade: 'sacos' },
      { material: 'Areia Média', qtdAtual: 15, qtdMinima: 20, unidade: 'm³' },
      { material: 'Brita 1', qtdAtual: 42, qtdMinima: 30, unidade: 'm³' },
      { material: 'Aço CA-50 10mm', qtdAtual: 180, qtdMinima: 150, unidade: 'barras' },
    ],
  })

  // ===== FINANCEIRO =====
  await prisma.contaPagar.createMany({
    data: [
      { fornecedor: 'Constrular', valor: 18250, vencimento: new Date('2026-01-30'), status: 'pendente' },
      { fornecedor: 'MetalPro', valor: 45800, vencimento: new Date('2026-02-15'), status: 'pendente' },
      { fornecedor: 'MaderMax', valor: 12300, vencimento: new Date('2026-01-20'), status: 'vencido' },
    ],
  })

  await prisma.medicao.createMany({
    data: [
      { empreiteiro: 'Construtora ABC', servico: 'Alvenaria', periodo: 'Jan/2026 - 1ª Quinzena', executado: '68%', valor: 34500, retencao: 1725, liquido: 32775, status: 'aprovado' },
      { empreiteiro: 'Instalações Técnicas Ltda', servico: 'Instalações Hidráulicas', periodo: 'Jan/2026 - 1ª Quinzena', executado: '42%', valor: 28900, retencao: 1445, liquido: 27455, status: 'pendente' },
    ],
  })

  // ===== PESSOAS =====
  await prisma.funcionario.createMany({
    data: [
      { nome: 'Carlos Silva', funcao: 'Pedreiro', obra: 'Residencial Torres do Mar', tipo: 'proprio', status: 'ativo', nr35: '2025-12-15' },
      { nome: 'José Santos', funcao: 'Armador', obra: 'Residencial Torres do Mar', tipo: 'terceiro', status: 'ativo', nr35: '2026-03-20' },
      { nome: 'Maria Oliveira', funcao: 'Eletricista', obra: 'Shopping Center Norte', tipo: 'proprio', status: 'treinamento_vencido', nr35: '2026-01-10', nr10: '2025-11-30' },
    ],
  })

  await prisma.itemEpi.createMany({
    data: [
      { item: 'Capacete', qtdDisponivel: 45, qtdMinima: 30, ultimaDistribuicao: new Date('2026-01-20') },
      { item: 'Luva de Raspa', qtdDisponivel: 28, qtdMinima: 40, ultimaDistribuicao: new Date('2026-01-22') },
      { item: 'Botina de Segurança', qtdDisponivel: 52, qtdMinima: 35, ultimaDistribuicao: new Date('2026-01-18') },
      { item: 'Óculos de Proteção', qtdDisponivel: 38, qtdMinima: 30, ultimaDistribuicao: new Date('2026-01-21') },
    ],
  })

  // ===== SUPRIMENTOS =====
  const req1 = await prisma.requisicao.create({
    data: { item: '500 sacos de Cimento CP-II', obra: 'Residencial Torres do Mar', solicitante: 'João Silva', valor: 18500, status: 'cotacao' },
  })

  await prisma.cotacao.createMany({
    data: [
      { requisicaoId: req1.id, fornecedor: 'CimentoMax', preco: 18500, prazo: '5 dias', condicao: '30 dias' },
      { requisicaoId: req1.id, fornecedor: 'Constrular', preco: 18250, prazo: '3 dias', condicao: '45 dias', selecionada: false },
      { requisicaoId: req1.id, fornecedor: 'DepositoBR', preco: 19000, prazo: '2 dias', condicao: '15 dias' },
    ],
  })

  await prisma.requisicao.createMany({
    data: [
      { item: '200m³ de Concreto FCK 25', obra: 'Shopping Center Norte', solicitante: 'Ana Costa', valor: 52000, status: 'pendente_aprovacao' },
      { item: '1000 tijolos cerâmicos', obra: 'Edifício Comercial Plaza', solicitante: 'Maria Santos', valor: 3200, status: 'aprovado' },
    ],
  })

  await prisma.ordemCompra.createMany({
    data: [
      { fornecedor: 'Constrular', valor: 18250, status: 'entregue' },
      { fornecedor: 'MetalPro', valor: 45800, status: 'transito' },
      { fornecedor: 'MaderMax', valor: 12300, status: 'aguardando' },
    ],
  })

  // ===== COMERCIAL =====
  const cl1 = await prisma.cliente.create({
    data: { nome: 'João Pedro Almeida', unidade: 'Apto 1203 - Torre A', obra: 'Residencial Torres do Mar', status: 'em_construcao', progresso: 68, entregaPrevista: '12/2026' },
  })
  const cl2 = await prisma.cliente.create({
    data: { nome: 'Maria Clara Santos', unidade: 'Apto 805 - Torre B', obra: 'Residencial Torres do Mar', status: 'em_construcao', progresso: 68, entregaPrevista: '12/2026' },
  })

  await prisma.chamado.createMany({
    data: [
      { clienteId: cl1.id, problema: 'Infiltração no banheiro', prioridade: 'alta', status: 'aberto', garantia: true },
      { clienteId: cl2.id, problema: 'Porta do quarto emperrando', prioridade: 'media', status: 'agendado', garantia: true },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
