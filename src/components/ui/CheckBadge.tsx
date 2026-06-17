import { cn } from "@/lib/utils/cn";

type CheckBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

export function CheckBadge({ className, size = "md" }: CheckBadgeProps) {
  const dimension = size === "sm" ? 14 : 16;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
