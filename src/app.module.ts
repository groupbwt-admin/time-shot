import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
   }),
   TypeOrmModule.forRoot(),
   UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
