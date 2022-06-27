import { ActionRequest } from "adminjs";
import * as cookie from "cookie";


function parseCookiesFromActionRequest<T extends object = any>(request: ActionRequest): T {
    //@ts-ignore
    const cookieValue = request.headers.cookie;
    return cookie.parse(cookieValue);
}

export default parseCookiesFromActionRequest;