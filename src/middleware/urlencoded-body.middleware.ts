import { Injectable, NestMiddleware } from '@nestjs/common';

import * as bodyParser from 'body-parser';

@Injectable()
export class UrlencodedBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('req: ', req);
    bodyParser.urlencoded({ extended: true })(req, res, next);
  }
}
