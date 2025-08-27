import { ArrayNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductsDto {
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids: string[];
}
