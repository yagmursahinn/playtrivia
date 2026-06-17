import { cn } from "@/lib/utils/cn";

type PlayerInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  index?: number;
  accentIndex?: number;
};

const accentColors = [
  "bg-pink/15 border-pink/30",
  "bg-blue/15 border-blue/30",
  "bg-lime/25 border-lime/50",
  "bg-pink/10 border-pink/20",
];

export function PlayerInput({
  label,
  value,
  onChange,
  placeholder,
  index = 0,
  accentIndex = 0,
}: PlayerInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={`player-${index}`}
        className="block font-display text-sm font-bold uppercase tracking-wide text-dark/70 sm:text-base"
      >
        {label}
      </label>
      <input
        id={`player-${index}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Enter name..."}
        maxLength={20}
        className={cn(
          "w-full rounded-2xl border-[3px] px-5 py-4",
          "font-body text-base font-semibold text-dark placeholder:text-dark/30",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-4 focus:ring-blue/30 focus:border-blue/50",
          accentColors[accentIndex % accentColors.length],
        )}
      />
    </div>
  );
}
