import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './modules/location.module';

import { getTypeOrmModuleOptions } from "./config/typeorm.config";
import { CreateAccountCommand } from "./commands/create-account.command";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        TypeOrmModule.forRoot(getTypeOrmModuleOptions()),
        UsersModule,
        AuthModule,
        LocationModule
    ],
    controllers: [AppController],
    providers: [AppService, CreateAccountCommand]
})
export class AppModule {
}
