import { LocationEntity } from "../../../database/entities/location.entity";

const activateLocatin = async (request, response, context) => {
  const location = context.record;
  const useLocation = await LocationEntity.findOne(location.params.id);

  if (Boolean(useLocation.isActive.readInt8())) {
    return {
      record: location.toJSON(context.currentAdmin),
    }
  };

  useLocation.isActive = 1;
  await LocationEntity.save(useLocation)
  location.param = useLocation;

  return {
    record: location.toJSON(context.currentAdmin),
  }

}

export default activateLocatin;