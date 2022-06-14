import {MigrationInterface, QueryRunner} from "typeorm";

export class User1653592800200 implements MigrationInterface {
    name = 'User1653592800200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(32) NOT NULL, \`hashedPassword\` varchar(255) NOT NULL, \`role\` enum ('0', '1', '2') NOT NULL DEFAULT '0', UNIQUE INDEX \`ux_users_email\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`ux_users_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
