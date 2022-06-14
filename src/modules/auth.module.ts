import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../common/constants/jwt-constants';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        PassportModule.register({ 'defaultStrategy': process.env.DEFAULT_STRATEGY }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: `${process.env.EXPIRES_IN}h` }
        }),
        UsersModule
    ],
    providers: [
        AuthService,
        JwtStrategy
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
