import { ResourceWithOptions } from "adminjs";
import * as bcrypt from 'bcrypt';
import canGrantPermission from "../permissions/user.permission";
import hasAdminPermission from "../permissions/has-admin.permission";
import { UserEntity } from "database/entities/user.entity";

const UserResource: ResourceWithOptions = {
    resource: UserEntity,
    options: {
        properties: {
            hashedPassword: {
                isVisible: false,
            },
            password: {
                type: 'string',
                isVisible: {
                    list: false, edit: true, filter: false, show: false,
                },
            },
        },
        actions: {
            edit: {
                isAccessible: canGrantPermission,
                before: async (request) => {
                    if (request.payload.password) {
                        request.payload = {
                            ...request.payload,
                            hashedPassword: await bcrypt.hash(
                                request.payload.password, process.env.SECRET_KEY
                            ),
                        }
                    }
                    return request
                },
            },
            new: {
                isAccessible: canGrantPermission,
                before: async (request) => {
                    if (request.payload.password) {
                        request.payload = {
                            ...request.payload,
                            hashedPassword: await bcrypt.hash(
                                request.payload.password, process.env.SECRET_KEY
                            ),
                        }
                    }
                    return request
                },
            },
            delete: {
                isAccessible: canGrantPermission,
            },
            show: { isAccessible: hasAdminPermission },
            list: { isAccessible: hasAdminPermission },
            bulkDelete: { isAccessible: hasAdminPermission },
            search: { isAccessible: hasAdminPermission }
        }
    },
};

export default UserResource;