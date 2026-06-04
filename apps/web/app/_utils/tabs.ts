export function buildTabUrl(
  basePath: string,
  searchParams: URLSearchParams,
  key: string,
  defaultTab?: string,
) {
  const params = new URLSearchParams(searchParams.toString());

  if (defaultTab && key === defaultTab) {
    params.delete("tab");
  } else if (!defaultTab && (key === "" || key === undefined)) {
    params.delete("tab");
  } else {
    params.set("tab", key);
  }

  params.delete("page");

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
