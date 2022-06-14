import { MigrationInterface, QueryRunner } from "typeorm";

export class Location1655107844826 implements MigrationInterface {
    name = 'Location1655107844826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`locations\` (\`id\` varchar(36) NOT NULL, \`creator_email\` varchar(32) NOT NULL, \`name\` varchar(128) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, INDEX \`ux_locations_creator_email\` (\`creator_email\`), UNIQUE INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` ON \`locations\``);
        await queryRunner.query(`DROP INDEX \`ux_locations_creator_email\` ON \`locations\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
    }

}
