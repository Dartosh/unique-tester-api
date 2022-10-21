import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextRuModule } from './text-ru/text-ru.module';
import { GoogleModule } from './google/google.module';
import appConfig from 'src/config/app.config';
import { JsonBodyMiddleware } from 'src/middleware/json-body.middleware';
import { UrlencodedBodyMiddleware } from 'src/middleware/urlencoded-body.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TextRuModule,
    GoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UrlencodedBodyMiddleware)
      .forRoutes({
        path: '/text-ru/text/save',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
