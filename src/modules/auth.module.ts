import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/common/constants/jwt-constants';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        PassportModule.register({ 'defaultStrategy': 'bearer' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
        UsersModule,
    ],
    providers: [
        AuthService,
        JwtStrategy
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }