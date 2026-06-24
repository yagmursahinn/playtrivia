import Link from "next/link";
import type { BlogPost } from "@/content/blog";
import { getBlogPostPath } from "@/content/blog";
import { formatBlogDate } from "@/lib/blog/format-date";

type BlogPostCardProps = {
  post: BlogPost;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="rounded-3xl border-[3px] border-dark/8 bg-white/90 p-6 shadow-[0_8px_32px_rgba(26,26,46,0.08)] transition-colors hover:border-pink/40 sm:p-8">
      <time
        dateTime={post.publishedAt}
        className="font-body text-sm font-bold uppercase tracking-wide text-dark/45"
      >
        {formatBlogDate(post.publishedAt)}
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
