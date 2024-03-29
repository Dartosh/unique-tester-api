import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import * as fs from 'fs';
import * as path from 'path';

import { FILE_DESTINATION } from 'src/constants/e-txt.constants';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
import { TextRuFileResultDto } from './dto/e-txt-result.dto';
import { EtxtService } from './etxt.service';

@ApiTags('e-txt')
@Controller('e-txt')
export class EtxtController {
  constructor(private readonly etxtService: EtxtService) {}

  @ApiOkResponse()
  @Post('text/upload')
  public uploadFiles(@Body() props: SpreadSheetDataDto): Promise<any> {
    return this.etxtService.uploadFilesETxt(props);
  }

  // @ApiOkResponse()
  @Post('text/save')
  public async saveETxtResults(
    @Body() props: TextRuFileResultDto,
  ): Promise<string> {
    try {
      await this.etxtService.saveETxtResults(props);
    } catch {}

    return 'ok';
  }

  @Get('/text/:filepath')
  public getFileByPath(
    @Param('filepath') filepath: string,
    @Res() res: any,
  ): any {
    console.log(`GET /e-txt/text/${filepath}`);

    const file = fs.createReadStream(
      path.join(__dirname, '../..', FILE_DESTINATION, `${filepath}`),
    );

    file.pipe(res);
  }

  //   @ApiOkResponse()
  //   @Get()
  //   public getTextToCheck(): Promise<any> {
  //     return this.etxtService.uploadFilesEtxt();
  //   }
}
