import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './api/app.module';
import { googleConfiguration } from './config/google.config';
import { AppEnvInterface } from './secret/app-env.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService = app.get(ConfigService);
  const appConfig = configService.get<AppEnvInterface>('app');

  const config = new DocumentBuilder()
    .setTitle('Unique-tester')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port, () => {
    console.log(`Server launched on host: ${appConfig.host}:${appConfig.port}`);
  });

  // Google API's configuration
  await googleConfiguration.configure();
}

bootstrap();
