import { LocationEntity } from "../../../database/entities/location.entity";

const activateLocatin = async (request, response, context) => {
  const location = context.record;
  const Locations = context._admin.findResource('LocationEntity');
  const useLocation = await LocationEntity.findOne(context.record.param('locationId'));
  console.log(useLocation);
  console.log(useLocation.isActive)
  if (useLocation.isActive) {
    return {
      record: location.toJSON(context.currentAdmin),
    }
  };
  useLocation.isActive = 1;
  await LocationEntity.save(useLocation)
  location.param.isActive.data = [1];

  return {
    record: location.toJSON(context.currentAdmin),
  }

}

export default activateLocatin;