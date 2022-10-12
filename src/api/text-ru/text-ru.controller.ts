import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TextRuFileResultDto } from './dto/text-ru-file-result.dto';

import { TextRuFileInterface } from './interfaces/text-ru-file.interface';
import { TextRuService } from './text-ru.service';

@Controller('text-ru')
export class TextRuController {
  constructor(private readonly textRuService: TextRuService) {}

  @ApiOkResponse()
  @HttpCode(204)
  @Post('upload-test')
  public uploadFiles(@Body() props: TextRuFileInterface): Promise<void> {
    return this.textRuService.uploadFiles([props]);
  }

  @ApiOkResponse()
  @HttpCode(204)
  @Post('text/save')
  public saveFilesResults(@Body() props: TextRuFileResultDto): Promise<void> {
    return this.textRuService.saveFilesResults(props);
  }
}
