import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : (value as string | undefined),
  )
  description?: string;
}
