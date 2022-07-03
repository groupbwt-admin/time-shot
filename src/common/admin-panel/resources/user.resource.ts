import { ResourceWithOptions } from 'adminjs';
import { UserEntity } from '../../..//database/entities/user.entity';
import hasAdminPermission from "../permissions/has-admin.permission";
import { Role } from '../../enums/role.enum';
import editBeforeUser from '../handlers/user/edit.before.user';
import listUser from '../handlers/user/list.user';
import newBeforeUser from '../handlers/user/new.before.user';
import deleteUser from '../handlers/user/delete.user';


const UserResource: ResourceWithOptions = {
    resource: UserEntity,
    options: {
        navigation: {
            name: null,
            icon: 'User'
        },
        properties: {
            id: {
                isVisible: false
            },
            email: {
                type: 'string',
                isVisible: {
                    list: true, edit: true, filter: true, show: true
                },
                isTitle: true,
            },
            hashedPassword: {
                isVisible: false
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
                isVisible: false,
                position: 13
            },
        },
        actions: {
            edit: {
                isAccessible: hasAdminPermission,
                before: editBeforeUser
            }, 
            list: {
                handler: listUser
            },
            new: {
                isAccessible: hasAdminPermission,
                before: newBeforeUser
            },
            delete: {
                isAccessible: hasAdminPermission,
                handler: deleteUser
            },
            bulkDelete: { isAccessible: false }
        }
    },
};

export default UserResource;
