import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './controllers/app.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleOptions } from './config/typeorm.config';
import { CreateAccountCommand } from "./commands/create-account.command";
import { StatisticService } from './services/statistic.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot(getTypeOrmModuleOptions()),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, StatisticsController],
  providers: [AppService, CreateAccountCommand, StatisticService]
})
export class AppModule {
}
