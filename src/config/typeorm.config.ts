import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: 'root',
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [__dirname + '/../database/entities/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: './src/database/migrations'
    },
    extra: {
        charset: 'utf8mb4_unicode_ci'
    },
    logging: process.env.TYPEORM_LOGGING.toLowerCase() === 'true',
    synchronize: process.env.TYPEORM_SYNCHRONIZE.toLowerCase() === 'true',
};
