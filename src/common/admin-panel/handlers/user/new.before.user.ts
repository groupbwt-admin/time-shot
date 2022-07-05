import UserCreateValidator from '../../validations/user/user-create.validation';
import { Role } from 'common/enums/role.enum';
import getHashPassword from 'common/utils/get-hashed-password';


const newBeforeUser = async (request, context) => {
    request.payload.deletedAt = null;
    UserCreateValidator.validateEmail(request.payload.email);
    UserCreateValidator.validatePassword(request.payload.password, request.payload.duplicatePassword);
    if (!request.payload.role) {
        request.payload.role = Role.USER;
    }
    request.payload = {
        ...request.payload,
        hashedPassword: await getHashPassword(request.payload.password)
    }
    return request;
};

export default newBeforeUser;
