import { ActionRequest } from "adminjs";
import * as cookie from "cookie";
import parseRawHeaders from "./parse-raw-headers";


function parseCookiesFromActionRequest<T extends object = any>(request: ActionRequest): T {
    //@ts-ignore
    const headers: Record<string, string> = request.headers ?? parseRawHeaders(request.rawHeaders);
    const cookieValue: string = headers.cookie;
    return cookie.parse(cookieValue);
}

export default parseCookiesFromActionRequest;