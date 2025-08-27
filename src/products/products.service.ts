import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAllProducts(filters: FilterProductsDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { minPrice, maxPrice, order, price, limit = 10, page = 1 } = filters;

    const query = this.productRepository.createQueryBuilder('products');

    // Select only required fields
    query.select([
      'products.id',
      'products.name',
      'products.price',
      'products.description',
    ]);

    // Apply filters
    if (minPrice !== undefined) {
      query.andWhere('products.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query.andWhere('products.price <= :maxPrice', { maxPrice });
    }
    if (price !== undefined) {
      query.andWhere('products.price = :price', { price });
    }

    // Ordering
    query.orderBy('products.createdAt', order ?? 'DESC');

    // Pagination
    query.take(limit);
    query.skip((page - 1) * limit);

    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOneProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async removeProduct(id: string): Promise<number> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return result.affected ?? 0;
  }
}
