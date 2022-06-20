import { Role } from "../../enums/role.enum";

const canModifyLocation = (props) => {
  return (
    props.currentAdmin &&
    props.currentAdmin.role === Role.SUPERADMIN
  )
};

export default canModifyLocation;
