import { stringify } from 'yaml';
import { Request, Response, Express } from 'express';
import { EOL } from 'os';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('RSS Home Library Service')
    .setDescription('Home music library service - olenaweb/nodejs2025Q4-service')
    .setVersion('1.0.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  };

  const createSwaggerDocument = () => SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('doc', app, createSwaggerDocument);

  // get YAML with Express
  const expressApp: Express = app.getHttpAdapter().getInstance();
  expressApp.get('/doc-yaml', (_req: Request, res: Response): void => {
    const yaml = stringify(createSwaggerDocument());
    res.type('text/yaml').send(yaml);
  });

  const port = process.env.PORT || 4000;
  app.enableShutdownHooks();
  await app.listen(port);
  console.log(`✅ Application is running on: http://localhost:${port}. Ctrl+C to exit${EOL}`);
  console.log(`✅ Swagger UI: http://localhost:${port}/doc${EOL}`);
  console.log(`✅ Swagger YAML: http://localhost:${port}/doc-yaml${EOL}`);
}

bootstrap();
