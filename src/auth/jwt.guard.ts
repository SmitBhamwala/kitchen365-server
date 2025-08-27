import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from './interfaces/auth.interfaces';

interface JwtAuthInfo {
  message?: string;
  name?: string; // 'TokenExpiredError', 'JsonWebTokenError', etc.
  expiredAt?: Date;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  // canActivate(context: ExecutionContext): boolean | Promise<boolean> {
  //   // Add any custom logic here before calling the parent
  //   return super.canActivate(context) as Promise<boolean>;
  // }

  handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: TUser | false,
    info: JwtAuthInfo,
  ): TUser {
    if (err || !user) {
      this.logger.warn(
        `Authentication failed: ${info?.message || 'Unknown error'}`,
      );
      throw (
        err ||
        new UnauthorizedException('Access denied - Invalid or missing token')
      );
    }
    return user;
  }
}
