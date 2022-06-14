import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "../common/enums/role.enum";
import getHashPassword from "../common/utils/get-hashed-password";
import { UserEntity } from "../database/entities/user.entity";
import { UserService } from "./user.service";

describe('UserService', () => {
    let service: UserService;

    const mockUserRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(user => Promise.resolve({ ...user }))
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserRepository
                }
            ]
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user record and return that', async () => {
        const dto = {
            email: 'user@user.com',
            password: 'user',
            role: Role.USER
        };
        expect(await service.create(dto)).toEqual({
            email: 'user@user.com',
            password: 'user',
            hashedPassword: await getHashPassword('user'),
            role: Role.USER
        });
    });
});