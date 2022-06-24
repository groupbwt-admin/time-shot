import AdminJS from 'adminjs';
import { Router } from 'express';
import * as express from 'express';
import * as formidableMiddleware from 'express-formidable';
import * as session from 'express-session';
import { withLogin } from '../handlers/login.handler';
import { withLogout } from '../handlers/logout.handler';
import { withProtectedRoutesHandler } from '@adminjs/express/lib/authentication/protected-routes.handler';
import { buildRouter } from '@adminjs//express/lib/buildRouter';
import { OldBodyParserUsedError } from '@adminjs/express/lib/errors';
import { AuthenticationOptions, FormidableOptions } from '@adminjs/express/lib/types';

export const buildAuthenticatedRouter = (
  admin: AdminJS,
  auth: AuthenticationOptions,
  predefinedRouter?: express.Router | null,
  sessionOptions?: session.SessionOptions,
  formidableOptions?: FormidableOptions
): Router => {
  const router = predefinedRouter || express.Router();

  router.use((req, _, next) => {
    if ((req as any)._body) {
      next(new OldBodyParserUsedError());
    }
    next();
  });

  router.use(
    session({
      ...sessionOptions,
      secret: auth.cookiePassword,
      name: auth.cookieName,
    })
  );
  router.use(formidableMiddleware(formidableOptions));

  withProtectedRoutesHandler(router, admin);
  withLogin(router, admin, auth);
  withLogout(router, admin);

  return buildRouter(admin, router, formidableOptions);
};