import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { LoginUserDto } from '../common/dtos/login-user.dto';

@Injectable()
export class AuthService {
    public logger = new Logger('AuthService');

    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) {
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
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
            access_token: this.getAccessToken(payload)
        };
    }

    getAccessToken(payload: object): string {
        return this.jwtService.sign(payload);
    }
}