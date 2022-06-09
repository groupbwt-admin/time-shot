import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import getHashPassword from 'src/common/utils/get-hashed-password';

@Injectable()
export class AuthService {
    public logger = new Logger('AuthService')

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        const currentHashedPassword = await getHashPassword(password);
        if (user && user.hashedPassword === currentHashedPassword) {
            const { email, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const findUser = await this.validateUser(user.email, user.password);
        if (!findUser) {
            return { 'error': 'Wrong email and/or password' }
        }
        const payload = { username: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}