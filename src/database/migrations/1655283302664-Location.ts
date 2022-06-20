import {MigrationInterface, QueryRunner} from "typeorm";

export class Location1655283302664 implements MigrationInterface {
    name = 'Location1655283302664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`isActive\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`isActive\``);
    }

}
