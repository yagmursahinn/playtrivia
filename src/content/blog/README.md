# Adding a PlayTrivia Blog Article

## 1. Register metadata

Add an entry to `registry.ts`:

```ts
{
  slug: "your-article-slug",
  title: "Your Article Title",
  description: "SEO meta description (150–160 characters).",
  category: "science", // science | geography | history | general-knowledge
  keywords: ["keyword one", "keyword two"],
  publishDate: "2025-07-01",
  featured: false,
  relatedArticles: ["existing-slug-one", "existing-slug-two"],
  quizPage: "/science",
}
```

## 2. Write section content

Create `posts/your-article-slug.ts`:

```ts
import { defineBlogArticle } from "../template";

export const yourArticle = defineBlogArticle("your-article-slug", {
  introduction: `Opening paragraph with a link to the [Science quiz](/science).`,

  mainContent: `## Section Heading

Your questions and answers here.

### Optional subheading

More content.`,

  triviaTips: `- Tip one
- Tip two
- Link to [solo mode](/solo) for practice.`,
});
```

## 3. Register the article

Import and add to `BLOG_ARTICLES` in `index.ts`.

## Article template structure

| Section | Source | Rendered by |
|---------|--------|-------------|
| Introduction | `sections.introduction` | `BlogContent` |
| Main content | `sections.mainContent` | `BlogContent` (H2/H3) |
| Trivia tips | `sections.triviaTips` | `BlogContent` under "Trivia Tips" H2 |
| Call to action | `quizPage` from registry | `BlogArticleCta` |
| Related articles | `relatedArticles` from registry | `BlogRelatedArticles` |

## Internal linking rules

- **One quiz page** — set `quizPage` in registry; intro should also link to the same category quiz
- **Two related articles** — set `relatedArticles` with exactly two published slugs

## SEO fields (automatic)

Once registered, each article gets:

- Unique `title`, `description`, `keywords`
- Canonical URL (`/blog/{slug}`)
- Open Graph + Twitter Card metadata
- Article JSON-LD structured data
- H1 on page + H2/H3 from markdown content
