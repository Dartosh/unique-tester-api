import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { GoogleService } from './google.service';

class a {
  @ApiProperty()
  @IsString()
  spreadsheetId: string;

  @ApiProperty()
  @IsString()
  range: string;
}

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('upload-test')
  public uploadFiles(@Body() props: a): Promise<any> {
    const metadata = this.googleService.getSpreadsheetMetadata(
      props.spreadsheetId,
      props.range,
    );

    return metadata;
  }
}
