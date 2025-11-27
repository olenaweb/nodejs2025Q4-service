import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'Album name',
    example: 'Innuendo',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Release year',
    example: 1991,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Artist ID',
    example: '8d3ee94f-876d-4ba1-a64c-f8d6ace64302',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string;
}
