import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { Environment } from './infra/config/env.validation';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);

    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            imgSrc: [
              `'self'`,
              'data:',
              'apollo-server-landing-page.cdn.apollographql.com',
            ],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            manifestSrc: [
              `'self'`,
              'apollo-server-landing-page.cdn.apollographql.com',
            ],
            frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
          },
        },
      }),
    );

    app.use(compression());

    // Global validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // strip unknown properties
        forbidNonWhitelisted: true, // throw error if unknown props
        transform: true, // auto-transform payloads to DTO classes
      }),
    );

    // Config service
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port') ?? 3000;
    const nodeEnv =
      configService.get<Environment>('app.nodeEnv') ?? Environment.Development;
    const frontendUrl = configService.get<string>('app.frontendUrl') ?? '*';

    // Enable CORS
    app.enableCors({
      origin: [Environment.Development, Environment.Local].includes(nodeEnv)
        ? ['http://localhost:5173', 'http://localhost:3001']
        : frontendUrl,
      credentials: true,
    });

    await app.listen(port);

    if ([Environment.Development, Environment.Local].includes(nodeEnv)) {
      console.log(`🚀 Application is running on: http://localhost:${port}`);
    } else {
      console.log(`✅ Application started on port ${port} in ${nodeEnv} mode`);
    }
  } catch (error) {
    console.error('❌ Error during application bootstrap:', error);
    throw error;
  }
};

void bootstrap();
