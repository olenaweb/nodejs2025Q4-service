import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    description: 'Artist name',
    example: 'The Beatles',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Does the artist have a Grammy award',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
