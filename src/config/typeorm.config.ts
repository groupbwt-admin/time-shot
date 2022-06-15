import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
const { join } = require("path");

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{.ts,.js}')],
    synchronize: false,
    extra: {
        charset: 'utf8mb4_unicode_ci'
    },
    cli: {
        migrationsDir: __dirname + '/../database/migrations',
    },
    logging: true,
};