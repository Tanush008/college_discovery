import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config =
    new DocumentBuilder()
      .setTitle(
        'College Discovery API',
      )
      .setDescription(
        'Backend API for College Discovery Platform',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  const port = Number(process.env.PORT || 3000);

  await app.listen(port, '0.0.0.0');
  console.log(
    `Server is running at ${await app.getUrl()}`,
  );

  console.log(
    `Swagger Docs: ${await app.getUrl()}/api`,
  );
}

void bootstrap();