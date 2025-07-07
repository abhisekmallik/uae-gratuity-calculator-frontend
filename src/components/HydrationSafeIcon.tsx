"use client";
import styles from "./HydrationSafeIcon.module.css";

interface HydrationSafeIconProps {
  children: React.ReactNode;
  className?: string;
}
export function HydrationSafeIcon({
  children,
  className,
}: HydrationSafeIconProps) {
  return (
    <span
      className={`${styles.iconContainer} ${className || ""}`}
      suppressHydrationWarning
    >
      {children}
    </span>
  );
}
