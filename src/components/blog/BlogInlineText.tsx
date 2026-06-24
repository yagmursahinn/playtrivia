import Link from "next/link";
import type { ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

type BlogInlineTextProps = {
  text: string;
};

export function BlogInlineText({ text }: BlogInlineTextProps) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = match[2];
    const isInternal = href.startsWith("/");

    parts.push(
      isInternal ? (
        <Link key={`${href}-${match.index}`} href={href} prefetch className="font-bold text-pink hover:text-dark">
          {label}
        </Link>
      ) : (
        <a
          key={`${href}-${match.index}`}
          href={href}
          className="font-bold text-pink hover:text-dark"
          rel="noopener noreferrer"
          target="_blank"
        >
          {label}
        </a>
      ),
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
