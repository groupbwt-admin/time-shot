import { Database, Resource } from "@adminjs/typeorm";
import { INestApplication } from "@nestjs/common";
import buildAdminRouter from "./admin.router";
import LocationResource from "./resources/location.resource";
import UserResource from "./resources/user.resource";
import AdminJS, { Router } from "adminjs";

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    AdminJS.registerAdapter({ Database, Resource });

    const adminBro = new AdminJS({
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
