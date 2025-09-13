import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const setupSwagger = (app: INestApplication): void => {
  const configService = app.get<ConfigService>(ConfigService);

  const apiUrl = configService.get<string>('app.apiUrl');
  const prodApiUrl = configService.get<string>('app.prodApiUrl');
  const nodeEnv = configService.get<string>('app.nodeEnv');

  const config = new DocumentBuilder()
    .setTitle('Interview Prep API')
    .setDescription('API documentation for the Interview Prep project')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token (without "Bearer " prefix)',
        in: 'header',
      },
      'access-token', // 👈 this is the name that will appear in Swagger UI
    )
    .addServer(apiUrl!, 'Local/Dev Server')
    .addServer(prodApiUrl!, 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // optional: include extra config
    deepScanRoutes: true, // makes sure it picks up decorators across modules
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 👈 keeps JWT token even after refresh
    },
  });

  console.log(`📖 Swagger Docs ready at /api/docs (env: ${nodeEnv})`);
};
