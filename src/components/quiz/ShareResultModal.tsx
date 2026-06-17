"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildShareMessage,
  buildTwitterShareUrl,
  buildWhatsAppShareUrl,
  copyShareResult,
  getShareUrl,
  isNativeShareSupported,
  openShareWindow,
  shareWithNativeApi,
  type ShareResultPayload,
} from "@/lib/retention/share";
import { fadeIn, scaleIn, transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type ShareResultModalProps = {
  open: boolean;
  score: number;
  rankTitle: string;
  onClose: () => void;
  onCopied: () => void;
  onShareError?: (message: string) => void;
};

type ShareActionProps = {
  label: string;
  description: string;
  accent?: "pink" | "blue" | "lime" | "cream";
  disabled?: boolean;
  onClick: () => void;
};

function ShareAction({
  label,
  description,
  accent = "cream",
  disabled = false,
  onClick,
}: ShareActionProps) {
  const accentStyles = {
    pink: "border-pink/30 bg-pink/10 hover:border-pink/45",
    blue: "border-blue/30 bg-blue/10 hover:border-blue/45",
    lime: "border-lime/40 bg-lime/10 hover:border-lime/55",
    cream: "border-dark/10 bg-white/85 hover:border-dark/20",
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -1, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={transitions.micro}
      className={cn(
        "w-full rounded-2xl border-[3px] p-4 text-left transition-shadow duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40",
        disabled
          ? "cursor-not-allowed opacity-45"
          : "shadow-[0_6px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_10px_28px_rgba(26,26,46,0.1)]",
        accentStyles[accent],
      )}
    >
      <p className="font-display text-base font-extrabold text-dark">{label}</p>
      <p className="mt-1 font-body text-sm font-semibold text-dark/55">{description}</p>
    </motion.button>
  );
}

export function ShareResultModal({
  open,
  score,
  rankTitle,
  onClose,
  onCopied,
  onShareError,
}: ShareResultModalProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isNativeSharing, setIsNativeSharing] = useState(false);

  const payload = useMemo<ShareResultPayload>(
    () => ({ score, rankTitle }),
    [score, rankTitle],
  );

  const shareUrl = open ? getShareUrl() : "";
  const nativeShareSupported = open && isNativeShareSupported();

  const previewMessage = buildShareMessage(payload);

  const handleCopyLink = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      await copyShareResult(payload);
      onCopied();
    } catch {
      onShareError?.("Unable to copy link right now.");
    } finally {
      setIsCopying(false);
    }
  };

  const handleShareOnX = () => {
    openShareWindow(buildTwitterShareUrl(payload));
  };

  const handleShareOnWhatsApp = () => {
    openShareWindow(buildWhatsAppShareUrl(payload));
  };

  const handleMoreOptions = async () => {
    if (!nativeShareSupported || isNativeSharing) return;
    setIsNativeSharing(true);
    try {
      await shareWithNativeApi(payload);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      onShareError?.("Unable to open share options right now.");
    } finally {
      setIsNativeSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Close share panel"
            className="absolute inset-0 bg-dark/45"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            transition={transitions.fast}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-result-title"
            className="relative z-10 w-full max-w-lg rounded-t-3xl border-[3px] border-dark/10 bg-cream p-5 shadow-[0_-8px_40px_rgba(26,26,46,0.15)] sm:mx-4 sm:rounded-3xl sm:p-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={scaleIn}
            transition={transitions.fast}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-pink">
                  Quiz Complete
                </p>
                <h2 id="share-result-title" className="mt-1 font-display text-2xl font-extrabold text-dark">
                  Share your result
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border-2 border-dark/10 bg-white/80 px-3 py-1.5 font-body text-sm font-bold text-dark/60 transition-colors hover:border-dark/20 hover:text-dark"
              >
                Close
              </button>
            </div>

            <div className="rounded-2xl border-2 border-dark/10 bg-white/85 p-4">
              <p className="font-body text-sm font-semibold leading-relaxed text-dark/70">
                {previewMessage}
              </p>
              {shareUrl ? (
                <p className="mt-3 break-all font-body text-xs font-semibold text-dark/45">{shareUrl}</p>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3">
              <ShareAction
                label={isCopying ? "Copying..." : "Copy Link"}
                description="Copy your result message and link."
                accent="pink"
                onClick={handleCopyLink}
              />
              <ShareAction
                label="Share on X"
                description="Post your score on X."
                accent="blue"
                onClick={handleShareOnX}
              />
              <ShareAction
                label="WhatsApp"
                description="Send your result to friends."
                accent="lime"
                onClick={handleShareOnWhatsApp}
              />
              {nativeShareSupported ? (
                <ShareAction
                  label={isNativeSharing ? "Opening..." : "More Options"}
                  description="Use your device share menu."
                  onClick={handleMoreOptions}
                />
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
