import { omitKeys } from '../utils/omit-keys';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { validate as uuidValidate } from 'uuid';

// used timestamp instead of Date
type UserResponse = Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
  createdAt: number;
  updatedAt: number;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      throw new BadRequestException(`User with login "${createUserDto.login}" already exists`);
    }

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    return this.excludePassword(user);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserResponse> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  private excludePassword(user: User): UserResponse {
    const userWithoutPassword = omitKeys(user, 'password');
    // Convert Date to timestamp (number)
    return {
      ...userWithoutPassword,
      createdAt: userWithoutPassword.createdAt.getTime(),
      updatedAt: userWithoutPassword.updatedAt.getTime(),
    };
  }
}
