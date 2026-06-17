# Rebrand Report: QuizVerse → PlayTrivia

**Date:** June 2026  
**Scope:** Visible branding, metadata, SEO, share text, and asset labels  
**Unchanged:** Routes, functionality, design system, colors, animations, icons, localStorage keys, npm package name

---

## Summary

All user-visible **QuizVerse** branding has been replaced with **PlayTrivia**. Production domain: **`https://play-trivia.fun`**. The central constant `SITE_NAME` in `src/lib/seo/site.ts` drives browser titles, Open Graph, Twitter cards, JSON-LD, and the OG image template. Absolute URLs resolve via `NEXT_PUBLIC_SITE_URL` (see `.env.example`).

**Build status:** `npm run build` passes after rebrand.

---

## Updated Files

### Core branding & SEO (10 files)

| File | Changes |
|------|---------|
| `src/lib/seo/site.ts` | `SITE_NAME` → `"PlayTrivia"` |
| `src/lib/seo/faq.ts` | FAQ questions and answers |
| `src/lib/seo/metadata.ts` | Daily Challenge meta description |
| `src/lib/seo/structured-data.ts` | Daily Challenge JSON-LD name and description |
| `src/lib/retention/share.ts` | Share message text and native share title |
| `src/components/layout/Header.tsx` | Logo icon (`P`), logo text (`Play` + `Trivia`) |
| `src/components/quiz/FinalResultScreen.tsx` | “Return to the PlayTrivia homepage” |
| `src/store/quiz/store.ts` | DevTools store name → `PlayTriviaStore` |
| `src/content/questions/index.ts` | Dev audit log/error prefixes → `[PlayTrivia]` |
| `PRE_LAUNCH_CHECKLIST.md` | Title, OG checklist item, example domain |

### Inherited at runtime (no direct edits — use `SITE_NAME`)

| File | Effect |
|------|--------|
| `src/app/layout.tsx` | Browser title: `PlayTrivia — Challenge Your Knowledge` |
| `src/app/opengraph-image.tsx` | OG image headline |
| `src/app/page.tsx` | Home metadata via `buildHomeMetadata()` |
| `src/app/daily-challenge/page.tsx` | Daily Challenge metadata |
| `src/app/[categorySlug]/page.tsx` | Category landing metadata |
| `src/lib/seo/categories.ts` | Category titles append `\| PlayTrivia` via metadata helper |

### Public assets (21 files)

| File | Changes |
|------|---------|
| `public/images/picture-round/science/expected-assets.json` | Note text |
| `public/images/picture-round/general-knowledge/1.svg` | `aria-label` |
| `public/images/picture-round/geography/1.svg` | `aria-label` |
| `public/images/picture-round/science/1.svg` | `aria-label` |
| `public/images/picture-round/history/1.svg` | `aria-label` |
| `public/images/quiz/general-1.svg` | Visible placeholder text |
| `public/images/quiz/general-2.svg` | Visible placeholder text |
| `public/images/quiz/general-3.svg` | Visible placeholder text |
| `public/images/quiz/general-4.svg` | Visible placeholder text |
| `public/images/quiz/science-1.svg` | Visible placeholder text |
| `public/images/quiz/science-2.svg` | Visible placeholder text |
| `public/images/quiz/science-3.svg` | Visible placeholder text |
| `public/images/quiz/science-4.svg` | Visible placeholder text |
| `public/images/quiz/geography-1.svg` | Visible placeholder text |
| `public/images/quiz/geography-2.svg` | Visible placeholder text |
| `public/images/quiz/geography-3.svg` | Visible placeholder text |
| `public/images/quiz/geography-4.svg` | Visible placeholder text |
| `public/images/quiz/history-1.svg` | Visible placeholder text |
| `public/images/quiz/history-2.svg` | Visible placeholder text |
| `public/images/quiz/history-3.svg` | Visible placeholder text |
| `public/images/quiz/history-4.svg` | Visible placeholder text |

### Scripts (1 file)

| File | Changes |
|------|---------|
| `scripts/process-icon-backgrounds.mjs` | Comment reference |

---

## Intentionally unchanged

| Item | Reason |
|------|--------|
| `quizverse-progress` localStorage key | Preserves in-progress quiz saves |
| `quizverse-retention` localStorage key | Preserves streaks and achievements |
| `package.json` / `package-lock.json` name | Internal npm identifier, not user-visible |
| Routes (`/solo`, `/play/...`, etc.) | Per requirement |
| `SITE_TAGLINE` (“Challenge Your Knowledge”) | Tagline retained |
| Design tokens, colors, animations, icon set | Per requirement |

---

## Verification

```bash
# No visible QuizVerse branding should remain in src/ or public/
rg 'QuizVerse' src public PRE_LAUNCH_CHECKLIST.md

# Build
npm run build
```

Expected: zero `QuizVerse` matches in user-facing paths; only internal `quizverse-*` storage keys remain.
