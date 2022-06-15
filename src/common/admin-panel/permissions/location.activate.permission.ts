const canActivateLocation = (props) => {
  return (
    props.currentAdmin &&
    !props.record.params.isActive &&
    props.currentAdmin.role === 'admin' ||
    props.currentAdmin.role === 'superadmin'
  )
};

export default canActivateLocation;
