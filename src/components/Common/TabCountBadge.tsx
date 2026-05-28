import React from "react";
interface TabCountBadgeProps {
  count: number;
  isActive: boolean;
}
/**
 * Tab count badge — mirrors the pattern used on the Dashboard (Issues) page.
 */
export const TabCountBadge: React.FC<TabCountBadgeProps> = ({ count, isActive }) => (
  <span
    className={`ml-1.5 px-1.5 min-w-[20px] h-5 text-xs font-medium rounded-full inline-flex items-center justify-center ${
      isActive
        ? "bg-primary/15 text-primary border border-primary/30"
        : "bg-muted text-muted-foreground border border-border"
    }`}
  >
    {count}
  </span>
);
export default TabCountBadge;