import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User login',
    example: 'TestUser',
  })
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(20, { message: 'Name must not exceed 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Name can only contain letters, numbers and underscore' })
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  password: string;
}
