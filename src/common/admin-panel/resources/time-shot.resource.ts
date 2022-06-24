import { ResourceWithOptions } from "adminjs";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";
import hasAdminPermission from "../permissions/has-admin.permission";
import { getManager } from "typeorm";

const TimeShotResource: ResourceWithOptions = {
    resource: TimeShotEntity,
    options: {
        actions: {
            getWorkingTimeShot: {
                handler: async (request, response, context) => {
                    const timeShotEntity: TimeShotEntity = await TimeShotEntity.findOne({
                        select: ["id", "start"],
                        where: {
                            user: context.currentAdmin.id,
                            stop: null
                        }
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
                    const { millisecond: raw_millisecond }: { millisecond: number | null } = await getManager().transaction(async (transactionalEntityManager) => {
                        return await transactionalEntityManager
                            .createQueryBuilder()
                            .select("SUM(TIMESTAMPDIFF(MICROSECOND, IF(DATE(start) = DATE(NOW()), start, DATE(NOW())), stop)) / 1000 as millisecond")
                            .from(TimeShotEntity, "time_shots")
                            .where({
                                user: context.currentAdmin.id
                            }).andWhere(
                                "DATE(stop) = DATE(NOW())", {}
                            )
                            .getRawOne();
                    });
                    const millisecond: number = raw_millisecond ?? 0;
                    return {
                        totalMillisecond: millisecond
                    };
                }
            },
            startTracker: {
                handler: async (request, response, context) => {
                    await getManager().transaction(async (transactionalEntityManager) => {
                        const timeShotEntity: TimeShotEntity = await TimeShotEntity.findOne({
                            select: ["id"],
                            where: {
                                user: context.currentAdmin.id,
                                stop: null
                            }
                        });
                        if (!timeShotEntity) {
                            await transactionalEntityManager
                                .createQueryBuilder()
                                .insert()
                                .into(TimeShotEntity)
                                .values({
                                    user: () => `"${context.currentAdmin.id}"`,
                                    locationStart: () => "1191619f-f8e8-466a-8a29-111a6e0e285f"
                                })
                                .execute();
                        }
                    });
                    return {};
                }
            },
            stopTracker: {
                handler: async (request, response, context) => {
                    await getManager().transaction(async (transactionalEntityManager) => {
                        const timeShotEntity: TimeShotEntity = await TimeShotEntity.findOne({
                            select: ["id"],
                            where: {
                                user: context.currentAdmin.id,
                                stop: null
                            }
                        });
                        if (timeShotEntity) {
                            await transactionalEntityManager
                                .createQueryBuilder()
                                .update(TimeShotEntity)
                                .set({
                                    stop: () => "NOW(6)"
                                })
                                .where({
                                    id: timeShotEntity.id
                                })
                                .execute();
                        }
                    });
                    return {};
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