import { MigrationInterface, QueryRunner } from "typeorm";

export class Location1655282199647 implements MigrationInterface {
    name = 'Location1655282199647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`locations\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(256) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`creatorId\` varchar(36) NULL, INDEX \`ux_locations_creator\` (\`creatorId\`), UNIQUE INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD CONSTRAINT \`FK_9eabb6aa5ae8bda167b26b77121\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_9eabb6aa5ae8bda167b26b77121\``);
        await queryRunner.query(`DROP INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` ON \`locations\``);
        await queryRunner.query(`DROP INDEX \`ux_locations_creator\` ON \`locations\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
    }

}
