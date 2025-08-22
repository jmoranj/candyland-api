import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { generateRandomPassword } from '../src/utils/hashPass';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const password = generateRandomPassword();
  const name = 'Administrador';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log('Usuário criado:', user, 'Sua senha:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
