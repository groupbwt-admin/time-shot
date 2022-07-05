import { ValidationError } from "adminjs";
import { LocationEntity } from "../../../../database/entities/location.entity";

const validationEditLocation = async (request) => {
  const location = request.payload;
  const findLocation = await LocationEntity.findOne({ 
    select: ['id'],
    where: { name: location.name } 
  });
  if (findLocation && findLocation.id !== location.id) {
    throw new ValidationError({
      name: {
        message: 'A location with the same name already exists!'
      }
    });
  }
  return request
};

export default validationEditLocation;
