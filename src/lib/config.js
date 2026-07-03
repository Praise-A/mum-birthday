const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
const apiBaseUrl = import.meta.env.DEV ? "" : configuredApiBaseUrl;

export function getApiUrl(path) {
  if (!path.startsWith("/")) {
    throw new Error("API paths must start with '/'.");
  }

  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

export { apiBaseUrl };
