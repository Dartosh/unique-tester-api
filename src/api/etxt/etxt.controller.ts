import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
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

  @ApiOkResponse()
  @Post('text/save')
  public saveETxtResults(@Req() req: any): string {
    console.log('saveRequest', req);

    return 'ok';
  }

  @Get('/text/:filepath')
  public getFileByPath(@Param('filepath') path: string, @Res() res: any): void {
    return res.sendFile(path, { root: FILE_DESTINATION });
  }

  //   @ApiOkResponse()
  //   @Get()
  //   public getTextToCheck(): Promise<any> {
  //     return this.etxtService.uploadFilesEtxt();
  //   }
}
