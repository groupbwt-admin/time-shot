import { LocationEntity } from "../../../database/entities/location.entity";

const showLocation = async (context) => {
  const location = context.record.params;
  location.creatorId = (await LocationEntity.findOne({
    where: { id: location.id },
    relations: ["creator"],
  })).creator["id"];
  return context
};

export default showLocation;
