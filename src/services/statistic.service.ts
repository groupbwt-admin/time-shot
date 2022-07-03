import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimeShotEntity } from '../database/entities/time-shot.entity';
import { UsersStatisticsEntity } from '../database/entities/user-statistic.entity';

@Injectable()
export class StatisticService {
    private readonly logger = new Logger(StatisticService.name);

    @Cron('0 */15 * * * *')
    async createStatisticByUsers(currentDate: string | null = null, userId: string | null = null): Promise<void> {
        let baseWhereExpression = 'DATE(start) = :currentDate';
        if (currentDate === null) {
            const now = new Date();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            currentDate = [now.getFullYear(), (month > 9 ? '' : '0') + month, (day > 9 ? '' : '0') + day].join('-');
        }

        if (!!userId) {
            baseWhereExpression += ' and userId = :userId'
        }

        const usersStatistics = await TimeShotEntity
            .createQueryBuilder()
            .where(baseWhereExpression, {currentDate: currentDate, userId: userId})
            .select(['userId as userId'])
            .addSelect("SUM((TO_DAYS(TIME(stop)) * 24 * 3600 + TIME_TO_SEC(TIME(stop))) - (TO_DAYS(TIME(start)) * 24 * 3600 + TIME_TO_SEC(TIME(start)))) as 'workTime'")
            .groupBy('userId, DATE(start)')
            .getRawMany()
        
        for (const userStatistic of usersStatistics) {
            // TODO https://github.com/typeorm/typeorm/issues/7643
            await UsersStatisticsEntity
                .query(
                    `INSERT INTO \`user_statistic\`(\`id\`, \`workTime\`, \`workDate\`, \`createdAt\`, \`updatedAt\`, \`userId\`) ` + 
                    `VALUES (DEFAULT, '${userStatistic.workTime}', '${currentDate}', DEFAULT, DEFAULT, '${userStatistic.userId}') ` + 
                    `ON DUPLICATE KEY UPDATE \`workTime\` = VALUES(\`workTime\`);`
                );
        } 
    }
}
