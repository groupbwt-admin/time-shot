import { LocationEntity } from '../../../database/entities/location.entity';

const showLocation = async (context) => {
  const location = context.record.params;
  location.creatorEmail = (await LocationEntity.findOne({
    where: { id: location.id },
    relations: ['creator'],
  })).creator['email'];
  return context
};

export default showLocation;
