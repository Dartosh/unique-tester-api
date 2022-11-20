import { ApiProperty } from '@nestjs/swagger';

import { Log } from '.prisma/client';

type LogModel = Pick<Log, 'message' | 'type' | 'title' | 'id'>;

class LogEntity implements LogModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  type: string;
}

export class LogsResponse {
  logs: LogEntity[];
}
