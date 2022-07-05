import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ 'defaultStrategy': 'bearer' }),
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('validateUser', () => {
  let service: AuthService;

  const mockUsers = [{
    id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
    email: 'user@user.com',
    hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
    role: 'superadmin',
  }];
  const mockUserRepository = {
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
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return a user object when credentials are valid', async () => {
    const res = await service.validateUser('user@user.com', 'user');
    expect(res.id).toEqual('2116ce44-f5e2-11ec-9b36-b42e999e335c');
  });

  it('should return null when credentials are invalid', async () => {
    const res = await service.validateUser('user1@user1.com', 'user');
    expect(res).toBeNull();
  });
});

describe('validateLogin', () => {
  let service: AuthService;

  const mockUsers = [{
    id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
    email: 'user@user.com',
    hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
    role: 'superadmin',
  }];
  const mockUserRepository = {
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
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return JWT object when credentials are valid', async () => {
    const res = await service.login({ email: 'user@user.com', password: 'user' });
    expect(res.access_token).toBeDefined();
  });
});
