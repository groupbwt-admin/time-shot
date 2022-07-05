import * as flat from 'flat'
import { ActionContext, ActionRequest, Filter, populator } from 'adminjs';
import sortSetter from 'adminjs/lib/backend/services/sort-setter/sort-setter';
import parseJwt from '../../utils/parse-jwt';
import parseCookiesFromActionRequest from '../../utils/parse-cookies-from-action-request';

const PER_PAGE_LIMIT = 500

const listLocation = async (request: ActionRequest, response: any, context: ActionContext) => {
  const cookie = parseCookiesFromActionRequest(request);
  const { query } = request
  const { sortBy, direction, filters = {} } = flat.unflatten(query || {})
  const { resource } = context
  let { page, perPage } = flat.unflatten(query || {})

  if (perPage) {
    perPage = +perPage > PER_PAGE_LIMIT ? PER_PAGE_LIMIT : +perPage
  } else {
    perPage = context._admin.options.settings?.defaultPerPage ?? 10
  }
  page = Number(page) || 1

  const listProperties = resource.decorate().getListProperties()
  const firstProperty = listProperties.find(p => p.isSortable())
  let sort
  if (firstProperty) {
    sort = sortSetter(
      { sortBy, direction },
      firstProperty.name(),
      resource.decorate().options,
    )
  }

  const filter = await new Filter(filters, resource).populate()

  let records, total
  if (!cookie.accessToken) {
    records = await resource.find(filter, {
      limit: perPage,
      offset: (page - 1) * perPage,
      sort,
    })
    total = await resource.count(filter)
  } else {
    const { locationId } = parseJwt(cookie.accessToken);
    records = [await resource.findOne(locationId)];
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

export default listLocation;
