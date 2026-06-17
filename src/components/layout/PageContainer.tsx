import { cn } from "@/lib/utils/cn";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "relative z-10 mx-auto w-full flex-1 px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-8",
        narrow ? "max-w-2xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </main>
  );
}
