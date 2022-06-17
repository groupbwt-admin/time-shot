import { Role } from '../../enums/role.enum';

const canModifyUser = (currentAdmin) => {
    return (
        currentAdmin && 
        currentAdmin.currentAdmin.role === Role.ADMIN ||
        currentAdmin.currentAdmin.role === Role.SUPERADMIN
    )
};

export default canModifyUser;
