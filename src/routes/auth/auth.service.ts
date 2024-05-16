import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    // try {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    console.log(user);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const payload = {
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ id: user.id });
    const passMatched = await bcrypt.compare(password, user.password);

    if (!passMatched)
      throw new UnauthorizedException('Invalid email or password');

    return { accessToken, refreshToken };
    // } catch (error) {
    // throw new UnauthorizedException('Invalid email or password');
    // }
  }

  async register(regDto: RegisterDto) {
    try {
      const { email, password, username } = regDto;

      // Validate input data (using class-validator or similar library)
      console.log('Received registration request:', email, username);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepo.create({
        username,
        email,
        password: hashedPassword,
      });
      await this.userRepo.save(newUser);
      console.log('User created successfully:', newUser);
      return { email, username };
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      )
        throw new ConflictException('Account already exists');

      console.error('Error during user registration:', error.message);
      throw new MethodNotAllowedException('Error during user registration');
    }
    //   const { email, password, username } = regDto;
    //   console.log(email, password, username);
    //   const hashedPw = await bcrypt.hash(password, 10);
    //   // catch error for creating user and say give feedback

    //   const newUser = await this.userRepo.create({
    //     username,
    //     email,
    //     password: hashedPw,
    //   });

    //   await this.userRepo.save(newUser);
    //   // catch error of creating user and give feedback

    //   return newUser;
  }
}
