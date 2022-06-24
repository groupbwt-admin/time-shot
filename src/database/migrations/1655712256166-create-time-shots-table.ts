import { MigrationInterface, QueryRunner } from "typeorm";

export class createTimeShotsTable1655712256166 implements MigrationInterface {
    name = 'createTimeShotsTable1655712256166';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`time_shots\`
                                 (
                                     \`id\`              varchar(36)  NOT NULL,
                                     \`userId\`          varchar(36) NOT NULL,
                                     \`locationStartId\` varchar(36) NOT NULL,
                                     \`locationEndId\`   varchar(36) NULL,
                                     \`start\`           timestamp() NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                                     \`stop\`            timestamp NULL,
                                     PRIMARY KEY (\`id\`)
                                 ) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`time_shots\`
            ADD CONSTRAINT \`FK_829f33ad8cf6e04e54174899853\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_shots\`
            ADD CONSTRAINT \`FK_b1832b42e091a5bbdaa0b7ebfa5\` FOREIGN KEY (\`locationStartId\`) REFERENCES \`locations\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`time_shots\`
            ADD CONSTRAINT \`FK_d4d347ea4ebfe1579e6e8cecf43\` FOREIGN KEY (\`locationEndId\`) REFERENCES \`locations\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_shots\` DROP FOREIGN KEY \`FK_d4d347ea4ebfe1579e6e8cecf43\``);
        await queryRunner.query(`ALTER TABLE \`time_shots\` DROP FOREIGN KEY \`FK_b1832b42e091a5bbdaa0b7ebfa5\``);
        await queryRunner.query(`ALTER TABLE \`time_shots\` DROP FOREIGN KEY \`FK_829f33ad8cf6e04e54174899853\``);
        await queryRunner.query(`DROP TABLE \`time_shots\``);
    }

}
