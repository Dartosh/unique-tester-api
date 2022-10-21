import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

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

  @ApiPropertyOptional()
  @IsNumber()
  from?: number;

  @ApiPropertyOptional()
  @IsNumber()
  to?: number;

  @ApiProperty()
  @IsBoolean()
  isOnlyWords: boolean;
}
