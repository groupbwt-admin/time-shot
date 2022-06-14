import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { setupAdminPanel } from './common/admin-panel/admin-panel.plugin';

async function bootstrap() {

  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api');
  await setupAdminPanel(app);

  const config = new DocumentBuilder()
    .setTitle('Time shot')
    .setDescription('REST API Documentation')
    .setVersion('0.0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

bootstrap();
