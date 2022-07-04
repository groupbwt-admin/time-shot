import { UsersStatisticsEntity } from "../../../database/entities/user-statistic.entity";
import generateDaysInCurrentMonth from "../../utils/generate-days-in-current-month";

const showUsersStats = async (request, response, context) => {
    const monthNumber = Number(context.record.params.workDate.split("-")[1]) - 1;
    let results = [];
    const daysArray = generateDaysInCurrentMonth(monthNumber);
    const weeksArray = [...new Set(daysArray.map((element) => element.weekNumber))];

    const recordsByMonts = await UsersStatisticsEntity
        .createQueryBuilder("stat")
        .select([
            "stat.id as id", 
            "stat.workTime as workTime", 
            "stat.workDate as workDate"
        ])
        .where(
            "stat.userId = (select userId from user_statistic where id = :recordId)", 
            {recordId: request.params.recordId}
        ).andWhere(
            "stat.workDate between :firstDayInMonth and :lastDayInMonth", 
            {firstDayInMonth: daysArray[0].day, lastDayInMonth: daysArray[daysArray.length - 1].day})
        .getRawMany();

    for (const week of weeksArray) {
        const daysByWeek = daysArray
            .filter((element) => {
                return element.weekNumber === week;
            })
            .map((element) => element.day);
        const recordsByWeek = recordsByMonts.filter((element) => {
            const convertedDay = new Date(
                Date.UTC(element.workDate.getFullYear(), element.workDate.getMonth(), element.workDate.getDate())
            );
            return daysByWeek.includes(convertedDay.toISOString().substring(0, 10));
        });
        let total = 0;
        let workTime = recordsByWeek.map((element) => (total += element.workTime), total).reverse()[0];
        if (typeof workTime !== "number") {
            workTime = 0;
        }
        results.push({
            dayStart: daysByWeek[0],
            dayEnd: daysByWeek[daysByWeek.length - 1],
            workTime: workTime
        });
    }

    let total = 0;
    return {
        record: {
            results: results,
            totalWorkTime: results.map((element) => (total += element.workTime), total).reverse()[0],
            ...context.record.toJSON(context.currentAdmin),
        }
    };
};

export default showUsersStats;
