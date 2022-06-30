export default function generateDaysInCurrentMonth(month: number | null = null): Array<any> {
    const now = new Date();
    if (month === null) {
        month = now.getMonth();
    }
    let result = [];
    let weekNumber = 0;

    const lastDayCurrentMonth = new Date(Date.UTC(now.getFullYear(), month + 1, 0));

    const days = lastDayCurrentMonth.getDate()
    for (let day = 1; day <= days; day++) {
        const fullDate = new Date(Date.UTC(now.getFullYear(), month, day));
        const dayNumber = fullDate.getDay() !== 0 ? fullDate.getDay() : 7;

        result.push({
            dayNumber: dayNumber,
            weekNumber: weekNumber,
            day: fullDate.toISOString().substring(0, 10)
        });

        if (dayNumber === 7) {
            weekNumber += 1;
        }
    }
    return result;
}
