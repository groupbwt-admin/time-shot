import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
