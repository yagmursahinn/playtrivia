import Link from "next/link";
import { SITE_NAME } from "@/lib/seo/site";
import { cn } from "@/lib/utils/cn";

const FOOTER_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "relative z-10 mt-auto w-full border-t border-dark/10 bg-cream/95 px-4 py-8 sm:px-6",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="font-body text-sm font-semibold text-dark/50">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className="font-body text-sm font-bold text-dark/60 transition-colors hover:text-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
