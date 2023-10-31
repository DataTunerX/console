const generateQueryString = (params: { [key: string]: string | boolean | number }) => Object.entries(params).map(([key, value]) => `${key}=${value}`);

export { generateQueryString };
