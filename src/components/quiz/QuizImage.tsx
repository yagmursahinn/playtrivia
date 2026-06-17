"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type QuizImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function QuizImage({ src, alt, className }: QuizImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue/15 via-cream to-pink/15 px-6 text-center",
          className,
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-dark/10 bg-white/80">
          <span className="font-display text-2xl font-extrabold text-dark/35">?</span>
        </div>
        <p className="font-body text-sm font-semibold text-dark/55">{alt}</p>
        <p className="font-body text-xs font-medium text-dark/40">Picture placeholder</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("aspect-[4/3] w-full object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
