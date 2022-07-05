import { ActionHandler, ActionResponse } from 'adminjs';


const deleteUser: ActionHandler<ActionResponse> = async (request, response, data) => {
  const { record, resource, currentAdmin, h, translateMessage } = data
  if (!request.params.recordId || !record) {
    throw new Error('You have to pass "recordId" to Delete Action')
  }
  if (request.params.recordId === currentAdmin.id) {
    return {
      record: record.toJSON(currentAdmin),
      notice: {
        message: "You can't delete current user",
        type: 'error',
      },
    }
  }
  try {
    await resource.update(request.params.recordId, {
      deletedAt: () => `"${new Date().toISOString().slice(0, 19).replace('T', ' ')}"`
    });
  } catch (error) {
    return {
      record: record.toJSON(currentAdmin),
      notice: {
        message: error.message,
        type: 'error',
      },
    }
  }
  return {
    record: record.toJSON(currentAdmin),
    redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
    notice: {
      message: translateMessage('successfullyDeleted', resource.id()),
      type: 'success',
    },
  }
};

export default deleteUser;
