import React from "react";

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex flex-col items-center font-sans">
    <span className="text-3xl font-bold tabular-nums">{value}</span>
    <span className="text-sm text-attribution">{label}</span>
  </div>
);

export default StatItem;
