import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TextRuFileResultDto {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsNumber()
  text_unique: number;

  @ApiProperty()
  @IsString()
  json_result: string;

  @ApiProperty()
  @IsString()
  spell_check: string;
}
