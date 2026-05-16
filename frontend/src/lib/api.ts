export const getBaseUrl = () =>
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://typewriter-api-production.up.railway.app");

export const getCsrfToken = (): string =>
  document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";

export const initCsrf = (): Promise<void> =>
  fetch(`${getBaseUrl()}/api/auth/csrf/`, { credentials: "include" }).then(
    () => undefined,
  );
