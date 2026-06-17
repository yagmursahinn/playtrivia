"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeIn, scaleIn, transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: "primary" | "secondary" | "outline";
  className?: string;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmVariant = "primary",
  className,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-50 flex items-end justify-center sm:items-center", className)}>
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-dark/45"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            transition={transitions.fast}
            onClick={onCancel}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            className="relative z-10 w-full max-w-md rounded-t-3xl border-[3px] border-dark/10 bg-cream p-6 shadow-[0_-8px_40px_rgba(26,26,46,0.15)] sm:rounded-3xl sm:mx-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scaleIn}
            transition={transitions.fast}
          >
            <h2
              id="confirm-dialog-title"
              className="font-display text-2xl font-extrabold text-dark"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-3 font-body text-base font-semibold leading-relaxed text-dark/65"
            >
              {description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <Button variant={confirmVariant} size="lg" fullWidth onClick={onConfirm}>
                {confirmLabel}
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={onCancel}>
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
