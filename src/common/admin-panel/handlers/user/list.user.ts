import * as flat from 'flat'
import { Filter, populator, SortSetter } from "adminjs";
import { usersPerPageLimit } from '../../../constants/adminjs-constants';
import canModifyUser from '../../permissions/user.permission';

const listUser = async (request, response, context) => {
  const { query } = request
  const { sortBy, direction, filters = {} } = flat.unflatten(query || {})
  const { resource } = context
  let { page, perPage } = flat.unflatten(query || {})

  if (perPage) {
    perPage = +perPage > usersPerPageLimit ? usersPerPageLimit : +perPage
  } else {
    perPage = context._admin.options.settings?.defaultPerPage ?? 10
  }
  page = Number(page) || 1

  const listProperties = resource.decorate().getListProperties()
  const firstProperty = listProperties.find(p => p.isSortable())

  let sort
  if (firstProperty) {
    sort = SortSetter(
      { sortBy, direction },
      firstProperty.name(),
      resource.decorate().options,
    )
  }

  const filter = await new Filter(filters, resource).populate()

  let records, total
  if (canModifyUser(context)) {
    records = await resource.find(filter, {
      limit: perPage,
      offset: (page - 1) * perPage,
      sort,
    });
    total = await resource.count(filter)
  } else {
    records = [await resource.findOne( { 
      where: {
        id: context.currentAdmin.id
      }
    })];
    total = 1;
  }
  const populatedRecords = await populator(records)

  // eslint-disable-next-line no-param-reassign
  context.records = populatedRecords

  return {
    meta: {
      total,
      perPage,
      page,
      direction: sort?.direction,
      sortBy: sort?.sortBy,
    },
    records: populatedRecords.map(r => r.toJSON(context.currentAdmin)),
  }
};

export default listUser;
