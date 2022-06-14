import * as bcrypt from 'bcrypt';

export default async function getHashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, process.env.SECRET_KEY);
    return hashedPassword;
}