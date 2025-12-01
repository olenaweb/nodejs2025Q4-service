import { omitKeys } from '../utils/omit-keys';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    return this.excludePassword(user);
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map((user) => this.excludePassword(user));
  }

  findOne(id: string): Omit<User, 'password'> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): Omit<User, 'password'> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.excludePassword(user);
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID (not UUID)');
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    return omitKeys(user, 'password');
  }
}
