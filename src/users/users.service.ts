import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    role: 'user' | 'admin' = 'user',
  ): Promise<User> {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('User with this email already exists.');
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      throw new BadRequestException('Password is required');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      passwordHash,
      name,
      role,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

