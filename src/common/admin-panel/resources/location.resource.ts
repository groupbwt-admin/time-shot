import AdminBro, { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";
import activateLocation from "../handlers/activate.location";
import canActivateLocation from "../permissions/location.activate.permission";
import canGrantPermission from "../permissions/user.permission";

const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {
    properties: {
      deletedAt: {
        isVisible: false,
      },
      isActive: {
        isVisible: {
          edit: false,
        },
      },
    },
    navigation: {
      icon: "Location",
      name: null,
    },
    actions: {
      activateLocation: {
        isAccessible: canActivateLocation,
        icon: 'Activate',
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
    }
  },
};

export default LocationResource;