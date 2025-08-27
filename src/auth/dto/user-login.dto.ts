import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'User email is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'User password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  password: string;
}
