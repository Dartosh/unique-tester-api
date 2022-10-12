import { registerAs } from '@nestjs/config';

import { AppEnvInterface } from 'src/secret/app-env.interface';

export default registerAs(
  'app',
  (): AppEnvInterface => ({
    port: parseInt(process.env.APP_PORT),
    host: process.env.APP_HOST,
  }),
);
