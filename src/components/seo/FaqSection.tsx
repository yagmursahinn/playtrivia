import { FAQ_ITEMS } from "@/lib/seo/faq";
import { cn } from "@/lib/utils/cn";

type FaqSectionProps = {
  className?: string;
  title?: string;
};

export function FaqSection({
  className,
  title = "Frequently Asked Questions",
}: FaqSectionProps) {
  return (
    <section className={cn("w-full", className)} aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-pink">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="mt-2 font-display text-3xl font-extrabold text-dark sm:text-4xl"
        >
          {title}
        </h2>

        <div className="mt-6 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border-[3px] border-dark/10 bg-white/85 p-4 shadow-[0_6px_20px_rgba(26,26,46,0.06)]"
            >
              <summary className="cursor-pointer list-none font-display text-base font-extrabold text-dark marker:content-none sm:text-lg">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-pink transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 font-body text-sm font-semibold leading-relaxed text-dark/60 sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
