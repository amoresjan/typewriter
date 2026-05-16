import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@context/AuthContext";
import { useProfile } from "@hooks/useProfile";
import NeoButton from "@components/common/NeoButton";

interface ProfileViewProps {
  onClose: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, isError } = useProfile(true);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.removeQueries({ queryKey: ["profile"] });
    onClose();
  };

  const hasStats = profile && profile.total_games > 0;

  return (
    <div className="flex flex-col">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-attribution">
        Correspondent
      </p>
      <h2 className="text-2xl font-semibold leading-tight">{user?.username}</h2>

      <div className="mt-6 border-t border-ash-border">
        {isLoading && (
          <p className="py-4 font-sans text-sm text-attribution">
            Retrieving record…
          </p>
        )}
        {isError && (
          <p className="py-4 font-sans text-sm text-press-red">
            Could not retrieve correspondent file.
          </p>
        )}
        {profile && !hasStats && (
          <p className="py-4 font-sans text-sm italic text-attribution">
            No dispatches on record yet.
          </p>
        )}
        {hasStats && (
          <dl>
            <div className="flex items-baseline justify-between py-3">
              <dt className="font-sans text-sm text-attribution">Best WPM</dt>
              <dd className="font-sans text-xl font-bold tabular-nums">
                {profile.best_wpm}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-ash-border py-3">
              <dt className="font-sans text-sm text-attribution">
                Avg. Accuracy
              </dt>
              <dd className="font-sans text-xl font-bold tabular-nums">
                {profile.avg_accuracy}%
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-ash-border py-3">
              <dt className="font-sans text-sm text-attribution">Dispatches</dt>
              <dd className="font-sans text-xl font-bold tabular-nums">
                {profile.total_games}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-6 border-t border-ash-border pt-6">
        <NeoButton variant="secondary" onClick={handleLogout} className="w-full">
          Sign Out
        </NeoButton>
      </div>
    </div>
  );
};
