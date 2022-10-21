import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TextRuFileResultDto {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsNumber()
  text_unique: number;

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
