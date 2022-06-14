import * as bcrypt from 'bcrypt';
import { UserEntity } from "src/database/entities/user.entity";
import * as AdminBroExpress from 'admin-bro-expressjs';

const buildAdminRouter = (admin: Object) => {
    const router = AdminBroExpress.buildAuthenticatedRouter(admin, {
        cookieName: process.env.COOKIE_NAME,
        cookiePassword: process.env.COOKIE_PASSWORD,
        authenticate: async (email: string, password: string) => {
            const user = await UserEntity.findOne({ email });
            if (!user) {
                return null;
            }

            const hashedPassword = await bcrypt.hash(password, process.env.SECRET_KEY)
            if (hashedPassword === user.hashedPassword) {
                return user;
            }

            return null;
        },
    }, null, {
        resave: false,
        saveUninitialized: true,
    });
    return router;
};

export default buildAdminRouter;