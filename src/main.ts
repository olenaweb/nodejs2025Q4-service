import { stringify } from 'yaml';
import { Request, Response, Express } from 'express';
import { EOL } from 'os';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // LoggingService instance for global exception handling
  const loggingService = app.get(LoggingService);

  // Uncaught exceptions
  process.on('uncaughtException', async (error: Error) => {
    loggingService.fatal(
      `⚠️ Uncaught Exception: ${error.message}`,
      error.stack,
      'UncaughtException',
    );

    console.error('Application encountered an uncaught exception. Exiting...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // time for written logs
      await app.close();
      loggingService.log('Application closed gracefully', 'UncaughtException');
    } catch (closeError) {
      loggingService.error(
        'Failed to close application gracefully',
        closeError instanceof Error ? closeError.stack : undefined,
        'UncaughtException',
      );
    } finally {
      process.exit(1);
    }
  });

  // Unhandled rejections
  process.on('unhandledRejection', (reason: unknown) => {
    const message = reason instanceof Error ? reason.message : String(reason);

    const stack = reason instanceof Error ? reason.stack : undefined;

    loggingService.error(
      `⚠️  Unhandled Promise Rejection: ${message}`,
      stack,
      'UnhandledRejection',
    );

    // In production, exit on unhandled rejections
    if (process.env.NODE_ENV === 'production') {
      loggingService.fatal(
        'Unhandled rejection in production. Exiting...',
        undefined,
        'UnhandledRejection',
      );
      process.exit(1);
    }
  });

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
    .addBearerAuth()
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

  loggingService.log(`✅ Application is running on: http://localhost:${port}`, 'Bootstrap');
  loggingService.log(`✅ Swagger UI: http://localhost:${port}/doc`, 'Bootstrap');
  loggingService.log(`✅ Swagger YAML: http://localhost:${port}/doc-yaml`, 'Bootstrap');

  console.log(`${EOL}Application started successfully. Press Ctrl+C to exit.${EOL}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
