export const getBaseUrl = () =>
  import.meta.env.VITE_API_URL ??
  "https://typewriter-api-production.up.railway.app";
