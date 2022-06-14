import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import getHashPassword from '../common/utils/get-hashed-password';
import { UserService } from './user.service';
import { LoginUserDto } from '../common/dtos/login-user.dto';

@Injectable()
export class AuthService {
    public logger = new Logger('AuthService');

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        const currentHashedPassword = await getHashPassword(password);
        if (user && user.hashedPassword === currentHashedPassword) {
            const { email, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: LoginUserDto) {
        const findUser = await this.validateUser(user.email, user.password);
        if (!findUser) {
            return { 'error': 'Wrong email and/or password' };
        }
        const payload = { username: findUser.email, sub: findUser.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}