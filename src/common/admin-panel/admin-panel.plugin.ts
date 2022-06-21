import { Database, Resource } from "@adminjs/typeorm";
import { INestApplication } from "@nestjs/common";
import buildAdminRouter from "./admin.router";
import UserResource from "./resources/user.resource";
import LocationResource from "./resources/location.resource";
import TimeShotResource from "./resources/time-shot.resource";
import AdminJS from "adminjs";

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    AdminJS.registerAdapter({ Database, Resource });

    const adminJS = new AdminJS({
        resources: [
            UserResource,
            LocationResource,
            TimeShotResource
        ],
        rootPath: '/admin',
        branding: {
            companyName: 'GroupBWT'
        },
        pages: {
            'tracker': {
                component: AdminJS.bundle('components/some-stats'),
                icon: 'Purchase',
                handler: async (request, response, context) => {
                    return {
                        text: 'I am fetched from the backend'
                    };
                }
            }
        }
    });

    const router = buildAdminRouter(adminJS);
    app.use(adminJS.options.rootPath, router);
}