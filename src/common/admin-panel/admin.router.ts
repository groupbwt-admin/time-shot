import * as bcrypt from 'bcrypt';
import { UserEntity } from "src/database/entities/user.entity";
import { buildAuthenticatedRouter } from 'admin-bro-expressjs';
import AdminBro from "admin-bro";

const buildAdminRouter = (admin: AdminBro) => {
    const router = buildAuthenticatedRouter(admin, {
        cookieName: process.env.COOKIE_NAME,
        cookiePassword: process.env.COOKIE_PASSWORD,
        authenticate: async (email: string, password: string) => {
            const user = await UserEntity.findOne({ email });
            if (!user) {
                return null;
            }

            if (await bcrypt.compare(password, user.hashedPassword)) {
                return user;
            }

            return null;
        }
    }, null, {
        resave: false,
        saveUninitialized: true
    });
    return router;
};

export default buildAdminRouter;