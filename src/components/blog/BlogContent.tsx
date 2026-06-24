import { BlogInlineText } from "./BlogInlineText";

type BlogContentProps = {
  content: string;
};

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

function parseBlogContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const sections = content.trim().split(/\n\n+/);

  for (const section of sections) {
    const lines = section.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    if (lines[0].startsWith("## ")) {
      blocks.push({ type: "heading", text: lines[0].slice(3).trim() });
      const remainder = lines.slice(1);
      if (remainder.length === 1 && !remainder[0].startsWith("- ")) {
        blocks.push({ type: "paragraph", text: remainder[0] });
      } else if (remainder.length > 0) {
        appendLines(blocks, remainder);
      }
      continue;
    }

    appendLines(blocks, lines);
  }

  return blocks;
}

function appendLines(blocks: ContentBlock[], lines: string[]) {
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
}

export function BlogContent({ content }: BlogContentProps) {
  const blocks = parseBlogContent(content);

  return (
    <div className="space-y-5 font-body text-base font-semibold leading-relaxed text-dark/80">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={`${block.text}-${index}`}
              className="pt-2 font-display text-xl font-extrabold text-dark sm:text-2xl"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>
                  <BlogInlineText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.text.slice(0, 24)}-${index}`}>
            <BlogInlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
