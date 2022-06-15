import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { join } from "path";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{.ts,.js}')],
    extra: {
        charset: 'utf8mb4_unicode_ci'
    },
    cli: {
        migrationsDir: join(__dirname, '..', 'database', 'migrations')
    },
    logging: process.env.TYPEORM_LOGGING.toLowerCase() === 'true',
    synchronize: process.env.TYPEORM_SYNCHRONIZE.toLowerCase() === 'true'
};