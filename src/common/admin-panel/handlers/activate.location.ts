import { LocationEntity } from "../../../database/entities/location.entity";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constants/jwt-constants";

const jwtService = new JwtService();

const activateLocation = async (request, response, context) => {
  const location = context.record;
  const useLocation = await LocationEntity.findOne(location.params.id);

  useLocation.isActive = true;
  await LocationEntity.save(useLocation)
  location.param = useLocation;

  const payload = {
    username: location.id,
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
      maxAge: 1000000
    }
  )
  return {
    record: {
      accessToken,
      ...location.toJSON(context.currentAdmin),
    }
  }
};

export default activateLocation;
