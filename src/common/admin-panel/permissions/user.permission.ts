const canModifyUser = (currentAdmin) => {
    return (
        currentAdmin.currentAdmin &&
        currentAdmin.currentAdmin.role === 'admin' ||
        currentAdmin.currentAdmin.role === 'superadmin'
    )
};

export default canModifyUser;
