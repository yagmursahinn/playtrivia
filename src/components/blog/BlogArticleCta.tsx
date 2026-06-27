import Link from "next/link";
import { BLOG_CATEGORIES } from "@/content/blog/categories";
import { getBlogPostPath } from "@/content/blog";
import type { BlogArticleMeta, BlogQuizPage } from "@/content/blog/types";
import { cn } from "@/lib/utils/cn";

type BlogArticleCtaProps = {
  quizPage: BlogQuizPage;
  quizLabel?: string;
  headline?: string;
  linkText?: string;
  className?: string;
};

function resolveQuizLabel(quizPage: BlogQuizPage): string {
  if (quizPage === "/solo") {
    return "PlayTrivia Quiz";
  }

  const category = Object.values(BLOG_CATEGORIES).find((entry) => entry.quizPage === quizPage);
  return category?.quizLabel ?? "Quiz";
}

export function BlogArticleCta({
  quizPage,
  quizLabel,
  headline = "Ready to test yourself?",
  linkText,
  className,
}: BlogArticleCtaProps) {
  const resolvedLabel = quizLabel ?? resolveQuizLabel(quizPage);
  const ctaText = linkText ?? `Play the ${resolvedLabel}`;

  return (
    <aside
      className={cn(
        "mt-8 rounded-3xl border-[3px] border-pink/30 bg-pink/10 px-6 py-6 text-center sm:px-8 sm:py-8",
        className,
      )}
    >
      <p className="font-display text-xl font-extrabold text-dark sm:text-2xl">{headline}</p>
      <Link
        href={quizPage}
        prefetch
        className="mt-4 inline-flex font-body text-base font-extrabold text-pink transition-colors hover:text-dark sm:text-lg"
      >
        {ctaText} →
      </Link>
    </aside>
  );
}

type BlogRelatedArticlesProps = {
  articles: BlogArticleMeta[];
  className?: string;
};

export function BlogRelatedArticles({ articles, className }: BlogRelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "mt-6 rounded-3xl border-[3px] border-dark/8 bg-white/90 px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">Related articles</h2>
      <ul className="mt-4 space-y-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={getBlogPostPath(article.slug)}
              prefetch
              className="font-body text-base font-bold text-pink transition-colors hover:text-dark"
            >
              {article.title} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
