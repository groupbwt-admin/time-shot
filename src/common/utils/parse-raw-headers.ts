function parseRawHeaders(rawHeaders: string[]): Record<string, string> {
    const headers = {};
    for (let keyIndex = 0; keyIndex < rawHeaders.length; keyIndex += 2) {
        const valueIndex = keyIndex + 1;
        const key = rawHeaders[keyIndex];
        headers[key.toLowerCase()] = rawHeaders[valueIndex];
    }
    return headers;
}

export default parseRawHeaders;