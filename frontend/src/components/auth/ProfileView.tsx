import React from "react";
import { useAuth } from "@context/AuthContext";
import { useProfile } from "@hooks/useProfile";
import NeoButton from "@components/common/NeoButton";
import StatItem from "@components/common/StatItem";

interface ProfileViewProps {
  onClose: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, isError } = useProfile(true);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-old-english text-2xl">{user?.username}</h2>
      {isLoading && (
        <p className="font-sans text-sm text-attribution">Loading stats…</p>
      )}
      {isError && (
        <p className="font-sans text-sm text-press-red">
          Could not load profile.
        </p>
      )}
      {profile && (
        <div className="grid grid-cols-3 gap-4">
          <StatItem label="Best WPM" value={profile.best_wpm} />
          <StatItem label="Avg Accuracy" value={`${profile.avg_accuracy}%`} />
          <StatItem label="Games" value={profile.total_games} />
        </div>
      )}
      <NeoButton variant="secondary" onClick={handleLogout}>
        Sign Out
      </NeoButton>
    </div>
  );
};
