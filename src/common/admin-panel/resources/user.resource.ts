import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import canModifyUser from '../permissions/user.permission';
import { usersPerPageLimit } from '../../constants/adminjs-constants';
import AdminBro from 'admin-bro';
import { Role } from '../../enums/role.enum';
import UserCreateValidator from '../validations/user/user-create.validation'
import UserUpdateValidator from '../validations/user/user-update.validation'

const UserResource: ResourceWithOptions = {
    resource: UserEntity,
    options: {
        navigation: {
            name: 'Time tracking'
        },
        properties: {
            id: {
                type: 'string',
                isVisible: {
                    list: false, edit: false, filter: false, show: false
                }
            },
            email: {
                type: 'string',
                isVisible: {
                    list: true, edit: true, filter: true, show: true
                },
                isTitle: true,
                isDisabled: true
            },
            hashedPassword: {
                type: 'password',
                isVisible: {
                    list: false, edit: false, filter: false, show: false
                }
            },
            password: {
                type: 'password',
                isVisible: {
                    list: false, edit: true, filter: false, show: false
                },
                position: 10
            },
            duplicatePassword: {
                type: 'password',
                isVisible: {
                    list: false, edit: true, filter: false, show: false
                },
                position: 11
            },
            role: {
                isVisible: {
                    list: true, edit: true, filter: true, show: false
                },
                custom: {
                    user: Role.USER,
                    admin: Role.ADMIN,
                    superadmin: Role.SUPERADMIN
                },
                position: 12
            },
            deletedAt: {
                type: 'date',
                isVisible: {
                    list: false, edit: true, filter: true, show: true
                },
                position: 13
            },
        },
        actions: {
            edit: {
                before: async (request, context) => {
                    const isAccessible = canModifyUser(context);
                    request.payload.email = null;
                    if (request.payload.password) {
                        UserCreateValidator.validatePassword(request.payload.password, request.payload.duplicatePassword);
                        request.payload = {
                            ...request.payload,
                            hashedPassword: await bcrypt.hash(
                                request.payload.password, process.env.SECRET_KEY
                            )
                        }
                    }
                    if (request.payload.role) {
                        UserUpdateValidator.validateRole(context.currentAdmin.role, request.payload.id, context.currentAdmin.id);
                    }
                    if (request.payload.deletedAt) {
                        request.payload.deletedAt = isAccessible ? new Date() : null;
                    }
                    return request;
                },
                // component: AdminBro.bundle('../../components/user-edit')
            }, 
            list: {
                before: async (request, context) => {
                    if (!canModifyUser(context)) {
                        request.query.filters = {};
                        request.query.filters.id = context.currentAdmin.id;
                    }
                    request.query.perPage = usersPerPageLimit;
                    return request;
                }
            },
            new: {
                isAccessible: canModifyUser,
                before: async (request, context) => {
                    request.payload.deletedAt = null;
                    UserCreateValidator.validateEmail(request.payload.email);
                    UserCreateValidator.validatePassword(request.payload.password, request.payload.duplicatePassword);
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
