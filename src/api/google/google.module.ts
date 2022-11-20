import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/modules/db/module';

import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, HttpModule, LoggerModule],
  providers: [GoogleService],
  controllers: [GoogleController],
  exports: [GoogleService],
})
export class GoogleModule {}
