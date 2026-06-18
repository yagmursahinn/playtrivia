"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header, PageContainer } from "@/components/layout";
import { CategoryCard } from "@/components/ui";
import { CategoryPreviewPanel } from "@/components/quiz/CategoryPreviewPanel";
import { CategorySelectionHero } from "@/components/quiz/CategorySelectionHero";
import { ContinueQuizBanner } from "@/components/quiz/ContinueQuizBanner";
import { OverwriteProgressDialog } from "@/components/quiz/OverwriteProgressDialog";
import { fadeInUp, transitions } from "@/lib/theme/animations";
import { trackCategorySelected } from "@/lib/analytics";
import { getPlayPath } from "@/lib/quiz/routes";
import {
  getSavedProgressConflict,
  type SavedProgressSummary,
} from "@/lib/quiz/progress-storage";
import { CATEGORIES, getAllCategoryQuestionCountsById } from "@/lib/constants/categories";

const STANDARD_CATEGORIES = CATEGORIES.filter((category) => category.id !== "mixed");
const MIXED_CATEGORY = CATEGORIES.find((category) => category.id === "mixed")!;
const CATEGORY_COUNTS = getAllCategoryQuestionCountsById();

export default function SoloSetupPage() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("general");
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [savedConflict, setSavedConflict] = useState<SavedProgressSummary | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    trackCategorySelected({ category: categoryId });
    setSelectedCategoryId(categoryId);
  };

  const navigateToQuiz = (categoryId: string) => {
    router.push(getPlayPath(categoryId, "solo"));
  };

  const handleStart = () => {
    if (!selectedCategoryId) return;

    const conflict = getSavedProgressConflict({
      categoryId: selectedCategoryId,
      mode: "solo",
      sessionType: "standard",
    });

    if (conflict) {
      setSavedConflict(conflict);
      setShowOverwriteConfirm(true);
      return;
    }

    navigateToQuiz(selectedCategoryId);
  };

  return (
    <>
      <Header />
      <PageContainer className="max-w-[min(92rem,94vw)] px-3 pb-24 pt-2 sm:px-5 sm:pb-16 sm:pt-4 lg:px-6">
        <ContinueQuizBanner className="mb-5 sm:mb-6" />
        <CategorySelectionHero />

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_min(22rem,34%)] lg:items-start lg:gap-6 xl:gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ ...transitions.fast, delay: 0.05 }}
            className="grid gap-3 sm:gap-4 lg:grid-cols-2 lg:auto-rows-fr"
          >
            {STANDARD_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                questionCount={CATEGORY_COUNTS[category.id] ?? 0}
                selected={selectedCategoryId === category.id}
                onSelect={handleCategorySelect}
              />
            ))}

            <div className="flex justify-center lg:col-span-2">
              <div className="w-full lg:w-[calc(50%-0.5rem)]">
                <CategoryCard
                  category={MIXED_CATEGORY}
                  questionCount={CATEGORY_COUNTS[MIXED_CATEGORY.id] ?? 0}
                  selected={selectedCategoryId === MIXED_CATEGORY.id}
                  onSelect={handleCategorySelect}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ ...transitions.fast, delay: 0.1 }}
            className="mt-5 sm:mt-6 lg:sticky lg:top-24 lg:mt-0"
          >
            <CategoryPreviewPanel
              categoryId={selectedCategoryId}
              onStart={handleStart}
            />
          </motion.div>
        </div>
      </PageContainer>

      <OverwriteProgressDialog
        open={showOverwriteConfirm}
        saved={savedConflict}
        onConfirm={() => {
          setShowOverwriteConfirm(false);
          if (selectedCategoryId) {
            navigateToQuiz(selectedCategoryId);
          }
        }}
        onCancel={() => {
          setShowOverwriteConfirm(false);
          setSavedConflict(null);
        }}
      />
    </>
  );
}
