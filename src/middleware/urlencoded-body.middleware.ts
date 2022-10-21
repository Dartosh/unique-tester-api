import { Injectable, NestMiddleware } from '@nestjs/common';

import * as bodyParser from 'body-parser';

@Injectable()
export class UrlencodedBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    bodyParser.urlencoded()(req, res, next);
  }
}
