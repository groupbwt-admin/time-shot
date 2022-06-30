import { ActionContext } from "adminjs";
import { LocationEntity } from "../../../database/entities/location.entity";

async function listAfterLocation(context: ActionContext) {
  for (let record of context.records) {
    const location = record.params;
    location.creatorEmail = (await LocationEntity.findOne({
      where: { id: location.id },
      relations: ['creator'],
    })).creator['email'];
  }
  return context
};

export default listAfterLocation;
