import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Header, PageContainer, PageHeader } from "@/components/layout";
import { getAllBlogArticles } from "@/content/blog";
import { buildBlogIndexMetadata } from "@/lib/seo/blog";

export const metadata = buildBlogIndexMetadata();

export default function BlogIndexPage() {
  const posts = getAllBlogArticles();

  return (
    <>
      <Header />
      <PageContainer narrow>
        <PageHeader
          title="PlayTrivia Blog"
          subtitle="Tips, updates, and trivia insights to help you play smarter."
        />

        <div className="space-y-5 sm:space-y-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </PageContainer>
    </>
  );
}
