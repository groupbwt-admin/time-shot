import { ValidationError } from "adminjs";
import { LocationEntity } from "../../../../database/entities/location.entity";

const validationCreateLocation = async (request) => {
  const { name } = request.payload;
  const findLocation = await LocationEntity.findOne({ 
    select: ['id'], 
    where: { name: name } 
  });
  if (findLocation) {
    throw new ValidationError({
      name: {
        message: 'A location with the same name already exists!'
      }
    });
  }
  const { id } = request.session.adminUser;
  request.payload['creator.id'] = id;
  return request
};

export default validationCreateLocation;
