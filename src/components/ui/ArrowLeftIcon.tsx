import { cn } from "@/lib/utils/cn";

type ArrowLeftIconProps = {
  className?: string;
  size?: number;
};

export function ArrowLeftIcon({ className, size = 16 }: ArrowLeftIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M10 3L5 8L10 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
