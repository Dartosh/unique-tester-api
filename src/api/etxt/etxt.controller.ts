import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import * as fs from 'fs';
import * as path from 'path';

import { FILE_DESTINATION } from 'src/constants/e-txt.constants';
import { SpreadSheetDataDto } from '../google/dto/spreadsheet-data.dto';
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
  public saveETxtResults(@Body() props: any): string {
    console.log('saveRequest:\n', props);

    return 'ok';
  }

  @Get('text/save')
  public getSaveETxtResults(@Req() req: any): string {
    console.log('saveRequest:\n', req);

    return 'ok';
  }

  @Get('/text/:filepath')
  public getFileByPath(
    @Param('filepath') filepath: string,
    @Res() res: any,
  ): any {
    console.log('Get file: ', filepath);

    // const fileToReturn = fs.readFileSync(
    //   path.join(__dirname, '../..', FILE_DESTINATION, `${filepath}`),
    // );

    const file = fs.createReadStream(
      path.join(__dirname, '../..', FILE_DESTINATION, `${filepath}`),
    );

    // console.log('File length: ', fileToReturn.length);

    // return res.sendFile(filepath, { root: FILE_DESTINATION });

    file.pipe(res);
  }

  //   @ApiOkResponse()
  //   @Get()
  //   public getTextToCheck(): Promise<any> {
  //     return this.etxtService.uploadFilesEtxt();
  //   }
}
