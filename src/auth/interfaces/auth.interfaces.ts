import { User } from 'src/users/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  user?: Partial<User>;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
}

export interface SignupResponse {
  message: string;
  user: UserResponse;
}

export interface RefreshTokenResponse {
  token: string;
}

// Request type for authenticated routes
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
