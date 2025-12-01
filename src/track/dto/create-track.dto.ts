import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    description: 'Track name',
    example: 'Bohemian Rhapsody',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Artist ID',
    example: '8d3ee94f-876d-4ba1-a64c-f8d6ace64302',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string;

  @ApiProperty({
    description: 'Album ID',
    example: '03019106-913d-41b8-8c88-b34b593f7d07',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  albumId?: string;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 355,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
