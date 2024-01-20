import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Set up basic authentication for the API endpoints [Swagger]
  app.use(
    [process.env.SWAGGER_PATH || 'api'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASSWORD || '0000',
      },
    }),
  );

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Create the Swagger documentation configuration
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE || 'FMS')
    .setDescription(process.env.APP_DESCRIPTION || 'MFS backend endpoints.')
    .setVersion(process.env.APP_VERSION || '0.0.1')
    .build();

  // Generate the Swagger document based on the application and configuration
  const document = SwaggerModule.createDocument(app, config);

  // Set up the Swagger UI to serve the generated documentation
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);

  // Start the application server
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
