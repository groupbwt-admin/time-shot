import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../common/dtos/create-user.dto";
import getHashPassword from "../common/utils/get-hashed-password";
import { UserEntity } from "../database/entities/user.entity";


@Injectable()
export class UserService {

    public logger = new Logger('UserService');

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    async create(dto: CreateUserDto): Promise<UserEntity> {
        const password = dto.password;
        const hashedPassword = await getHashPassword(password);
        const user = this.userRepository.create({ ...dto, hashedPassword: hashedPassword });
        await this.userRepository.save(user);
        return user;
    }

    async find(): Promise<UserEntity[] | []> {
        return this.userRepository.find();
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { email: email } });
    }
}