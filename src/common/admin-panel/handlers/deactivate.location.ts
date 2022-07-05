const deactivateLocation = async (request, response, context) => {
  const location = context.record;
  const { logoutPath } = context._admin.options;

  response.clearCookie('accessToken');

  return {
    record: {
      message: 'Location is deactivated!',
      logoutPath,
      ...location.toJSON(context.currentAdmin),
    }
  }
};

export default deactivateLocation;
