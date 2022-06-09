import { Injectable, Logger, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/common/dtos/create-user.dto";
import { UserEntity } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import getHashPassword from "src/common/utils/get-hashed-password";


@Injectable()
export class UserService {

    public logger = new Logger('UserService')

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

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