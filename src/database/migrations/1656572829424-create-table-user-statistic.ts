import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableUserStatistic1656572829424 implements MigrationInterface {
    name = 'createTableUserStatistic1656572829424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_statistic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`workTime\` mediumint NOT NULL, \`workDate\` date NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NOT NULL, INDEX \`ix_statistic_user\` (\`userId\`), INDEX \`ix_statistic_workTime\` (\`workTime\`), INDEX \`ix_statistic_workDate\` (\`workDate\`), UNIQUE INDEX \`IDX_7c8ac993ff0a0eda50a6e99de6\` (\`userId\`, \`workDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_statistic\` ADD CONSTRAINT \`FK_9ac2ba71e7e10f256f2028e2b6b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_statistic\` DROP FOREIGN KEY \`FK_9ac2ba71e7e10f256f2028e2b6b\``);
        await queryRunner.query(`DROP INDEX \`IDX_7c8ac993ff0a0eda50a6e99de6\` ON \`user_statistic\``);
        await queryRunner.query(`DROP INDEX \`ix_statistic_workDate\` ON \`user_statistic\``);
        await queryRunner.query(`DROP INDEX \`ix_statistic_workTime\` ON \`user_statistic\``);
        await queryRunner.query(`DROP INDEX \`ix_statistic_user\` ON \`user_statistic\``);
        await queryRunner.query(`DROP TABLE \`user_statistic\``);
    }

}
