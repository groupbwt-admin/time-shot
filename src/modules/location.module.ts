import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationController } from "../controllers/location.controller";
import { LocationEntity } from "../database/entities/location.entity";
import { LocationService } from "../services/location.service";
import { AuthModule } from "./auth.module";
import { UsersModule } from "./users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule { }