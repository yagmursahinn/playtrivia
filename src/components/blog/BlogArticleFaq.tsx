import { BlogInlineText } from "./BlogInlineText";
import type { BlogFaqItem } from "@/content/blog/types";
import { cn } from "@/lib/utils/cn";

type BlogArticleFaqProps = {
  items: BlogFaqItem[];
  className?: string;
};

export function BlogArticleFaq({ items, className }: BlogArticleFaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "mt-8 rounded-3xl border-[3px] border-dark/8 bg-white/90 px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-5 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="font-display text-lg font-extrabold text-dark sm:text-xl">
              {item.question}
            </h3>
            <p className="mt-2 font-body text-base font-semibold leading-relaxed text-dark/75">
              <BlogInlineText text={item.answer} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
