import { Role } from "../../enums/role.enum";

const canActivateLocation = (props) => {
  return (
    props.currentAdmin &&
    !props.record.params.isActive && (
      props.currentAdmin.role === Role.ADMIN ||
      props.currentAdmin.role === Role.SUPERADMIN
    )
  )
};

export default canActivateLocation;
