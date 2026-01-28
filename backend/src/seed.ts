import { prisma } from './lib/prisma'

async function main() {
  // Check if data exists first to avoid duplicates if run multiple times
  const count = await prisma.project.count()
  if (count > 0) {
    console.log('Database already seeded')
    return
  }

  await prisma.project.create({
    data: {
      name: 'Projeto Arquitetônico',
      version: 'v3.2',
      status: 'aprovado',
      date: new Date('2026-01-20'),
    }
  })
  console.log('Seeded initial project')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
