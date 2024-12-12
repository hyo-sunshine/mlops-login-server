import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger("server start info");
  logger.log(
    `DB_HOST: ${process.env.DB_HOST}`,
    `DB_PORT: ${process.env.DB_PORT}`,
    `DB_USERNAME: ${process.env.DB_USERNAME}`,
    `DB_PASSWORD: ${process.env.DB_PASSWORD}`,
    `DB_NAME: ${process.env.DB_NAME}`
  )
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
