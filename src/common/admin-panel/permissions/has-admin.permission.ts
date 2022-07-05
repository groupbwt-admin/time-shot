import { Role } from "../../enums/role.enum";

const hasAdminPermission = (props) => {
    return (
        props.currentAdmin && (
            props.currentAdmin.role === Role.ADMIN ||
            props.currentAdmin.role === Role.SUPERADMIN
        )
    );
};

export default hasAdminPermission;
