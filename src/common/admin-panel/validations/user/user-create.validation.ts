import { ValidationError } from 'admin-bro';
import * as EmailValidator from 'email-validator';
import * as PasswordValidator from 'password-validator';
import { passwordValidationParameters } from '../../../constants/adminjs-constants';

export default class UserCreateValidator {

    public static validateEmail(email: string): any {
        if (!email) {
            const message = 'Email is required.';
            throw new ValidationError({name: {message: message}}, {message: message});
        }

        const sValidEmail = EmailValidator.validate(email);
        if (!sValidEmail) {
            const message = `Please, insert correct email.`
            throw new ValidationError({name: {message: message}}, {message: message});
        }
    }

    public static validatePassword(password: string, passwordDuplicate: string): any {
        if (!password || !passwordDuplicate) {
            const message = 'Password and duplicate are required.';
            throw new ValidationError({name: {message: message}}, {message: message});
        } 
        if (password !== passwordDuplicate) {
            const message = 'Password and duplicate password must be the same.';
            throw new ValidationError({name: {message: message}}, {message: message});
        }

        const passwordValidator = new PasswordValidator();
        passwordValidator.min(passwordValidationParameters.minimum).max(passwordValidationParameters.maximum);

        if (passwordValidationParameters.lowercase) {
            passwordValidator.uppercase(passwordValidationParameters.lowercase)
        }
        if (passwordValidationParameters.uppercase) {
            passwordValidator.uppercase(passwordValidationParameters.uppercase)
        }
        if (passwordValidationParameters.digits) {
            passwordValidator.digits(passwordValidationParameters.digits)     
        }
        if (passwordValidationParameters.hasSpase) {
            passwordValidator.spaces(1)     
        }
        const isValidPassword = passwordValidator.validate(password, { details: true });
        if (!isValidPassword) {
            const message = 'Password does not meet the requirements: \n' + 
                            `- at least ${passwordValidationParameters.digits} digits. \n` +
                            `- at least ${passwordValidationParameters.minimum} characters. \n` +
                            `- less ${passwordValidationParameters.maximum} characters. \n` +
                            `- at least ${passwordValidationParameters.lowercase} lowercase character. \n` +
                            `- at least ${passwordValidationParameters.uppercase} uppercase character. \n` +
                            `- use spases: ${passwordValidationParameters.hasSpase}.`;
            throw new ValidationError({name: {message: message}}, {message: message});
        }
    }
    
}
