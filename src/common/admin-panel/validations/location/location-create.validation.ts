import { ValidationError } from "adminjs";
import { LocationEntity } from "../../../../database/entities/location.entity";

const validationCreateLocation = async (request) => {
  const { name } = request.payload;
  if (await LocationEntity.findOne({ where: { name: name } })) {
    throw new ValidationError({
      name: {
        message: 'A location with the same name already exists!'
      }
    });
  }
  const { id } = request.session.adminUser;
  request.payload.creatorId = id;
  return request
};

export default validationCreateLocation;
