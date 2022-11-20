import { Module } from '@nestjs/common';
import { EtxtService } from './etxt.service';
import { EtxtController } from './etxt.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/modules/db/module';
import { GoogleModule } from '../google/google.module';
import { TextRuModule } from '../text-ru/text-ru.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    GoogleModule,
    TextRuModule,
    ConfigModule,
    LoggerModule,
  ],
  providers: [EtxtService],
  controllers: [EtxtController],
})
export class EtxtModule {}
