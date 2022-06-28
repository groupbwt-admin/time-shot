import * as bcrypt from "bcrypt";
import { buildAuthenticatedRouter } from './routers/buildAuthenticatedRouter';
import { UserEntity } from "database/entities/user.entity";
import AdminJS from "adminjs";

const buildAdminRouter = (admin: AdminJS) => {
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
