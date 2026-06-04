"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "orange" | "blue" | "green" | "purple" | "red" | "teal";
  change?: number; // % change, positive = up, negative = down
  suffix?: string;
  loading?: boolean;
}

const COLOR_MAP = {
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-100",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  red: {
    bg: "bg-red-50",
    iconBg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-100",
  },
  teal: {
    bg: "bg-teal-50",
    iconBg: "bg-teal-500",
    text: "text-teal-600",
    border: "border-teal-100",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  change,
  suffix = "",
  loading = false,
}: StatCardProps) {
  const c = COLOR_MAP[color];

  if (loading) {
    return (
      <div
        className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm animate-pulse`}
      >
        <div className="flex items-center justify-between">
          <div className={`w-11 h-11 rounded-xl ${c.iconBg} opacity-30`} />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="mt-4 h-8 w-24 bg-gray-200 rounded" />
        <div className="mt-2 h-4 w-32 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center`}
        >
          <Icon size={20} className="text-white" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              change >= 0
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className={`text-2xl font-bold text-gray-900`}>
          {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
          {suffix && (
            <span className="text-base font-normal text-gray-500 ml-1">
              {suffix}
            </span>
          )}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
