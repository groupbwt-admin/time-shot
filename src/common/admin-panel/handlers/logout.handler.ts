import AdminJS from 'adminjs';
import { Router } from 'express';
import getCookie from '../../utils/get-cookie';
import parseJwt from '../../utils/parse-jwt';
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from '../../constants/jwt-constants';

const jwtService = new JwtService();

const changeAccessToken = (response, accessToken) => {
  if (!accessToken) {
    return response
  };

  const decodeAccessToken = parseJwt(accessToken);
  const payload = {
    locationId: decodeAccessToken.locationId,
    activatorId: decodeAccessToken.activatorId,
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

const getLogoutPath = (admin: AdminJS) => {
  const { logoutPath, rootPath } = admin.options;
  const normalizedLogoutPath = logoutPath.replace(rootPath, '');

  return normalizedLogoutPath.startsWith('/')
    ? normalizedLogoutPath
    : `/${normalizedLogoutPath}`;
};

export const withLogout = (router: Router, admin: AdminJS): void => {
  const logoutPath = getLogoutPath(admin);

  router.get(logoutPath, async (request, response) => {
    const accessToken = getCookie(request)['accessToken'];
    response = changeAccessToken(response, accessToken);
    (<any>request).session.destroy(() => {
      response.redirect(admin.options.loginPath);
    });
  });
};
