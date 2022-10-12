import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '.';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
