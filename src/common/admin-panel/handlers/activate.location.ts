import { LocationEntity } from "../../../database/entities/location.entity";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constants/jwt-constants";

const jwtService = new JwtService();

const activateLocation = async (request, response, context) => {
  const location = context.record;
  const useLocation = await LocationEntity.findOne(location.params.id);
  const { logoutPath } = context._admin.options;

  useLocation.isActive = true;
  await LocationEntity.save(useLocation)
  location.param = useLocation;

  const payload = {
    locationId: useLocation.id,
    activatorId: context.currentAdmin.id,
  };

  const accessToken = jwtService.sign(
    payload,
    {
      secret: jwtConstants.secret,
      expiresIn: `${process.env.EXPIRES_IN}h`
    },
  );

  response.cookie(
    'accessToken',
    accessToken,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000000,
    }
  )
  return {
    record: {
      accessToken,
      logoutPath,
      ...location.toJSON(context.currentAdmin),
    }
  }
};

export default activateLocation;
