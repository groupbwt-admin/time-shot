import AdminBro, { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";
import activateLocation from "../handlers/activate.location";
import canActivateLocation from "../permissions/location.activate.permission";
import canGrantPermission from "../permissions/user.permission";

const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {
    listProperties: ['name', 'creatorId', 'isActive'],
    navigation: {
      icon: "Location",
      name: null,
    },
    actions: {
      activateLocation: {
        isAccessible: canActivateLocation,
        actionType: 'record',
        handler: activateLocation,
        component: AdminBro.bundle('../components/activated-locations'),
      },
      show: {
        isAccessible: canGrantPermission,
      },
      new: {
        isAccessible: canGrantPermission,
      },
      edit: {
        isAccessible: canGrantPermission,
      },
      delete: {
        isAccessible: false
      },
    }
  },
};

export default LocationResource;