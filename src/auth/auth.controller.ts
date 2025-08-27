import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import {
  LoginResponse,
  RefreshTokenResponse,
  SignupResponse,
  type AuthenticatedRequest,
  type UserResponse,
} from './interfaces/auth.interfaces';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  /**
   * User Signup
   * Creates a new user account
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ): Promise<SignupResponse> {
    this.logger.log(`Signup attempt for email: ${createUserDto.email}`);

    const user = await this.authService.signup(
      createUserDto.email,
      createUserDto.password,
    );

    this.logger.log(`User signed up successfully: ${user.email}`);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };

    return {
      message: 'User registered successfully',
      user: userResponse,
    };
  }

  /**
   * User Login
   * Returns JWT access token and user info
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    userLoginDto: UserLoginDto,
  ): Promise<LoginResponse> {
    return await this.authService.login(userLoginDto);
  }

  /**
   * Get current user profile
   * Requires a valid JWT token
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: AuthenticatedRequest): UserResponse {
    return {
      id: req.user.userId,
      email: req.user.email,
      createdAt: req.user.user?.createdAt || new Date(), // Fallback
    };
  }

  /**
   * Refresh Token (Optional - for better UX)
   */
  @UseGuards(JwtAuthGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Request() req: AuthenticatedRequest,
  ): Promise<RefreshTokenResponse> {
    return await this.authService.refreshToken(req.user.userId);
  }
}
