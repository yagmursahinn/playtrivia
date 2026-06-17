"use client";

import { MultipleChoiceAnswer } from "./MultipleChoiceAnswer";
import { QuizImage } from "../QuizImage";

type PictureChoiceAnswerProps = {
  imageSrc: string;
  imageAlt: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
};

export function PictureChoiceAnswer({
  imageSrc,
  imageAlt,
  options,
  selected,
  onSelect,
}: PictureChoiceAnswerProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border-[3px] border-pink/20 bg-gradient-to-br from-pink/8 via-cream to-blue/8 p-3 shadow-[0_12px_34px_rgba(26,26,46,0.08)]">
        <div className="mb-2 flex justify-center">
          <span className="rounded-full border-2 border-pink/25 bg-pink/10 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-dark/65">
            Picture Round
          </span>
        </div>
        <div className="mx-auto w-[min(100%,17.5rem)] sm:w-[min(100%,24rem)]">
          <div className="overflow-hidden rounded-2xl border-[3px] border-dark/10 bg-cream/60 shadow-[0_10px_28px_rgba(26,26,46,0.1)]">
            <QuizImage src={imageSrc} alt={imageAlt} />
          </div>
        </div>
      </div>
      <MultipleChoiceAnswer options={options} selected={selected} onSelect={onSelect} />
    </div>
  );
}
