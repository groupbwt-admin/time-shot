import { ActionRequest, ResourceWithOptions, ValidationError } from "adminjs";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";
import hasAdminPermission from "../permissions/has-admin.permission";
import { getManager } from "typeorm";
import parseCookiesFromActionRequest from "../../utils/parse-cookies-from-action-request";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constants/jwt-constants";
import axios from 'axios';

const TimeShotResource: ResourceWithOptions = {
    resource: TimeShotEntity,
    options: {
        navigation: {
            icon: "Alarm",
            name: null
        },
        properties: {
            user: {
                type: "reference",
                reference: "UserEntity",
                isVisible: {
                    list: true, edit: true, filter: true, show: true
                },
                isDisabled: true
            }, 
            "user.id": {
                isVisible: false
            },
            "locationStart.id": {
                isVisible: {
                    list: false, edit: true, filter: true, show: true
                }
            },
            "locationEnd.id": {
                isVisible: {
                    list: false, edit: true, filter: true, show: true
                }
            }
        },
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
                isVisible: false,
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
                isVisible: false,
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
                isVisible: false,
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
                            await transactionalEntityManager.query(`
                                UPDATE \`time_shots\`
                                SET \`locationEndId\` = ?,\`stop\`= NOW()
                                WHERE \`id\` = ?
                            `, [jwtContent.locationId, timeShotEntity.id]);
                        }
                    });
                    return {};
                }
            },
            edit: {
                isAccessible: hasAdminPermission,
                before: async (request, context) => {
                    if (request.method === 'post') {
                        // @ts-ignore
                        const fieldsChange: {id: string, user: string, start: string, stop: string} = request.fields;
                        if (fieldsChange.start.slice(0, 10) !== fieldsChange.stop.slice(0, 10)) {
                            throw new ValidationError({
                                name: {
                                  message: 'Time shot must start and stop within one day.'
                                }
                              });
                        }
                        const record = await TimeShotEntity.findOne({id: fieldsChange.id});
                        if (
                            // @ts-ignore
                            record.user !== fieldsChange.user || 
                            record.start.toISOString() !== fieldsChange.start ||
                            record.stop.toISOString() !== fieldsChange.stop
                        ) {
                            // @ts-ignore
                            request.meta = [{
                                workDate: fieldsChange.start.slice(0, 10),
                                userId: fieldsChange.user
                            }];
                            if (fieldsChange.start.slice(0, 10) !== record.start.toISOString().slice(0, 10)) {
                                // @ts-ignore
                                request.meta.push({
                                    workDate: record.start.toISOString().slice(0, 10),
                                    userId: fieldsChange.user
                                })
                            }
                        }
                    }
                    
                    return request;
                },
                after: async (originalResponse, request, context) => {
                    if (request.method === 'post' && !!request.meta) {
                        const cookies: { accessToken: string } = parseCookiesFromActionRequest(request);
                        const authorization = `${process.env.DEFAULT_STRATEGY} ${cookies.accessToken}`;
                        for (let dateMeta of request.meta){
                            const body = JSON.stringify({ 
                                date: dateMeta.workDate, 
                                userId: dateMeta.userId 
                            });
                            try {
                                await axios.post(
                                    `http://127.0.0.1:${process.env.PORT}/api/statistic`,
                                    body,
                                    {
                                        headers: {
                                            "Authorization": authorization,
                                            'Content-Type': 'application/json'
                                        }
                                    }
                                )
                            } catch(e) {
                                console.error(e)
                            }
                        }
                    }

                    return originalResponse;
                }
            },
            delete: {
                isAccessible: hasAdminPermission
            },
            new: {
                isAccessible: hasAdminPermission
            },
            show: {
                isAccessible: hasAdminPermission
            },
            list: {
                isAccessible: hasAdminPermission
            },
            bulkDelete: {
                isAccessible: hasAdminPermission
            },
            search: {
                isAccessible: hasAdminPermission
            }
        }
    }
};

export default TimeShotResource;
