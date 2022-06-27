import { ActionRequest, ResourceWithOptions } from "adminjs";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";
import hasAdminPermission from "../permissions/has-admin.permission";
import { getManager } from "typeorm";
import parseCookiesFromActionRequest from "../../utils/parse-cookies-from-action-request";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constants/jwt-constants";

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
                handler: async (request: ActionRequest, response, context) => {
                    const cookies: { accessToken: string } = parseCookiesFromActionRequest(request);
                    const jwtService = new JwtService({ secret: jwtConstants.secret });
                    const jwtContent: { locationId: string } = jwtService.verify(cookies.accessToken);

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
                                    locationStart: () => `"${jwtContent.locationId}"` // TODO:
                                })
                                .execute();
                        }
                    });
                    return {};
                }
            },
            stopTracker: {
                handler: async (request, response, context) => {
                    const cookies: { accessToken: string } = parseCookiesFromActionRequest(request);
                    const jwtService = new JwtService({ secret: jwtConstants.secret });
                    const jwtContent: { locationId: string } = jwtService.verify(cookies.accessToken);

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
                                    stop: () => "NOW()",
                                    locationEnd: () => `"${jwtContent.locationId}"` // TODO:
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