import { Database, Resource } from "@admin-bro/typeorm";
import { INestApplication } from "@nestjs/common";
import AdminBro from "admin-bro";
import buildAdminRouter from "./admin.router";
import LocationResource from "./resources/location.resource";
import UserResource from "./resources/user.resource";

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    AdminBro.registerAdapter({ Database, Resource });

    const adminBro = new AdminBro({
        resources: [
            UserResource,
            LocationResource,
        ],
        rootPath: '/admin',
        branding: {
            companyName: 'GroupBWT',
        }
    });

    const router = buildAdminRouter(adminBro);
    app.use(adminBro.options.rootPath, router);
}