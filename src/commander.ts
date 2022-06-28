import { AppModule } from './app.module';
import { CommandFactory } from "nest-commander";

async function bootstrap() {
    await CommandFactory.run(AppModule);

    // TODO: the process does not complete because of a module TypeOrmModule.forRoot(getTypeOrmModuleOptions())
    process.exit();
}

bootstrap();
