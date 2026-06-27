# PlayTrivia Blog Editorial Roadmap

Editorial backlog for SEO articles on [PlayTrivia](https://play-trivia.fun). Each published article should:

1. Be registered in `src/content/blog/registry.ts`
2. Provide section content in `src/content/blog/posts/{slug}.ts` via `defineBlogArticle()`
3. Link to one quiz page and two related blog articles
4. Follow the standard template: Introduction → Main content → Trivia tips → CTA → Related articles

---

## Science (12 ideas)

- Top 30 Science Quiz Questions
- Easy Science Quiz for Beginners
- Hard Science Trivia Questions
- Space Quiz Questions and Answers
- Biology Quiz Questions
- Chemistry Trivia Questions
- Physics Quiz Questions
- Earth Science Trivia
- Human Body Quiz Questions
- Periodic Table Quiz
- Science Quiz for Kids
- Environmental Science Trivia

## Geography (12 ideas)

- Country Quiz Questions
- World Capitals Quiz
- Flags Quiz Questions
- Geography Trivia for Adults
- Europe Quiz Questions
- Asia Geography Quiz
- Africa Geography Trivia
- US States and Capitals Quiz
- Rivers of the World Quiz
- Mountain Ranges Quiz
- World Landmarks Trivia
- Easy Geography Quiz

## History (10 ideas)

- Ancient History Quiz Questions
- World War II Quiz
- Roman Empire Trivia
- Medieval History Quiz
- History Trivia Questions and Answers
- American History Quiz
- Egyptian History Trivia
- Cold War Quiz Questions
- Famous Leaders in History Quiz
- Industrial Revolution Trivia

## General Knowledge (10 ideas)

- Pub Quiz Questions
- Family Quiz Questions
- Fun Trivia Questions for Parties
- Random Quiz Questions
- Easy Trivia for Beginners
- Hard General Knowledge Quiz
- Pop Culture Trivia Questions
- Food and Drink Quiz
- Music Trivia Questions
- Movie Quiz Questions

---

## Publishing checklist

When turning a roadmap item into a live article:

- [ ] Add metadata to `registry.ts` (slug, title, description, category, keywords, publishDate, featured, relatedArticles, quizPage)
- [ ] Create `posts/{slug}.ts` with `introduction`, `mainContent`, and `triviaTips`
- [ ] Register the article import in `src/content/blog/index.ts`
- [ ] Confirm internal links: one quiz page + two related article slugs
- [ ] Run `npm run build` and verify `/blog/{slug}` renders correctly

---

**Total backlog: 44 article ideas**
