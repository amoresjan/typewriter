import { useQuery } from "@tanstack/react-query";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { News } from "@app-types";
import { getBaseUrl } from "../lib/api";

export const useNews = () => {
  return useQuery<News>({
    queryKey: ["news"],
    queryFn: async () => {
      if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
        return NEWS_CONTENT_MOCK;
      }
      const response = await fetch(`${getBaseUrl()}/api/news/`);
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
