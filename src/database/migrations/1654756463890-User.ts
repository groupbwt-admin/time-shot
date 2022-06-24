import { MigrationInterface, QueryRunner } from "typeorm";

export class User1654756463890 implements MigrationInterface {
    name = 'User1654756463890';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\`
            ADD \`createdAt\` timestamp() NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\`
            ADD \`updatedAt\` timestamp() NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\`
            ADD \`deletedAt\` timestamp() NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN role`);
        await queryRunner.query(`ALTER TABLE \`users\`
            ADD role enum ('superadmin', 'admin', 'user') NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN createdAt`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN updatedAt`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN deletedAt`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN role`);
        await queryRunner.query(`ALTER TABLE \`users\`
            ADD role enum ('0', '1', '2') NOT NULL DEFAULT '0'`);
    }
}
