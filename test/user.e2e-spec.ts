import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersModule } from '../src/modules/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/database/entities/user.entity';
import { AuthModule } from '../src/modules/auth.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [{
    id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
    email: 'user@user.com',
    hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
    role: 'superadmin',
  }];
  let userService = {
    find: () => [
      {
        id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
        email: 'user@user.com',
        hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
        role: 'superadmin',
      },
    ],
    findOne: jest.fn().mockImplementation(condition => {
      const { where: { email } } = condition;
      for (let user of mockUsers) {
        if (user.email === email) {
          return Promise.resolve({ ...user });
        };
      };
    }),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
      ],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(userService)
      .compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.setGlobalPrefix('/api');
    await app.init();
  });

  it('/api/users (GET) without authorization', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(401)
      .expect({ "statusCode": 401, "message": "Unauthorized" });
  });

  it('/api/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user@user.com', password: 'user' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(JSON.parse(response.text)).toEqual({
          access_token: expect.any(String)
        })
      });
  });

  it('/api (GET) with authorization', async () => {
    const { text } = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user@user.com', password: 'user' })
      .set('Accept', 'application/json');

    const { access_token } = JSON.parse(text);
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${access_token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(JSON.parse(response.text)).toEqual([
          {
            id: '2116ce44-f5e2-11ec-9b36-b42e999e335c',
            email: 'user@user.com',
            hashedPassword: '$2b$10$dfasdsdqwdqwdasdasd/yeAsC92cOK37eQ63omTOol00Du7yWUFQy',
            role: 'superadmin',
          },
        ])
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
