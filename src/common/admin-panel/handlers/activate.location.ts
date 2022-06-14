import { LocationEntity } from "../../../database/entities/location.entity";

const activateLocatin = async (request, response, context) => {
  const location = context.record;
  const Locations = context._admin.findResource('LocationEntity');
  const useLocation = await LocationEntity.findOne(context.record.param('locationId'));
  console.log(useLocation.isActive.readInt());
  console.log(Boolean(useLocation.isActive.readInt8()));
  if (Boolean(useLocation.isActive.readInt8())) {
    return {
      record: location.toJSON(context.currentAdmin),
    }
  };
  useLocation.isActive = 1;
  await LocationEntity.save(useLocation)
  console.log(useLocation);
  location.param = useLocation;
  console.log("Active");
  return {
    record: location.toJSON(context.currentAdmin),
  }

}

export default activateLocatin;