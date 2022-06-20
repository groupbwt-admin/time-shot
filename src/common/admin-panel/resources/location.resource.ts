import AdminBro, { ResourceWithOptions } from "admin-bro";
import { LocationEntity } from "../../../database/entities/location.entity";
import activateLocation from "../handlers/activate.location";
import canActivateLocation from "../permissions/location.activate.permission";
import canModifyLocation from "../permissions/location.common.permission";
import validationCreateLocation from "../validations/location/location-create.validation";
import validationEditLocation from "../validations/location/location-edit.validation";
import hasAdminPermission from "../permissions/has-admin.permission";

const LocationResource: ResourceWithOptions = {
  resource: LocationEntity,
  options: {
    properties: {
      deletedAt: {
        isVisible: false,
      },
      isActive: {
        isVisible: {
          edit: false, list: true, show: true, filter: true,
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
      new: {
        isAccessible: canModifyLocation,
        before: validationCreateLocation,
      },
      edit: {
        isAccessible: canModifyLocation,
        before: validationEditLocation,
      },
      delete: {
        isAccessible: canModifyLocation
      },
      show: { isAccessible: hasAdminPermission },
      list: { isAccessible: hasAdminPermission },
      bulkDelete: { isAccessible: hasAdminPermission },
      search: { isAccessible: hasAdminPermission }
    }
  },
};

export default LocationResource;