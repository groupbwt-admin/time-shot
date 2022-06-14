import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './../database/entities/user.entity';

@Module({
  imports: [
   TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [],
  providers: [],
})
export class UsersModule {}
