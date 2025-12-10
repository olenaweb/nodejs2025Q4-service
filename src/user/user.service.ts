import { omitKeys } from '../utils/omit-keys';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
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
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.log(`Creating new user: ${createUserDto.login}`, 'UserService');

    const existingUser = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      this.logger.warn(
        `User creation failed: login "${createUserDto.login}" already exists`,
        'UserService',
      );
      throw new BadRequestException(`User with login "${createUserDto.login}" already exists`);
    }

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    this.logger.log(`User created successfully: ${user.login} (ID: ${user.id})`, 'UserService');

    return this.excludePassword(user);
  }

  async findAll(): Promise<UserResponse[]> {
    this.logger.debug('Fetching all users', 'UserService');
    const users = await this.prisma.user.findMany();
    this.logger.log(`Found ${users.length} users`, 'UserService');
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    this.logger.debug(`Fetching user by ID: ${id}`, 'UserService');

    if (!uuidValidate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'UserService');
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UserService');
      throw new NotFoundException('User not found');
    }

    this.logger.debug(`User found: ${user.login}`, 'UserService');
    return this.excludePassword(user);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserResponse> {
    this.logger.log(`Updating password for user: ${id}`, 'UserService');

    if (!uuidValidate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'UserService');
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UserService');
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      this.logger.warn(`Wrong old password for user: ${user.login}`, 'UserService');
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    this.logger.log(`Password updated successfully for user: ${updatedUser.login}`, 'UserService');

    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`, 'UserService');

    if (!uuidValidate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'UserService');
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UserService');
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted successfully: ${user.login}`, 'UserService');
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
