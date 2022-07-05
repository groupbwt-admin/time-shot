import { UsersStatisticsEntity } from "database/entities/user-statistic.entity";
import { Role } from '../../enums/role.enum';
import convertSecoundsToHours from "common/utils/convert-secounds-to-hours";

const showTotalStatistic = async (request, response, context) => {
    const records = await UsersStatisticsEntity
        .createQueryBuilder("stat")
        .leftJoinAndSelect("stat.user", "users")
        .select([
            "workTime", 
            "userId",
            "users.email as userEmail",
            "SUM(stat.workTime) OVER(PARTITION BY stat.userId ORDER BY stat.userId) as userWorkTime",
            "SUM(stat.workTime) OVER() as totalByPeriod"
        ])
        .where(
            "workDate >= :dateFrom AND workDate <= :dateTo", 
            {dateFrom: request.query.dateFrom, dateTo: request.query.dateTo}
        )
        .orderBy("userWorkTime", "DESC")
        .getRawMany();
    
    let usedEmails = [];
    let results = records.filter(record => { 
        if (!usedEmails.includes(record.userEmail)) {
            usedEmails.push(record.userEmail);
            return true;
        }
    }, usedEmails);
    results = results.map(record => { 
        return {
            userEmail: record.userEmail, 
            userId: record.userId, 
            userWorkTime: convertSecoundsToHours(record.userWorkTime)
        };
    });

    if (context.currentAdmin.role === Role.ADMIN || context.currentAdmin.role === Role.SUPERADMIN) {

        return {
            contentCustomer: "admin",
            meta: {
                totalByPeriod: convertSecoundsToHours(records[0].totalByPeriod),
                usersCount: results.length,
                averageByUser: convertSecoundsToHours(records[0].totalByPeriod/results.length)
            },
            records: results
        };
    } else {
        const filteredRecords = results.filter(record => record.userId === context.currentAdmin.id);

        return {
            contentCustomer: "user",
            meta: {
                totalByPeriod: convertSecoundsToHours(filteredRecords[0].userWorkTime),
                usersCount: 1,
                averageByUser: "-"
            },
            records: filteredRecords
        };
    }
    
}

export default  showTotalStatistic;
