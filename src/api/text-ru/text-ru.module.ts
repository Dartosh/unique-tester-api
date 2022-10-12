import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from 'src/modules/db/module';

import { TextRuService } from './text-ru.service';
import { TextRuController } from './text-ru.controller';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [TextRuService],
  controllers: [TextRuController],
})
export class TextRuModule {}
