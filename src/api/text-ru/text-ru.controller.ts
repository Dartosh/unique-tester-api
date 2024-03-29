import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';

import { TextRuService } from './text-ru.service';

@ApiTags('text-ru')
@Controller('text-ru')
export class TextRuController {
  constructor(private readonly textRuService: TextRuService) {}

  @ApiOkResponse()
  @HttpCode(204)
  @Post('text/upload')
  public uploadFiles(@Body() props: SpreadSheetDataDto): Promise<{
    massage: string;
  }> {
    return this.textRuService.uploadFilesTextRu(props);
  }

  @ApiOkResponse()
  @HttpCode(204)
  @Post('text/save')
  public saveFilesResults(@Body() props: TextRuFileResultDto): Promise<void> {
    return this.textRuService.saveFilesResults(props);
  }
}
