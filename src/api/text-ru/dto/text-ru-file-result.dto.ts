import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class TextRuFileResultDto {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsNumberString()
  text_unique: string;

  @ApiPropertyOptional()
  @IsString()
  json_result?: string;

  @ApiPropertyOptional()
  @IsString()
  spell_check?: string;

  @ApiPropertyOptional()
  @IsString()
  seo_check?: string;
}
