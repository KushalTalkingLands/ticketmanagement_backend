import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, AuthTokenPayload } from './auth.service';

class RegisterDto {
  email!: string;
  password!: string;
  name!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto): Promise<AuthTokenPayload> {
    const { email, password, name } = body;
    return this.authService.register(email, password, name);
  }

  @Post('login')
  login(@Body() body: LoginDto): Promise<AuthTokenPayload> {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}

