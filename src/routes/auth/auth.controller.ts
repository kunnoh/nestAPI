import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(
    @Body() createAuthDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(createAuthDto);
  }

  @Post('/signup')
  signup(
    @Body() createUserDto: RegisterDto,
  ): Promise<{ username: string; email: string }> {
    return this.authService.register(createUserDto);
  }
}
