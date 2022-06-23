import { ResourceWithOptions } from "adminjs"
import { UserEntity } from "src/database/entities/user.entity";
import * as bcrypt from 'bcrypt';
import canGrantPermission from "../permissions/user.permission";


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
            }
        }
    },
};

export default UserResource;
