import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DB_URL'),
        },
      },
      // log: ['query', 'info', 'warn', 'error'],
      log: ['info', 'warn', 'error'],

      errorFormat: 'pretty',
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  private async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
