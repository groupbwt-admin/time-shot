import * as bcrypt from 'bcrypt';
import UserCreateValidator from '../../validations/user/user-create.validation';
import { Role } from '../../../enums/role.enum';


const newBeforeUser = async (request, context) => {
    request.payload.deletedAt = null;
    UserCreateValidator.validateEmail(request.payload.email);
    UserCreateValidator.validatePassword(request.payload.password, request.payload.duplicatePassword);
    if (!request.payload.role) {
        request.payload.role = Role.USER;
    }
    request.payload = {
        ...request.payload,
        hashedPassword: await bcrypt.hash(
            request.payload.password, process.env.SECRET_KEY
        ),
    }
    return request;
};

export default newBeforeUser;
