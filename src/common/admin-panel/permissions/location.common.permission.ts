const canModifyLocation = (props) => {
  return (
    props.currentAdmin &&
    props.currentAdmin.role === 'superadmin'
  )
};

export default canModifyLocation;
