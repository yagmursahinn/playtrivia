import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type BlogArticleBreadcrumbProps = {
  title: string;
  className?: string;
};

export function BlogArticleBreadcrumb({ title, className }: BlogArticleBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm font-semibold text-dark/45">
        <li>
          <Link href="/" prefetch className="transition-colors hover:text-dark">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/blog" prefetch className="transition-colors hover:text-dark">
            Blog
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-dark/70" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
