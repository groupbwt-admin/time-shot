import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from '../src/services/app.service';
import { AppModule } from '../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService = { getHello: () => 'Hello World!' };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.setGlobalPrefix('/api');
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect(appService.getHello());
  });

  afterAll(async () => {
    await app.close();
  });
});
