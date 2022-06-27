import { LocationEntity } from '../../../database/entities/location.entity';

const listLocation = async (context) => {
  for (let record of context.records) {
    const location = record.params;
    location.creatorEmail = (await LocationEntity.findOne({
      where: { id: location.id },
      relations: ['creator'],
    })).creator['email'];
  }
  return context
};

export default listLocation;
