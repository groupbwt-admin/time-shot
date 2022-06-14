import { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";


const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {
    listProperties: ['name', 'creator_email', 'deletedAt', 'isActive'],
    navigation: {
      icon: "Location",
      name: null,
    }
  },

};

export default LocationResource;