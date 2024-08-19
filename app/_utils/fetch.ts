import { API_ROUTES } from "./constants";

export const parseQuery = (
  route: (typeof API_ROUTES)[keyof typeof API_ROUTES],
  query: Record<string, any>,
) => {
  const url = new URL(route, window.location.origin);
  Object.keys(query).forEach((key) => {
    if (query[key]) url.searchParams.append(key, query[key]);
  });
  return url;
};
