import * as bcrypt from 'bcrypt';

export default async function getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(12));
}
