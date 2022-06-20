import AdminBro, { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";
import activateLocatin from "../handlers/activate.location";


const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {
    listProperties: ['name', 'creator_email', 'deletedAt', 'isActive'],
    navigation: {
      icon: "Location",
      name: null,
    },
    actions: {
      activateLocation: {
        actionType: 'record',
        handler: activateLocatin,
        component: AdminBro.bundle('../components/activated-locations'),
      },
      delete: {
        isAccessible: false
      },
    }
  },

};

export default LocationResource;