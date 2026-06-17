import { CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";

type CategoryBadgeProps = {
  categoryId: string | null;
  className?: string;
};

export function CategoryBadge({ categoryId, className }: CategoryBadgeProps) {
  const category = CATEGORIES.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <span
        className={cn(
          "inline-flex rounded-full border-2 border-dark/10 bg-white/70 px-3 py-1",
          "text-xs font-bold uppercase tracking-wide text-dark/60",
          className,
        )}
      >
        Mixed
      </span>
    );
  }

  const accentStyles = {
    pink: "border-pink/40 bg-pink/15 text-dark",
    blue: "border-blue/40 bg-blue/15 text-dark",
    lime: "border-lime/50 bg-lime/25 text-dark",
    cream: "border-dark/15 bg-cream text-dark",
    dark: "border-dark/25 bg-dark/5 text-dark",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border-2 px-3 py-1",
        "text-xs font-bold uppercase tracking-wide",
        accentStyles[category.accent],
        className,
      )}
    >
      {category.label}
    </span>
  );
}
