import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[] | null> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = this.usersService.create(createUserDto);
    return newUser;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updateUser = await this.usersService.update(id, updateUserDto);
    return updateUser;
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<User> {
    const deletedUser = await this.usersService.remove(id);
    return deletedUser;
  }
}
