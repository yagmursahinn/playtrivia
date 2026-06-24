import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog/BlogContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, PageContainer } from "@/components/layout";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/content/blog";
import { formatBlogDate } from "@/lib/blog/format-date";
import { buildBlogArticleMetadata } from "@/lib/seo/blog";
import { buildArticleJsonLd } from "@/lib/seo/structured-data";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return buildBlogArticleMetadata(post);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post)} />
      <Header />
      <PageContainer narrow>
        <article>
          <Link
            href="/blog"
            prefetch
            className="font-body text-sm font-bold text-dark/50 transition-colors hover:text-dark"
          >
            ← Back to blog
          </Link>

          <header className="mt-6">
            <time
              dateTime={post.publishedAt}
              className="font-body text-sm font-bold uppercase tracking-wide text-dark/45"
            >
              {formatBlogDate(post.publishedAt)}
            </time>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-dark sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 font-body text-lg font-semibold leading-relaxed text-dark/70">
              {post.description}
            </p>
          </header>

          <div className="mt-8 rounded-3xl border-[3px] border-dark/8 bg-white/90 p-6 sm:p-8">
            <BlogContent content={post.content} />
          </div>
        </article>
      </PageContainer>
    </>
  );
}
