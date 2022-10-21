import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTableDto {
  @ApiProperty()
  @IsString()
  spreadsheetId: string;

  @ApiProperty()
  @IsString()
  rangeSheetTitle: string;
}
