import { useQuery } from "@tanstack/react-query";
import { NEWS_CONTENT_MOCK } from "@mocks/NewsContentMock";
import { News } from "@app-types";
import { getBaseUrl } from "../lib/api";

export const useNews = (date?: string) => {
  return useQuery<News>({
    queryKey: ["news", date ?? "today"],
    queryFn: async () => {
      const baseUrl = getBaseUrl();
      const url = date
        ? `${baseUrl}/api/news/${date}/`
        : `${baseUrl}/api/news/`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      if (data && data.length > 0) return data[0];
      if (date) throw new Error("No article for this date");
      return NEWS_CONTENT_MOCK;
    },
    retry: date ? 0 : 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
