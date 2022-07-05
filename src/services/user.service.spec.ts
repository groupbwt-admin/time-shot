import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "../common/enums/role.enum";
import { UserEntity } from "../database/entities/user.entity";
import { UserService } from "./user.service";

describe('UserService', () => {
    let service: UserService;

    const mockUsers = [{
        id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
        email: 'user@user.com',
        hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
        role: 'superadmin',
    }];
    const mockUserRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(user => Promise.resolve({ ...user })),
        find: jest.fn().mockResolvedValue(mockUsers),
        findOne: jest.fn().mockImplementation(condition => {
            const { where: { email } } = condition;
            for (let user of mockUsers) {
                if (user.email === email) {
                    return Promise.resolve({ ...user });
                };
            };
        }),
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
            hashedPassword: expect.any(String),
            role: Role.USER
        });
    });

    it('should return all users', async () => {
        expect(await service.find()).toEqual([
            {
                id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
                email: 'user@user.com',
                hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
                role: 'superadmin',
            }
        ]);
    });

    it('should find and return the user by email', async () => {
        const email = 'user@user.com';
        expect(await service.findOneByEmail(email)).toEqual({
            id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
            email: 'user@user.com',
            hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
            role: 'superadmin',
        });
    });

    it('should return undefined if no user was found by email', async () => {
        const email = 'user1@user1.com';
        expect(await service.findOneByEmail(email)).toEqual(undefined);
    });
});
