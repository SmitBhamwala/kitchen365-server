import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user (Signup)
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: password,
    });
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Find all users (for admin purposes)
   */
  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'email', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Find user by id
   */
  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      select: ['id', 'email', 'createdAt', 'updatedAt'],
      where: { id },
    });
  }
}
