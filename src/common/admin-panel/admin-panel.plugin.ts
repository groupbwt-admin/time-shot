import AdminJS from "adminjs";
import { Database, Resource } from "@adminjs/typeorm";
import { INestApplication } from "@nestjs/common";
import buildAdminRouter from "./admin.router";
import UserResource from "./resources/user.resource";
import LocationResource from "./resources/location.resource";
import TimeShotResource from "./resources/time-shot.resource";
import UsersStatisticResource from "./resources/user-statistic.resource"

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    AdminJS.registerAdapter({ Database, Resource });

    const adminJS = new AdminJS({
        resources: [
            UserResource,
            LocationResource,
            TimeShotResource,
            UsersStatisticResource
        ],
        rootPath: '/admin',
        branding: {
            companyName: 'GroupBWT'
        },
        dashboard: {
            component: AdminJS.bundle('components/time-tracker'),
        },
        locale: {
            language: 'en',
            translations: {
                labels: {
                    LocationEntity: 'Location',
                    UserEntity: 'User',
                    TimeShotEntity: 'TimeShot',
                },
            },
        },
    });
    AdminJS.bundle('components/logged-in', 'LoggedIn');
    const router = buildAdminRouter(adminJS);
    app.use(adminJS.options.rootPath, router);
}
