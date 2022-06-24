import AdminJS from 'adminjs';
import { Router } from 'express';
import {
  AuthenticationMaxRetriesOptions,
  AuthenticationOptions,
} from '@adminjs/express/lib/types';
import getCookie from '../../utils/get-cookie';
import parseJwt from '../../utils/parse-jwt';
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from '../../constants/jwt-constants';

const jwtService = new JwtService();

const changeAccessToken = (response, accessToken, adminUser) => {
  const decodeAccessToken = parseJwt(accessToken);
  const payload = {
    locationId: decodeAccessToken.locationId,
    activatorId: decodeAccessToken.activatorId,
    userId: adminUser.id,
  };
  const newAccessToken = jwtService.sign(
    payload,
    {
      secret: jwtConstants.secret,
      expiresIn: `${process.env.EXPIRES_IN}h`
    },
  );

  response.cookie(
    'accessToken',
    newAccessToken,
    {
      httpOnly: true,
      secure: true,
      sameSime: 'strict',
      maxAge: Number(process.env.EXPIRES_IN) * 60 * 60 * 1000,
    }
  );
  return response;
}

const getLoginPath = (admin: AdminJS): string => {
  const { loginPath, rootPath } = admin.options;
  // since we are inside already namespaced router we have to replace login and logout routes that
  // they don't have rootUrl inside. So changing /admin/login to just /login.
  // but there is a case where user gives / as a root url and /login becomes `login`. We have to
  // fix it by adding / in front of the route
  const normalizedLoginPath = loginPath.replace(rootPath, '');

  return normalizedLoginPath.startsWith('/')
    ? normalizedLoginPath
    : `/${normalizedLoginPath}`;
};

class Retry {
  private static retriesContainer: Map<string, Retry> = new Map();
  private lastRetry: Date | undefined;
  private retriesCount = 0;

  constructor(ip: string) {
    const existing = Retry.retriesContainer.get(ip);
    if (existing) {
      return existing;
    }
    Retry.retriesContainer.set(ip, this);
  }

  public canLogin(
    maxRetries: number | AuthenticationMaxRetriesOptions | undefined
  ): boolean {
    if (maxRetries === undefined) {
      return true;
    } else if (typeof maxRetries === 'number') {
      maxRetries = {
        count: maxRetries,
        duration: 60,
      };
    } else if (maxRetries.count <= 0) {
      return true;
    }
    if (
      !this.lastRetry ||
      new Date().getTime() - this.lastRetry.getTime() >
      maxRetries.duration * 1000
    ) {
      this.lastRetry = new Date();
      this.retriesCount = 1;
      return true;
    } else {
      this.lastRetry = new Date();
      this.retriesCount++;
      return this.retriesCount <= maxRetries.count;
    }
  }
}

export const withLogin = (
  router: Router,
  admin: AdminJS,
  auth: AuthenticationOptions
): void => {
  const { rootPath } = admin.options;
  const loginPath = getLoginPath(admin);

  router.get(loginPath, async (req, res) => {
    const login = await admin.renderLogin({
      action: admin.options.loginPath,
      errorMessage: null,
    });
    res.send(login);
  });

  router.post(loginPath, async (req, res, next) => {
    if (!new Retry(req.ip).canLogin(auth.maxRetries)) {
      const login = await admin.renderLogin({
        action: admin.options.loginPath,
        errorMessage: 'tooManyRequests',
      });
      res.send(login);
      return;
    }
    const accessToken = getCookie(req)['accessToken'];
    const { email, password } = (<any>req).fields as {
      email: string;
      password: string;
    };
    const adminUser: any = await auth.authenticate(email, password);
    const loginInvalidCredentials = await admin.renderLogin({
      action: admin.options.loginPath,
      errorMessage: 'invalidCredentials',
    });
    const loginWhenLocationNotActivate = await admin.renderLogin({
      action: admin.options.loginPath,
      errorMessage: 'Location does not activated',
    });
    if (adminUser) {
      (<any>req).session.adminUser = adminUser;
      (<any>req).session.save((err) => {
        if (err) {
          next(err);
        }
        if ((<any>req).session.redirectTo) {
          if (accessToken) {
            res = changeAccessToken(res, accessToken, adminUser);
            res.redirect(302, (<any>req).session.redirectTo);
          } else {
            adminUser.role === 'user'
              ? res.send(loginWhenLocationNotActivate)
              : res.redirect(302, (<any>req).session.redirectTo);
          }
        } else {
          if (accessToken) {
            res = changeAccessToken(res, accessToken, adminUser);
            res.redirect(302, rootPath);
          } else {
            adminUser.role === 'user'
              ? res.send(loginWhenLocationNotActivate)
              : res.redirect(302, rootPath);
          }
        }
      });
    } else {
      res.send(loginInvalidCredentials);
    }
  });
};
