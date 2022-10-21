import { Injectable, NestMiddleware } from '@nestjs/common';

import * as express from 'express';

@Injectable()
export class UrlencodedBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('req: ', req);
    express.urlencoded()(req, res, next);
  }
}
