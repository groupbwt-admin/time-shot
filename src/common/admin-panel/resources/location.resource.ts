import { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";

const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {},
};

export default LocationResource;