"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => {
      setMessage((current) => (current === nextMessage ? null : current));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={transitions.fast}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4"
          >
            <div
              className={cn(
                "rounded-2xl border-2 border-dark/10 bg-white/95 px-4 py-3",
                "shadow-[0_12px_32px_rgba(26,26,46,0.12)] backdrop-blur-sm",
              )}
            >
              <p className="font-body text-sm font-semibold text-dark">{message}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
