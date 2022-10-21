import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTableDto } from './dto/update-table.dto';

import { GoogleService } from './google.service';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @ApiOkResponse()
  @HttpCode(204)
  @Patch('table')
  public updateSpreadsheetTable(@Body() props: UpdateTableDto): Promise<void> {
    return this.googleService.updateSpreadsheetTable(props);
  }
}
