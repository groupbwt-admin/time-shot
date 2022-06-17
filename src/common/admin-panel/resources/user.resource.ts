import { ResourceWithOptions, ValidationError } from "admin-bro";
import { UserEntity } from "src/database/entities/user.entity";
import * as bcrypt from "bcrypt";
import canModifyUser from "../permissions/user.permission";
import  { perPageLimit } from "../../constants/adminjs-constants";
import AdminBro from "admin-bro";
import { Role } from "../../enums/role.enum"

const UserResource: ResourceWithOptions = {
    resource: UserEntity,
    options: {
        navigation: {
            name: "Time tracking"
        },
        properties: {
            id: {
                type: "string",
                isVisible: {
                    list: false, edit: false, filter: false, show: false
                }
            },
            email: {
                type: "string",
                isVisible: {
                    list: true, edit: true, filter: true, show: true
                },
                isTitle: true
            },
            hashedPassword: {
                type: "string",
                isVisible: {
                    list: false, edit: false, filter: false, show: false,
                }
            },
            password: {
                type: "password",
                isVisible: {
                    list: false, edit: true, filter: false, show: false,
                }
            },
            duplicatePassword: {
                type: "password",
                isVisible: {
                    list: false, edit: true, filter: false, show: false,
                }
            },
            role: {
                isVisible: {
                    list: true, edit: true, filter: true, show: false,
                },
                custom: {
                    user: Role.USER,
                    admin: Role.ADMIN,
                    superadmin: Role.SUPERADMIN
                }
            },
            deletedAt: {
                type: "date",
                isVisible: {
                    list: false, edit: true, filter: true, show: true,
                }
            },
        },
        actions: {
            edit: {
                before: async (request, context) => {
                    const isAccessible = canModifyUser(context);
                    request.payload.email = null;
                    if (request.payload.password) {
                        if (request.payload.password !== request.payload.duplicatePassword) {
                            const message = "Password and duplicate password must be the same.";
                            throw new ValidationError({name: {message: message}}, {message: message});
                        }
                        request.payload = {
                            ...request.payload,
                            hashedPassword: await bcrypt.hash(
                                request.payload.password, process.env.SECRET_KEY
                            )
                        }
                    }
                    if (request.payload.role && context.currentAdmin.role !== Role.SUPERADMIN) {
                        const message = `${context.currentAdmin.role.toUpperCase()} can't set roles at all.`;
                        throw new ValidationError({name: {message: message}}, {message: message});
                    } else if (request.payload.id === context.currentAdmin.id) {
                        const message = `You can't change yourself role. 
                        Please, contact another ${Role.SUPERADMIN}.`;
                        throw new ValidationError({name: {message: message}}, {message: message});
                    }
                    if (request.payload.deletedAt) {
                        request.payload.deletedAt = isAccessible ? new Date() : null;
                    }
                    return request;
                },
                component: AdminBro.bundle('../../components/user-edit')
            }, 
            list: {
                before: async (request, context) => {
                    if (!canModifyUser(context)) {
                        request.query.filters = {};
                        request.query.filters.id = context.currentAdmin.id;
                    }
                    request.query.perPage = perPageLimit;
                    return request;
                }
            },
            new: {
                isAccessible: canModifyUser,
                before: async (request, context) => {
                    request.payload.deletedAt = null;
                    if (!request.payload.email ) {
                        const message = "Email is required.";
                        throw new ValidationError({name: {message: message}}, {message: message});
                    }
                    if (!request.payload.password || !request.payload.duplicatePassword) {
                        const message = "Password and duplicate are required.";
                        throw new ValidationError({name: {message: message}}, {message: message});
                    } 
                    if (request.payload.password !== request.payload.duplicatePassword) {
                        const message = "Password and duplicate password must be the same.";
                        throw new ValidationError({name: {message: message}}, {message: message});
                    }
                    if (!request.payload.role) {
                        request.payload.role = Role.USER;
                    }
                    request.payload = {
                        ...request.payload,
                        hashedPassword: await bcrypt.hash(
                            request.payload.password, process.env.SECRET_KEY
                        ),
                    }
                    return request;
                },
            },
            delete: {
                isAccessible: false
            },
            bulkDelete: {
                isAccessible: false
            }
        }
    },
};

export default UserResource;
