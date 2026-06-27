import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleBreadcrumb } from "@/components/blog/BlogArticleBreadcrumb";
import { BlogArticleCta, BlogRelatedArticles } from "@/components/blog/BlogArticleCta";
import { BlogArticleFaq } from "@/components/blog/BlogArticleFaq";
import { BlogContent } from "@/components/blog/BlogContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, PageContainer } from "@/components/layout";
import {
  getAllBlogSlugs,
  getBlogArticleBySlug,
  getBlogCategoryConfig,
  getRelatedArticlesForSlug,
} from "@/content/blog";
import { formatBlogDate } from "@/lib/blog/format-date";
import { buildBlogArticleMetadata } from "@/lib/seo/blog";
import { buildArticleJsonLd, buildBlogBreadcrumbJsonLd, buildBlogFaqJsonLd } from "@/lib/seo/structured-data";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildBlogArticleMetadata(article);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getBlogCategoryConfig(article.category);
  const relatedArticles = getRelatedArticlesForSlug(slug);

  const jsonLd = [
    buildArticleJsonLd(article),
    buildBlogBreadcrumbJsonLd(article),
    ...(article.faq?.length ? [buildBlogFaqJsonLd(article.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <PageContainer narrow>
        <article>
          <BlogArticleBreadcrumb title={article.title} />

          <Link
            href="/blog"
            prefetch
            className="mt-4 inline-block font-body text-sm font-bold text-dark/50 transition-colors hover:text-dark"
          >
            ← Back to blog
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="rounded-full bg-cream px-3 py-1 font-body text-xs font-extrabold uppercase tracking-wide text-dark/55">
                {category.label}
              </span>
              <span className="font-body text-xs font-semibold text-dark/40">
                {article.readingTime} min read
              </span>
            </div>
            <time
              dateTime={article.publishDate}
              className="mt-3 block font-body text-sm font-bold uppercase tracking-wide text-dark/45"
            >
              {formatBlogDate(article.publishDate)}
            </time>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-dark sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 font-body text-lg font-semibold leading-relaxed text-dark/70">
              {article.description}
            </p>
          </header>

          <div className="mt-8 rounded-3xl border-[3px] border-dark/8 bg-white/90 p-6 sm:p-8">
            <BlogContent content={article.content} />
          </div>

          {article.faq && article.faq.length > 0 && <BlogArticleFaq items={article.faq} />}

          <BlogArticleCta
            quizPage={article.quizPage}
            headline={article.ctaHeadline}
            linkText={article.ctaLinkText}
          />
          <BlogRelatedArticles articles={relatedArticles} />
        </article>
      </PageContainer>
    </>
  );
}
