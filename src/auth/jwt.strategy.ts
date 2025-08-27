import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser, JwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret: string | undefined = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    try {
      // Validate that user still exists in database
      const user: User | null = await this.usersService.findById(payload.sub);
      if (!user) {
        this.logger.warn(
          `JWT validation failed - user not found: ${payload.sub}`,
        );
        throw new UnauthorizedException('User no longer exists');
      }

      const authenticatedUser: AuthenticatedUser = {
        userId: payload.sub,
        email: payload.email,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };

      return authenticatedUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`JWT validation error for user: ${payload.sub}`, error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
