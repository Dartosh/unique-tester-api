import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private enableShutdownHooks;
}
