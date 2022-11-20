import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/db';
import { EventsGateway } from '../events/events.gateway';
import { LogTypesEnum } from './enums/log-types.enum';
import { LogsResponse } from './responses/logs.response';

@Injectable()
export class LoggerService {
  constructor(
    private readonly db: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  public async getLastLogs(): Promise<LogsResponse> {
    const logs = await this.db.log.findMany({
      where: {
        receiveTime: {
          gte: new Date(new Date().getTime() - 360000 * 24),
        },
      },
      orderBy: {
        receiveTime: 'asc',
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
      },
    });

    return {
      logs,
    };
  }

  public async addNewLog(title: string, message: string, type: LogTypesEnum) {
    const log = await this.db.log.create({
      data: {
        title,
        message,
        type,
      },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
      },
    });

    this.events.emitLog(log);
  }
}
