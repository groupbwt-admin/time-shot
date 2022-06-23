import { ResourceWithOptions } from "adminjs";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";
import hasAdminPermission from "../permissions/has-admin.permission";
import { IsNull, Not, Raw } from "typeorm";

const TimeShotResource: ResourceWithOptions = {
    resource: TimeShotEntity,
    options: {
        actions: {
            getWorkingTimeShot: {
                handler: async (request, response, context) => {
                    const timeShotEntity: TimeShotEntity = await TimeShotEntity.findOne({
                        select: ["id", "start"],
                        where: { stop: null }
                    });

                    const record: object | null = timeShotEntity ? timeShotEntity : null;
                    return {
                        record
                    };
                },
                isVisible: false
            },
            getTotalMillisecondForCompletedTimeShotsToday: {
                handler: async (request, response, context) => {
                    const timeShotEntities: TimeShotEntity[] = await TimeShotEntity.find({
                        select: ["id", "start"],
                        where: [{
                            stop: Not(IsNull()),
                            start: Raw(`DATE(${(new Date()).toISOString().substring(0, 10)})`)
                        }]
                    });

                    let totalMillisecond: number = timeShotEntities.map(tse => {
                            (new Date(tse.stop)).getTime();
                            return -(new Date(tse.start)).getTime();
                        }
                    ).reduce((partialSum, a) => partialSum + a, 0);

                    return {
                        totalMillisecond: totalMillisecond
                    };
                }
            },
            edit: { isAccessible: hasAdminPermission },
            delete: { isAccessible: hasAdminPermission },
            new: { isAccessible: hasAdminPermission },
            show: { isAccessible: hasAdminPermission },
            list: { isAccessible: hasAdminPermission },
            bulkDelete: { isAccessible: hasAdminPermission },
            search: { isAccessible: hasAdminPermission }
        }
    }
};
export default TimeShotResource;