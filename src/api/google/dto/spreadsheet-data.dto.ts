import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SpreadSheetDataDto {
  @ApiProperty()
  @IsString()
  columnCheckStatus: string;

  @ApiProperty()
  @IsString()
  columnBkTitle: string;

  @ApiProperty()
  @IsString()
  columnDockLink: string;

  @ApiProperty()
  @IsString()
  clumnFirstAntiPlag: string;

  @ApiProperty()
  @IsString()
  clumnSecondAntiPlag: string;

  @ApiProperty()
  @IsString()
  clumnWordsNumber: string;

  @ApiProperty()
  @IsString()
  spreadsheetId: string;

  @ApiProperty()
  @IsString()
  rangeSheetTitle: string;

  @ApiProperty()
  @IsString()
  from: number;

  @ApiProperty()
  @IsString()
  to: number;
}
