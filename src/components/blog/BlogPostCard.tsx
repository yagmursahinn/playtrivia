import Link from "next/link";
import type { BlogArticle } from "@/content/blog";
import { getBlogCategoryConfig, getBlogPostPath } from "@/content/blog";
import { formatBlogDate } from "@/lib/blog/format-date";
import { cn } from "@/lib/utils/cn";

type BlogPostCardProps = {
  post: BlogArticle;
};

const CATEGORY_ACCENTS: Record<BlogArticle["category"], string> = {
  science: "border-blue/25 hover:border-blue/50",
  geography: "border-lime/40 hover:border-lime/70",
  history: "border-pink/25 hover:border-pink/50",
  "general-knowledge": "border-dark/10 hover:border-dark/20",
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  const category = getBlogCategoryConfig(post.category);

  return (
    <article
      className={cn(
        "rounded-3xl border-[3px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(26,26,46,0.08)] transition-colors sm:p-8",
        CATEGORY_ACCENTS[post.category],
        post.featured && "ring-2 ring-pink/20",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-full bg-cream px-3 py-1 font-body text-xs font-extrabold uppercase tracking-wide text-dark/55">
          {category.label}
        </span>
        {post.featured && (
          <span className="rounded-full bg-pink/15 px-3 py-1 font-body text-xs font-extrabold uppercase tracking-wide text-pink">
            Featured
          </span>
        )}
        <span className="font-body text-xs font-semibold text-dark/40">
          {post.readingTime} min read
        </span>
      </div>
      <time
        dateTime={post.publishDate}
        className="mt-3 block font-body text-sm font-bold uppercase tracking-wide text-dark/45"
      >
        {formatBlogDate(post.publishDate)}
      </time>
      <h2 className="mt-3 font-display text-2xl font-extrabold text-dark">
        <Link href={getBlogPostPath(post.slug)} prefetch className="hover:text-pink">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 font-body text-base font-semibold leading-relaxed text-dark/70">
        {post.description}
      </p>
      <Link
        href={getBlogPostPath(post.slug)}
        prefetch
        className="mt-5 inline-flex font-body text-sm font-extrabold text-pink transition-colors hover:text-dark"
      >
        Read article →
      </Link>
    </article>
  );
}
