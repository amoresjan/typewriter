import React from "react";

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-bold">{value}</span>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

export default StatItem;
