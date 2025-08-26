import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Enable validation using class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Transform payloads to be objects typed according to their DTO classes
    transformOptions: {
      enableImplicitConversion: true, // Enable implicit conversion of primitive types
    },
  }));
  
  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
}
bootstrap();
