import { IsOptional, IsNumber, IsIn, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterProductsDto {
  // Price Range
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  // Sorting
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  // Exact Price
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  price?: number;

  // Pagination
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number; // page starts from 1
}
