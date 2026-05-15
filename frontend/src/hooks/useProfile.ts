import { useQuery } from "@tanstack/react-query";
import { getBaseUrl } from "../lib/api";

export type Profile = {
  id: string;
  username: string;
  best_wpm: number;
  avg_accuracy: number;
  total_games: number;
};

export const useProfile = (enabled: boolean) => {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${getBaseUrl()}/api/auth/profile/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<Profile>;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
