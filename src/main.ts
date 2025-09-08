import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './modules/database/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable validation using class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Aqui: pega o PrismaService e ativa os hooks para shutdown
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks();

  const port = process.env.PORT ?? 10000;
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
}
bootstrap();
