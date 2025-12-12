import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService, TokenResponse } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '60efc925-a049-404d-9390-d0ff252abc09' },
        login: { type: 'string', example: 'john_doe' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request (invalid data)' })
  @ApiResponse({ status: 409, description: 'User with this login already exists' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() signupDto: SignupDto): Promise<{ id: string; login: string }> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OWRkMWYxYS01ZDgwLTRkNjctOGNjYi1jMzljMTg4OTcyNGIiLCJsb2dpbiI6InRlc3R1c2VyIiwiaWF0IjoxNzY1NTI0OTAzLCJleHAiOjE3NjU1Mjg1MDN9.Z-kiKl1JpQSbWwHPGTelmiWEd4nTyLuIVvbJrzG8ljE',
        },
        refreshToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OWRkMWYxYS01ZDgwLTRkNjctOGNjYi1jMzljMTg4OTcyNGIiLCJsb2dpbiI6InRlc3R1c2VyIiwiaWF0IjoxNzY1NTI0OTAzLCJleHAiOjE3NjU2MTEzMDN9.vSBq2rFpulJHNM500TrFTts0Fp2ByFfw65isGKVb39w',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request (invalid data)' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token is required' })
  @ApiResponse({ status: 403, description: 'Invalid or expired refresh token' })
  async refresh(@Body() body: any): Promise<TokenResponse> {
    if (!body || !body.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const refreshDto: RefreshDto = body;
    return this.authService.refresh(refreshDto);
  }
}
