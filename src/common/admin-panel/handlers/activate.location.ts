import { LocationEntity } from "../../../database/entities/location.entity";
import { JwtService } from "@nestjs/jwt";

const activateLocatin = async (request, response, context) => {
  const jwtService = new JwtService();
  const location = context.record;
  const useLocation = await LocationEntity.findOne(location.params.id);

  const payload = {
    username: location.name,
    activatorId: context.currentAdmin.id,
    sub: location.id
  }

  if (Boolean(useLocation.isActive.readInt8())) {
    return {
      record: {
        access_token: jwtService.sign(payload),
        ...location.toJSON(context.currentAdmin)
      },
    }
  };

  useLocation.isActive = 1;
  await LocationEntity.save(useLocation)
  location.param = useLocation;

  return {
    record: {
      access_token: jwtService.sign(payload),
      ...location.toJSON(context.currentAdmin)
    },
  }

}

export default activateLocatin;