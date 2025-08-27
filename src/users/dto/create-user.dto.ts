import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'User email is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'User password is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  password: string;
}
