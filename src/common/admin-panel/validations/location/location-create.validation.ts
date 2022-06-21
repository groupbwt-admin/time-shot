import { ValidationError } from "adminjs";
import { LocationEntity } from "../../../../database/entities/location.entity";

const validationCreateLocation = async (request) => {
  const { name, creatorId } = request.payload;
  const { id } = request.session.adminUser;
  if (!(creatorId === id)) {
    throw new ValidationError({
      creatorId: {
        message: 'You must select your email!'
      }
    });
  };
  if (await LocationEntity.findOne({ where: { name: name } })) {
    throw new ValidationError({
      name: {
        message: 'A location with the same name already exists!'
      }
    });
  }
  return request
};

export default validationCreateLocation;
