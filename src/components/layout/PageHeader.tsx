"use client";

import type { IconName } from "@/lib/constants/icons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  className?: string;
};

export function PageHeader({ title, subtitle, icon, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-8 text-center sm:mb-10", className)}>
      {icon && (
        <div className="mb-4 inline-flex">
          <Icon name={icon} size="2xl" />
        </div>
      )}
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-dark sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 font-body text-base font-semibold text-dark/55 sm:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}
