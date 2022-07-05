import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUsers = [{
    id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
    email: 'user@user.com',
    hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
    role: 'superadmin',
  }];
  const mockUserService = {
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
      imports: [
        PassportModule.register({ 'defaultStrategy': 'bearer' }),
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return accessToken after successfully authorization', async () => {
    const user = { email: 'user@user.com', password: 'user' };
    expect(await controller.login(user)).toEqual({
      access_token: expect.any(String)
    });
    expect(mockUserService.findOne).toHaveBeenCalled();
  });

  it('should return message error after unsuccessful authorization', async () => {
    const user = { email: 'user@user.com', password: 'test' };
    expect(await controller.login(user)).toEqual({
      'error': 'Wrong email and/or password'
    });
    expect(mockUserService.findOne).toHaveBeenCalled();
  });
});
