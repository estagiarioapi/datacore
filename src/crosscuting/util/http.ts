export function assembleQueryParams(params: Record<string, any>): string {
  return safeObject(params)
    ? Object.keys(params)
        .map((key) => {
          return `${key}=${params[key]}`;
        })
        .join('&')
    : '';
}

export function assembleUrl(
  baseUrl: string,
  endpoint: string,
  params: Record<string, any>,
): string {
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${baseUrl}${endpoint}?${assembleQueryParams(params)}`;
}

export function safeArray<T>(array: T[]): boolean {
  return array && Array.isArray(array) && array.length > 0;
}

export function safeObject<T>(object: T): boolean {
  return object && typeof object === 'object' && Object.keys(object).length > 0;
}
