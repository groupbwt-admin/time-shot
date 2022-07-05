import { Role } from "../../enums/role.enum";

const canGrantPermission = (currentAdmin) => {
    return (
        currentAdmin.currentAdmin &&
        currentAdmin.currentAdmin.role === Role.ADMIN ||
        currentAdmin.currentAdmin.role === Role.SUPERADMIN
    )
};

export default canGrantPermission;
