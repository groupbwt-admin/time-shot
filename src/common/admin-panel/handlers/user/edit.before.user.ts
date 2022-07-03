import * as bcrypt from 'bcrypt';
import UserCreateValidator from '../../validations/user/user-create.validation';
import UserUpdateValidator from '../../validations/user/user-update.validation';
import canModifyUser from '../../permissions/user.permission';


const editBeforeUser = async (request, context) => {
  const isAccessible = canModifyUser(context);
  request.payload.email = null;
  if (request.payload.password) {
      UserCreateValidator.validatePassword(request.payload.password, request.payload.duplicatePassword);
      request.payload = {
          ...request.payload,
          hashedPassword: await bcrypt.hash(
              request.payload.password, process.env.SECRET_KEY
          )
      }
  }
  if (request.payload.role) {
      UserUpdateValidator.validateRole(context.currentAdmin.role, request.payload.id, context.currentAdmin.id);
  }
  if (request.payload.deletedAt) {
      request.payload.deletedAt = isAccessible ? new Date() : null;
  }
  return request;
};

export default editBeforeUser;
