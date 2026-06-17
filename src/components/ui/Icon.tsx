import type { IconName } from "@/lib/constants/icons";
import { getIconPath } from "@/lib/constants/icons";
import { cn } from "@/lib/utils/cn";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type IconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
  priority?: boolean;
};

/** Display sizes in CSS pixels — source assets are 512×512 for sharp downscaling. */
const sizeMap: Record<IconSize, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 64,
  "2xl": 80,
};

export function Icon({
  name,
  size = "md",
  className,
  priority = false,
}: IconProps) {
  const dimension = sizeMap[size];

  return (
    // Native img keeps PNG icons crisp — Next/Image recompression blurs small assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getIconPath(name)}
      alt=""
      width={dimension}
      height={dimension}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      aria-hidden
      className={cn("block shrink-0 select-none", className)}
      style={{ width: dimension, height: dimension }}
    />
  );
}
