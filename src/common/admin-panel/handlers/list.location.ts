import { LocationEntity } from "../../../database/entities/location.entity";

const listLocation = async (context) => {
  for (let record of context.records) {
    const location = record.params;
    location.creatorId = (await LocationEntity.findOne({
      where: { id: location.id },
      relations: ["creator"],
    })).creator["id"];
  }
  return context
};

export default listLocation;
