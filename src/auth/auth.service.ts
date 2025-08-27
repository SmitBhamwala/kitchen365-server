import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt, { genSaltSync } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async signup(email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, genSaltSync());

      const user = await this.usersService.createUser({
        email,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Validate user credentials (for login)
   */
  private async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  /**
   * Login user and return JWT with user info
   */
  async login(userLoginDto: UserLoginDto): Promise<{
    token: string;
    user: { id: string; email: string; createdAt: Date };
  }> {
    const user = await this.validateUser(
      userLoginDto.email,
      userLoginDto.password,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000), // Issued at
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Refresh token for extended sessions
   */
  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await this.jwtService.signAsync(payload);

    if (!token) {
      throw new InternalServerErrorException('Failed to generate token');
    }

    return { token };
  }
}
