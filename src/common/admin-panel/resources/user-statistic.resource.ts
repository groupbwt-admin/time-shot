import AdminJS, { ResourceWithOptions } from "adminjs";
import { UsersStatisticsEntity } from "../../../database/entities/user-statistic.entity";
import showUsersStats from "../handlers/show-users-stats.handler";
import hasAdminPermission from "../permissions/has-admin.permission";

const UsersStatisticResource: ResourceWithOptions = {
    resource: UsersStatisticsEntity,
    options: {
        navigation: {
            icon: "Diagram",
            name: null
        },
        properties: {
            id: {
                type: "number",
                isVisible: false,
                isDisabled: true
            }, 
            user: {
                type: "reference",
                reference: "UserEntity",
                isVisible: {
                    list: true, edit: true, filter: true, show: true
                },
                isDisabled: true
            }, 
            'user.id': {
                isVisible: false
            },
            workTime: {
                type: "string",
                isVisible: true
            }, 
            workDate: {
                type: "date",
                isVisible: {
                    list: true, edit: false, filter: true, show: true
                },
                isDisabled: false
            }, 
            createdAt: {
                type: "datetime",
                isVisible: false
            }, 
            updatedAt: {
                type: "datetime",
                isVisible: false
            }
        },
        actions: {
            show: {
                after: async (originalResponse, request, context) => {
                    const responseDate = new Date(Date.UTC(0, 0, 0, 0, 0, originalResponse.record.params.workTime));
                    originalResponse.record.params.workTime = responseDate.toUTCString().substring(17, 25);

                    return originalResponse;
                }
            },
            edit: {
                isAccessible: hasAdminPermission,
                before: async (request, context) => {
                    if (request.method === 'post') {
                        const [ hours, minutes, seconds ] = request.payload.workTime.split(':');
                        request.payload.workTime = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
                    }

                    return request;
                },
                after: async (originalResponse, request, context) => {
                    if (request.method === 'get') {
                        const responseDate = new Date(Date.UTC(0, 0, 0, 0, 0, originalResponse.record.params.workTime));
                        originalResponse.record.params.workTime = responseDate.toUTCString().substring(17, 25);
                    }
                    
                    return originalResponse;
                }
            },
            list: {
                before: async (request, context) => {
                    if (!hasAdminPermission(context)) {
                        request.query.filters = {user: {id: context.currentAdmin.id}};
                    }

                    return request;
                },
                after: async (originalResponse, request, context) => {
                    originalResponse.records.map((record, index) => {
                        const recordDate = new Date(Date.UTC(0, 0, 0, 0, 0, record.params.workTime));
                        originalResponse.records[index].params.workTime = recordDate.toUTCString().substring(17, 25);
                    })

                    return originalResponse;
                }
            }, 
            new: {
                isAccessible: false,
            },
            delete: {
                isAccessible: false
            },
            bulkDelete: {
                isAccessible: false
            },
            userStats: {
                isAccessible: true, 
                actionType: 'record',
                icon: 'View',
                isVisible: true,
                handler: showUsersStats,
                after: async (originalResponse, request, context) => {
                    if (request.method === 'get') {
                        originalResponse.record.results.map((record, index)=> {
                            const recordDate = new Date(Date.UTC(0, 0, 0, 0, 0, record.workTime));
                            originalResponse.record.results[index].workTime = recordDate.toUTCString().substring(17, 25);
                        })
                        const totalWorkTime = new Date(Date.UTC(0, 0, 0, 0, 0, originalResponse.record.totalWorkTime));
                        originalResponse.record.totalWorkTime = totalWorkTime.toUTCString().substring(17, 25);
                    }
                    
                    return originalResponse;
                },
                component: AdminJS.bundle("../components/show-statistic")
            }
        }
    },
};

export default UsersStatisticResource;
