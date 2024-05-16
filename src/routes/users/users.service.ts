import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findAll() {
    try {
      const allUsers = await this.userRepo.find({
        select: ['id', 'email', 'username', 'createdAt'],
      });
      return allUsers;
    } catch (error) {
      throw new NotFoundException('No user found');
    }
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'createdAt'],
    });
    if (user) return user;
    throw new NotFoundException('Could not find the user');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = { id, updateUserDto };
    await this.userRepo.update({ id: id }, updateUser);
    const updatedUser = await this.userRepo.findOne({
      where: {
        id: updateUser.id,
      },
      select: ['id', 'email', 'username', 'createdAt'],
    });
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!user) return null;
    await this.userRepo.remove(user);
    return user;
  }
}
