import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../common/dtos/login-user.dto';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('auth/login')
    async login(@Body() body: LoginUserDto): Promise<Object> {
        return await this.authService.login(body);
    }
}
