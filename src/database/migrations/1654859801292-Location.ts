import {MigrationInterface, QueryRunner} from "typeorm";

export class Location1654859801292 implements MigrationInterface {
    name = 'Location1654859801292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5ae930c7e5a6288804fc29ac3f\` ON \`locations\``);
        await queryRunner.query(`DROP INDEX \`ux_locations_creator_email\` ON \`locations\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD UNIQUE INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`ux_locations_creator_email\` ON \`locations\` (\`creator_email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`ux_locations_creator_email\` ON \`locations\``);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP INDEX \`IDX_227023051ab1fedef7a3b6c7e2\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`ux_locations_creator_email\` ON \`locations\` (\`creator_email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_5ae930c7e5a6288804fc29ac3f\` ON \`locations\` (\`creator_email\`)`);
    }

}
