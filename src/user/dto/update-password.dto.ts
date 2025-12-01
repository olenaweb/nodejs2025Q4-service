import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Previous password',
    example: 'oldPassword123',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword456',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
