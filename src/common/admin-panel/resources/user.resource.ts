import { ResourceWithOptions } from "admin-bro";
import { UserEntity } from "src/database/entities/user.entity";
import * as bcrypt from 'bcrypt';
import canModifyUser from "../permissions/user.permission";


const UserResource: ResourceWithOptions = {
    resource: UserEntity,
    options: {
        navigation: {
            icon: "User",
            name: null,
        },
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
                isAccessible: canModifyUser,
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
                isAccessible: canModifyUser,
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
                isAccessible: canModifyUser,
            }
        }
    },
};

export default UserResource;