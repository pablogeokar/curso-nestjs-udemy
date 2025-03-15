import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // se TRUE remove as chaves que não fazem parte do DTO
      //transform: true, // Tenta fazer a conversão  das strings passadas por parâmetro em numero de forma global
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
