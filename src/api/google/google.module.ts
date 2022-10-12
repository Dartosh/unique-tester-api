import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/modules/db/module';

import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [GoogleService],
  controllers: [GoogleController],
})
export class GoogleModule {}
