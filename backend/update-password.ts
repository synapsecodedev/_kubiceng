
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const emails = ['hedpo_s@hotmail.com', 'hcdpo_s@hotmail.com'];
  const newPassword = 'Kubic$Eng2026';
  const hash = await bcrypt.hash(newPassword, 10);

  console.log('--- Password Update Tool ---');
  
  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log(`Found user: ${email} (ID: ${user.id})`);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hash }
      });
      console.log(`✅ Password updated for ${email}`);
    } else {
      console.log(`❌ User not found: ${email}`);
    }
  }

  // Also list all users just in case there's another typo
  const allUsers = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log('\nAll users in DB:');
  allUsers.forEach(u => console.log(`- ${u.email} (${u.role})`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
