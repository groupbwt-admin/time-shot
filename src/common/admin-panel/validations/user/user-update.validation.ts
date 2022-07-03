import { ValidationError } from 'adminjs';
import { Role } from '../../../enums/role.enum';

export default class UserUpdateValidator {
    public static validateRole(
        currentAdminRole: string, 
        payloadId: string | number, 
        currentAdminId: string | number
        ): any {
        if (currentAdminRole !== Role.SUPERADMIN) {
            const message = `${currentAdminRole.toUpperCase()} can't set roles at all.`;
            throw new ValidationError({name: {message: message}}, {message: message});
        }
        if (payloadId === currentAdminId) {
            const message = `You can't change yourself role. 
            Please, contact another ${Role.SUPERADMIN}.`;
            throw new ValidationError({name: {message: message}}, {message: message});
        }
    }
}
