"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatSavedProgressLabel, type SavedProgressSummary } from "@/lib/quiz/progress-storage";

type OverwriteProgressDialogProps = {
  open: boolean;
  saved: SavedProgressSummary | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function OverwriteProgressDialog({
  open,
  saved,
  onConfirm,
  onCancel,
}: OverwriteProgressDialogProps) {
  const savedLabel = saved ? formatSavedProgressLabel(saved) : "your saved quiz";

  return (
    <ConfirmDialog
      open={open}
      title="Replace saved progress?"
      description={`Starting this quiz will replace ${savedLabel}. Your current progress will be lost.`}
      confirmLabel="Start New Quiz"
      cancelLabel="Keep Saved Progress"
      confirmVariant="secondary"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
