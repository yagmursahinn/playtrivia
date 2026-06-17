"use client";

import { cn } from "@/lib/utils/cn";

type EnumerationAnswerProps = {
  value: string;
  hint?: string;
  requiredCount?: number;
  onChange: (value: string) => void;
};

export function EnumerationAnswer({
  value,
  hint,
  requiredCount = 3,
  onChange,
}: EnumerationAnswerProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="enumeration-answer"
        className="block font-display text-sm font-bold uppercase tracking-wide text-dark/60"
      >
        Your answers
      </label>
      <textarea
        id="enumeration-answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={hint ?? "Enter items separated by commas"}
        rows={3}
        className={cn(
          "w-full resize-none rounded-2xl border-[3px] border-lime/50 bg-lime/15 px-5 py-4",
          "font-body text-base font-semibold text-dark placeholder:text-dark/30",
          "focus:outline-none focus:ring-4 focus:ring-lime/40 focus:border-lime/60",
        )}
      />
      <p className="font-body text-xs font-medium text-dark/45">
        Name {requiredCount} answers · earn 5 points for each correct one
      </p>
    </div>
  );
}
