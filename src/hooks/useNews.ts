import { useQuery } from "@tanstack/react-query";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { News } from "@app-types";

export const useNews = () => {
  return useQuery<News>({
    queryKey: ["news"],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl && import.meta.env.DEV) {
        return NEWS_CONTENT_MOCK;
      }
      const baseUrl = apiUrl ?? "https://typewriter-api-production.up.railway.app";
      const response = await fetch(`${baseUrl}/api/news/`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      }
      return NEWS_CONTENT_MOCK;
    },
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
  