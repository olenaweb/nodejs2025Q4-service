import {
  Injectable,
  ConflictException,
  // UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

export interface TokenPayload {
  userId: string;
  login: string;
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ id: string; login: string }> {
    const { login, password } = signupDto;

    const existingUser = await this.userService.findByLogin(login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // hash password
    const saltRounds = parseInt(process.env.CRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userService.create({
      login,
      password: hashedPassword,
    });

    return {
      id: user.id,
      login: user.login,
    };
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const { login, password } = loginDto;

    const user = await this.userService.findByLogin(login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.login);
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenResponse> {
    const { refreshToken } = refreshDto;

    try {
      // check refresh token
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        ignoreExpiration: false,
      });

      // expiration check
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      return this.generateTokens(payload.userId, payload.login);
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, login: string): TokenResponse {
    const payload: TokenPayload = { userId, login };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    } as any);

    return { accessToken, refreshToken };
  }
}
