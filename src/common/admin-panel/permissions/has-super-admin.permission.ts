import { Role } from "../../enums/role.enum";

const hasSuperAdminPermission = (props) => {
    return (
        props.currentAdmin && (
            props.currentAdmin.role === Role.SUPERADMIN
        )
    );
};

export default hasSuperAdminPermission;
