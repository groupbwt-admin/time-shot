import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('auth/login')
    async login(@Body() body): Promise<Object> {
        return await this.authService.login(body);
    }
}
