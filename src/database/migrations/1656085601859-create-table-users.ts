import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableUsers1656085601859 implements MigrationInterface {
    name = 'createTableUsers1656085601859';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\`
                                 (
                                     \`id\`             varchar(36)  NOT NULL,
                                     \`email\`          varchar(32)  NOT NULL,
                                     \`hashedPassword\` varchar(255) NOT NULL,
                                     \`role\`           enum ('superadmin', 'admin', 'user') NOT NULL DEFAULT 'user',
                                     \`createdAt\`      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     \`updatedAt\`      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     \`deletedAt\`      timestamp NULL,
                                     UNIQUE INDEX \`ux_users_email\` (\`email\`),
                                     UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                                     PRIMARY KEY (\`id\`)
                                 ) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP
        INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP
        INDEX \`ux_users_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
