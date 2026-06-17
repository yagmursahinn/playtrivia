"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonHover, buttonTap, transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "lg" | "xl";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-pink text-dark shadow-[0_6px_0_0_#e040b8,0_12px_24px_rgba(251,100,208,0.35)] hover:shadow-[0_4px_0_0_#e040b8,0_8px_20px_rgba(251,100,208,0.4)]",
  secondary:
    "bg-blue text-dark shadow-[0_6px_0_0_#3a96e8,0_12px_24px_rgba(89,176,247,0.35)] hover:shadow-[0_4px_0_0_#3a96e8,0_8px_20px_rgba(89,176,247,0.4)]",
  outline:
    "bg-cream border-[3px] border-dark/15 text-dark shadow-[0_4px_0_0_rgba(26,26,46,0.12)] hover:border-dark/25",
  ghost: "bg-transparent text-dark hover:bg-dark/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
  xl: "h-16 px-10 text-xl",
};

const linkMotionProps = {
  whileHover: buttonHover,
  whileTap: buttonTap,
  transition: transitions.micro,
  style: { willChange: "transform" as const },
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-bold tracking-tight",
    "transition-shadow duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40",
    "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && props.href) {
    const { href, prefetch = true, ...linkProps } = props;

    return (
      <motion.div
        {...linkMotionProps}
        className={cn(fullWidth && "w-full", !fullWidth && "inline-flex")}
      >
        <Link href={href} prefetch={prefetch} className={classes} {...linkProps}>
          {children}
        </Link>
      </motion.div>
    );
  }

  const { type = "button", disabled, onClick, ...rest } = props as ButtonAsButton;

  return (
    <motion.div
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={transitions.micro}
      style={{ willChange: "transform" }}
      className={cn(fullWidth && "w-full", !fullWidth && "inline-flex")}
    >
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    </motion.div>
  );
}
