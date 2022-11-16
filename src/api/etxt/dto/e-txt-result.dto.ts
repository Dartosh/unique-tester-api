import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class TextRuFileResultDto {
  @ApiProperty()
  @IsString()
  XmlFileName: string;

  @ApiProperty()
  @IsString()
  NumDocsInPacket: string;

  @ApiProperty()
  @IsString()
  Error: string;

  @ApiProperty()
  @IsString()
  PacketTime: string;

  @ApiProperty()
  @IsString()
  TotalWords: string;

  @ApiProperty()
  @IsString()
  Xml: string;

  @ApiProperty()
  @IsString()
  ServerType: string;

  @ApiProperty()
  @IsString()
  ServerId: string;
}
