import { NestMiddleware } from '@nestjs/common';
export declare class JsonBodyMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => any): void;
}
