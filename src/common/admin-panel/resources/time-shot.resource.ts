import { ResourceWithOptions } from "adminjs";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";
import hasAdminPermission from "../permissions/has-admin.permission";

const TimeShotResource: ResourceWithOptions = {
    resource: TimeShotEntity,
    options: {
        actions: {
            getWorkingTimeShot: {
                icon: 'Activate',
                actionType: 'record',
                handler: async (request, response, context) => {
                    const user = await TimeShotEntity.find({
                        select: ["id", "start"],
                        where: { stop: null }
                    });
                    const record: object | null = user ? user : null;

                    return {
                        record
                    };
                },
                isVisible: false
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