import { ValidationError } from "adminjs";
import { LocationEntity } from "../../../../database/entities/location.entity";

const validationEditLocation = async (request) => {
  const { name, } = request.payload;
  if (await LocationEntity.findOne({ where: { name: name } })) {
    throw new ValidationError({
      name: {
        message: 'A location with the same name already exists!'
      }
    });
  }
  return request
};

export default validationEditLocation;
