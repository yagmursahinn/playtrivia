"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuestionTypeBadge } from "@/components/quiz/QuestionTypeBadge";
import { getQuestionPointLabel } from "@/lib/quiz/validate-answer";
import type { QuizQuestion } from "@/data/quiz/types";
import { cn } from "@/lib/utils/cn";
import { FillBlankAnswer } from "./answers/FillBlankAnswer";
import { MultipleChoiceAnswer } from "./answers/MultipleChoiceAnswer";
import { EnumerationAnswer } from "./answers/EnumerationAnswer";
import { PictureChoiceAnswer } from "./answers/PictureChoiceAnswer";

type QuestionCardProps = {
  question: QuizQuestion;
  frozen?: boolean;
  onSubmit: (answer: string | string[]) => void;
};

const EMPTY_ANSWER_MESSAGE = "Choose an answer to continue.";

export function QuestionCard({ question, frozen = false, onSubmit }: QuestionCardProps) {
  const [answer, setAnswer] = useState<string | string[]>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hasValidAnswer =
    question.type === "multiple-choice" || question.type === "picture-choice"
      ? selectedOption !== null
      : typeof answer === "string" && answer.trim().length > 0;

  const handleSubmit = () => {
    if (frozen || !hasValidAnswer) {
      return;
    }

    if (question.type === "multiple-choice" || question.type === "picture-choice") {
      onSubmit(selectedOption!);
      return;
    }

    if (typeof answer === "string") {
      onSubmit(answer.trim());
    }
  };

  return (
    <div className={cn("flex flex-col", frozen && "pointer-events-none")}>
      <div
        className={cn(
          "rounded-3xl border-[3px] border-dark/10 bg-white/85 p-5 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-8 lg:p-10",
          frozen && "opacity-60",
        )}
      >
        <div className="mb-5 flex flex-wrap items-center gap-2 sm:mb-6">
          <QuestionTypeBadge type={question.type} />
          <span className="rounded-full border-2 border-pink/30 bg-pink/10 px-3 py-1 font-display text-xs font-bold text-pink">
            {getQuestionPointLabel(question)}
          </span>
        </div>

        <h2 className="font-display text-xl font-bold leading-snug text-dark sm:text-2xl lg:text-3xl">
          {question.text}
        </h2>

        <div className="mt-6 sm:mt-8">
          {question.type === "multiple-choice" && (
            <MultipleChoiceAnswer
              options={question.options}
              selected={selectedOption}
              onSelect={(option) => {
                setSelectedOption(option);
              }}
            />
          )}
          {question.type === "fill-blank" && (
            <FillBlankAnswer
              value={typeof answer === "string" ? answer : ""}
              label={question.blankLabel}
              onChange={(value) => {
                setAnswer(value);
              }}
            />
          )}
          {question.type === "enumeration" && (
            <EnumerationAnswer
              value={typeof answer === "string" ? answer : ""}
              hint={question.hint}
              requiredCount={question.count}
              onChange={(value) => {
                setAnswer(value);
              }}
            />
          )}
          {question.type === "picture-choice" && (
            <PictureChoiceAnswer
              imageSrc={question.imageSrc}
              imageAlt={question.imageAlt}
              options={question.options}
              selected={selectedOption}
              onSelect={(option) => {
                setSelectedOption(option);
              }}
            />
          )}
        </div>
      </div>

      {!frozen && (
        <div className="sticky bottom-0 z-10 mt-5 border-t border-dark/5 bg-cream/95 py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:py-0">
          <div className="flex flex-col items-center gap-3 sm:mx-auto sm:max-w-xl lg:max-w-2xl">
            {!hasValidAnswer ? (
              <p className="font-body text-sm font-semibold text-dark/50" role="status">
                {EMPTY_ANSWER_MESSAGE}
              </p>
            ) : null}

            <Button
              variant="primary"
              size="xl"
              fullWidth
              disabled={!hasValidAnswer}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
