import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from 'src/modules/db/module';

import { TextRuService } from './text-ru.service';
import { TextRuController } from './text-ru.controller';
import { GoogleModule } from '../google/google.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, HttpModule, GoogleModule, LoggerModule],
  providers: [TextRuService],
  controllers: [TextRuController],
  exports: [TextRuService],
})
export class TextRuModule {}
