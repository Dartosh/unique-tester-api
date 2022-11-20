import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from './logger.service';
import { LogsResponse } from './responses/logs.response';

@ApiTags('logger')
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ApiOkResponse({ type: LogsResponse })
  @Get()
  public getLastlogs(): Promise<LogsResponse> {
    return this.loggerService.getLastLogs();
  }

  // @ApiOkResponse()
  // @Post()
  // public async addNewLog(@Body() props: any): Promise<void> {
  //   await this.loggerService.addNewLog(props);
  // }
}
