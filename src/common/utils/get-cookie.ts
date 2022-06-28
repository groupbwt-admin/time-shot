function getCookie(request) {
  let cookieObject = {};
  for (let cookie of request.headers.cookie.split('; ')) {
    let [key, value] = cookie.split('=');
    cookieObject[key] = value;
  };
  return cookieObject;
};

export default getCookie;
