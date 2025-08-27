import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret: string | undefined =
          configService.get<string>('JWT_SECRET');
        const expiresIn: string | undefined =
          configService.get<string>('JWT_EXPIRES_IN');
        const issuer: string | undefined =
          configService.get<string>('JWT_ISSUER');
        const audience: string | undefined =
          configService.get<string>('JWT_AUDIENCE');

        if (!secret) {
          throw new Error(
            'JWT_SECRET must be defined in environment variables',
          );
        }

        if (!expiresIn) {
          throw new Error(
            'JWT_EXPIRES_IN must be defined in environment variables',
          );
        }

        if (!issuer) {
          throw new Error(
            'JWT_ISSUER must be defined in environment variables',
          );
        }

        if (!audience) {
          throw new Error(
            'JWT_AUDIENCE must be defined in environment variables',
          );
        }

        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn,
            issuer: issuer,
            audience: audience,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
