import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableLocations1656086393045 implements MigrationInterface {
    name = 'createTableLocations1656086393045';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`locations\`
                                 (
                                     \`id\`        varchar(36)  NOT NULL,
                                     \`creatorId\` varchar(36) NOT NULL,
                                     \`name\`      varchar(256) NOT NULL,
                                     \`createdAt\` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     \`updatedAt\` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     \`deletedAt\` timestamp NULL,
                                     INDEX         \`ix_locations_creator\` (\`creatorId\`),
                                     UNIQUE INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` (\`name\`),
                                     PRIMARY KEY (\`id\`)
                                 ) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`locations\`
            ADD CONSTRAINT \`FK_9eabb6aa5ae8bda167b26b77121\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP FOREIGN KEY \`FK_9eabb6aa5ae8bda167b26b77121\``);
        await queryRunner.query(`DROP
        INDEX \`IDX_227023051ab1fedef7a3b6c7e2\` ON \`locations\``);
        await queryRunner.query(`DROP
        INDEX \`ix_locations_creator\` ON \`locations\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
    }

}
