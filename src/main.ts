import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

import * as express from 'express';
import * as basicAuth from 'express-basic-auth';

async function bootstrap(): Promise<void> {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Set up basic authentication for the API endpoints [Swagger]
  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Inject service to validator constraint interface
  //* Class-validator requires you to use service containers if you want to inject dependencies into your custom validator constraint classes
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Create the Swagger documentation configuration
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE)
    .setDescription(process.env.SWAGGER_DESCRIPTION)
    .setVersion(process.env.APP_VERSION)
    .build();

  // Generate the Swagger document based on the application and configuration
  const document = SwaggerModule.createDocument(app, config);

  // Set up the Swagger UI to serve the generated documentation
  SwaggerModule.setup('api', app, document);

  // Start the application server
  await app.listen(process.env.APP_PORT);
}
bootstrap();
