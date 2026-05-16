export const getBaseUrl = () =>
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://typewriter-api-production.up.railway.app");
