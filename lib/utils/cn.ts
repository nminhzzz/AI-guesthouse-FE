// Utility để merge className với Tailwind (có thể dùng clsx hoặc tailwind-merge sau)
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
