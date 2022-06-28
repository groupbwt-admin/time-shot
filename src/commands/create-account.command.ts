import { Command, CommandRunner } from "nest-commander";
import { Role } from "../common/enums/role.enum";
import { UserService } from "../services/user.service";


@Command({
    name: 'create-account',
    arguments: "<email> <password> <role>",
    options: { isDefault: false }
})
export class CreateAccountCommand implements CommandRunner {
    constructor(
        private userService: UserService
    ) {
    }

    async run(inputs: string[], options: Record<string, any>): Promise<void> {
        const [email, password, rawRole] = inputs;
        const role = Role[rawRole.toUpperCase()];

        if (!role) {
            throw new Error('invalid role');
        }

        await this.userService.create({ email, password, role });
    }
}