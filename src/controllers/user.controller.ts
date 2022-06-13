import { Controller, Get, Logger, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UserEntity } from "../database/entities/user.entity";
import { UserService } from "../services/user.service";

@Controller('users')
export class UserController {
    public logger = new Logger('UserController');

    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<UserEntity[]> {
        const users = this.userService.find();
        return users;
    }

    @UseGuards(JwtAuthGuard)
    @Get('my_profile')
    async getProfile(@Req() req): Promise<UserEntity> {
        return await this.userService.findOneByEmail(req.user.username);
    }
}