import { Role } from "../../enums/role.enum";

const canActivateLocation = (props) => {
  const { currentAdmin } = props;
  return (
    currentAdmin &&
    !currentAdmin.location && (
      currentAdmin.role === Role.ADMIN ||
      currentAdmin.role === Role.SUPERADMIN
    )
  )
};

export default canActivateLocation;
