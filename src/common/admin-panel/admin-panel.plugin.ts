import { Database, Resource } from '@admin-bro/typeorm';
import { INestApplication } from '@nestjs/common';
import AdminBro from 'admin-bro';
import buildAdminRouter from './admin.router';
import UserResource from './resources/user.resource';

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    AdminBro.registerAdapter({ Database, Resource });

    const adminBro = new AdminBro({
        resources: [
            UserResource,
        ],
        rootPath: '/admin',
        branding: {
            companyName: 'GroupBWT',
        }
    });

    app.use(adminBro.options.rootPath, buildAdminRouter(adminBro));

}