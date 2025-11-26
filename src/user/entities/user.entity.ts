import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'TestUser',
  })
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  password: string;

  @ApiProperty({
    description: 'Version number, increments on update',
    example: 1,
  })
  version: number;

  @ApiProperty({
    description: 'Timestamp of creation',
    example: 1655000000,
  })
  createdAt: number;

  @ApiProperty({
    description: 'Timestamp of last update',
    example: 1655000000,
  })
  updatedAt: number;
}
