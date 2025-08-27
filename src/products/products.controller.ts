import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Get()
  async findAllProducts(@Query() filters: FilterProductsDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await this.productsService.findAllProducts(filters);
  }

  @Get(':id')
  async findOneProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return await this.productsService.findOneProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeProduct(@Param('id', ParseUUIDPipe) id: string) {
    const deletedCount = await this.productsService.removeProduct(id);
    return {
      message: `Product deleted successfully`,
      deletedCount,
    };
  }
}
