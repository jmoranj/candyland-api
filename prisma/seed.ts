import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { generateRandomPassword } from '../src/utils/hashPass';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
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

  // Criar produtos
  const products = [
    {
      name: 'Trufa de Chocolate',
      description: 'Deliciosa trufa de chocolate belga com recheio cremoso',
      price: '8.50',
      category: 'Trufas',
      imageUrl: 'https://example.com/trufa-chocolate.jpg',
    },
    {
      name: 'Brigadeiro Gourmet',
      description: 'Brigadeiro tradicional com granulado de chocolate',
      price: '3.50',
      category: 'Brigadeiros',
      imageUrl: 'https://example.com/brigadeiro-gourmet.jpg',
    },
    {
      name: 'Beijinho',
      description: 'Doce de coco ralado com cravo',
      price: '3.00',
      category: 'Doces Tradicionais',
      imageUrl: 'https://example.com/beijinho.jpg',
    },
    {
      name: 'Quindim',
      description: 'Doce brasileiro de gema de ovo, coco e açúcar',
      price: '4.50',
      category: 'Doces Tradicionais',
      imageUrl: 'https://example.com/quindim.jpg',
    },
    {
      name: 'Trufa de Morango',
      description: 'Trufa de chocolate branco com recheio de morango',
      price: '9.00',
      category: 'Trufas',
      imageUrl: 'https://example.com/trufa-morango.jpg',
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log('Produto criado:', product.name);
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

export default main;
