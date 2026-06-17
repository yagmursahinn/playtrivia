"use client";

import { cn } from "@/lib/utils/cn";

type FillBlankAnswerProps = {
  value: string;
  label?: string;
  onChange: (value: string) => void;
};

export function FillBlankAnswer({ value, label, onChange }: FillBlankAnswerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor="fill-blank-answer"
          className="block font-display text-sm font-bold uppercase tracking-wide text-dark/60"
        >
          {label}
        </label>
      )}
      <input
        id="fill-blank-answer"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        className={cn(
          "w-full rounded-2xl border-[3px] border-blue/30 bg-blue/10 px-5 py-4",
          "font-body text-base font-semibold text-dark placeholder:text-dark/30",
          "focus:outline-none focus:ring-4 focus:ring-blue/30 focus:border-blue/50",
        )}
      />
    </div>
  );
}
