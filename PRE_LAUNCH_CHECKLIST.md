# PlayTrivia — Pre-Launch Checklist

Use this checklist before every production deployment. Check each item manually or via the suggested command.

---

## Production Domain Launch (`https://play-trivia.fun`)

- [ ] Domain connected in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set to `https://play-trivia.fun`
- [ ] HTTPS working
- [ ] `www` redirect configured
- [ ] `https://play-trivia.fun/sitemap.xml` opens and lists public routes
- [ ] `https://play-trivia.fun/robots.txt` opens and references the sitemap
- [ ] Open Graph preview tested for `https://play-trivia.fun`
- [ ] Google Search Console connected
- [ ] Bing Webmaster Tools connected

---

## 1. Build & Quality Gates

- [ ] `npm run lint` passes with **0 errors**
- [ ] `npm run build` completes successfully
- [ ] `npm start` serves the production build locally without runtime errors
- [ ] No debug `console.log` / `console.debug` calls in `src/` (only `logError` / `logWarning` via `@/lib/monitoring/errors`)
- [ ] Zustand devtools are **disabled in production** (`src/store/quiz/store.ts`)
- [ ] No `.env` files or secrets are committed to the repository

```bash
npm run lint && npm run build
```

---

## 2. Environment & Hosting

- [ ] **Domain connected in Vercel** (`play-trivia.fun`)
- [ ] **`NEXT_PUBLIC_SITE_URL`** is set to `https://play-trivia.fun`
  - Required for correct canonical URLs, Open Graph links, and sitemap entries
  - Copy from `.env.example` into Vercel → Project → Settings → Environment Variables
- [ ] **HTTPS working** on `https://play-trivia.fun`
- [ ] **`www` redirect configured** (`www.play-trivia.fun` → `play-trivia.fun` or vice versa)
- [ ] Node.js version matches deployment platform requirements
- [ ] Deployment platform build command: `npm run build`
- [ ] Deployment platform start command: `npm start` (or platform default for Next.js)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | **Yes (production)** | Canonical URLs, sitemap, OG/Twitter meta, share fallbacks |
| `VERCEL_URL` | Auto (Vercel) | Preview deployment URL fallback if `NEXT_PUBLIC_SITE_URL` is unset |

---

## 3. SEO & Discoverability

### Metadata

- [ ] Home page (`/`) has unique title, description, Open Graph, and Twitter card
- [ ] Category landing pages have unique metadata:
  - [ ] `/general-knowledge`
  - [ ] `/science`
  - [ ] `/geography`
  - [ ] `/history`
- [ ] Daily Challenge page (`/daily-challenge`) has unique metadata
- [ ] View page source on production — confirm `<title>`, `<meta name="description">`, and OG tags render correctly

### Structured data

- [ ] Home page includes **WebSite** and **Game** JSON-LD
- [ ] Category pages include **Game** JSON-LD
- [ ] FAQ section on home includes **FAQPage** JSON-LD

### Sitemap & robots

- [ ] `/sitemap.xml` is accessible and lists:
  - [ ] `/`
  - [ ] `/daily-challenge`
  - [ ] `/general-knowledge`
  - [ ] `/science`
  - [ ] `/geography`
  - [ ] `/history`
  - [ ] `/solo`
  - [ ] `/multiplayer`
  - [ ] `/privacy`
  - [ ] `/terms`
- [ ] All sitemap URLs use **`https://play-trivia.fun`** (not preview or staging domains)
- [ ] `/sitemap.xml` opens at `https://play-trivia.fun/sitemap.xml`
- [ ] `/robots.txt` opens at `https://play-trivia.fun/robots.txt` and references `https://play-trivia.fun/sitemap.xml`

### Social preview

- [ ] `/opengraph-image` renders the branded preview (PlayTrivia + tagline)
- [ ] Test link previews with `https://play-trivia.fun` ([opengraph.xyz](https://www.opengraph.xyz) or similar)

### Search indexing

- [ ] No `noindex` meta tags on public pages
- [ ] Category landing pages return **200** (not 404)
- [ ] Submit sitemap to **Google Search Console** (post-deploy)
- [ ] Submit sitemap to **Bing Webmaster Tools** (post-deploy)

---

## 4. Routes & Navigation

Verify every public route loads without error:

| Route | Type | Verify |
|-------|------|--------|
| `/` | Home | Hero, FAQ, engagement cards render |
| `/solo` | Solo setup | Category selection works |
| `/multiplayer` | Multiplayer setup | Player name entry works |
| `/play/general-knowledge` | Quiz play | Game starts and questions load |
| `/play/science` | Quiz play | Game starts and questions load |
| `/play/geography` | Quiz play | Game starts and questions load |
| `/play/history` | Quiz play | Game starts and questions load |
| `/play/mixed` | Quiz play | Mixed quiz starts |
| `/play/mixed?daily=1` | Daily Challenge | 10-question daily quiz starts |
| `/general-knowledge` | SEO landing | Title, stats, Start Quiz button |
| `/science` | SEO landing | Title, stats, Start Quiz button |
| `/geography` | SEO landing | Title, stats, Start Quiz button |
| `/history` | SEO landing | Title, stats, Start Quiz button |
| `/daily-challenge` | SEO landing | Links to daily play route |

- [ ] Header logo links back to home from all pages
- [ ] Invalid routes (e.g. `/not-a-category`) return 404
- [ ] Static routes (`/solo`, `/daily-challenge`) take precedence over `/[categorySlug]`

---

## 5. Core Gameplay Smoke Test

Run at least one full quiz per mode on a production-like build:

### Solo quiz

- [ ] Select a category and start a quiz
- [ ] All four round types work: Multiple Choice, Fill in the Blank, Picture Round, Enumeration
- [ ] Answer validation and scoring behave correctly
- [ ] Round intro → questions → feedback → round complete flow works
- [ ] Final results screen shows score, rank, and achievements
- [ ] Play Again / Try Another Category / Home buttons work

### Multiplayer quiz

- [ ] Add 2+ player names and start
- [ ] Player handoff screen appears between turns
- [ ] Final leaderboard ranks players correctly

### Daily Challenge

- [ ] Daily challenge card on home loads today's status
- [ ] Starting daily challenge loads exactly 10 questions
- [ ] Completing daily challenge marks it done for today
- [ ] Streak updates after completion

### Retention features

- [ ] Share Result modal opens (Copy Link, X, WhatsApp, More Options)
- [ ] Share URLs use the production domain
- [ ] Streak and achievement data persist after page reload (localStorage)
- [ ] In-progress quiz resumes after page reload (localStorage)

---

## 6. Picture Round Assets

- [ ] All picture-round PNG assets referenced in `src/lib/quiz/picture-round-registry.ts` exist under `public/images/picture-round/`
- [ ] No missing-image warnings in browser console during Picture Round questions
- [ ] Picture choices display correctly for all four categories + mixed mode
- [ ] Fallback image only appears for genuinely missing assets (not in normal gameplay)

Quick dev-only audit (runs automatically in development, not production):

```bash
npm run dev
# Check terminal for question-bank / picture-round warnings on startup
```

---

## 7. Security & Privacy

- [ ] No API keys, tokens, or secrets in source code or committed env files
- [ ] No authentication or email collection flows exist
- [ ] User-entered content (player names) is rendered as plain text (no `dangerouslySetInnerHTML` for user input)
- [ ] JSON-LD uses `dangerouslySetInnerHTML` only with `JSON.stringify()` of static server data
- [ ] External share links open with `noopener,noreferrer` (`openShareWindow` in `@/lib/retention/share`)
- [ ] localStorage stores only non-sensitive game data:
  - `quizverse-progress` — in-progress quiz state
  - `quizverse-retention` — streaks, achievements, daily challenge date
- [ ] No personal data is transmitted to a backend (app is fully client-side)

---

## 8. Analytics & Error Monitoring (Optional — Wire Post-Launch)

These are prepared but **not required** for initial launch:

- [ ] Register an analytics provider via `setAnalyticsProvider()` in `@/lib/analytics`
  - Events: `quiz_started`, `quiz_completed`, `category_selected`, `daily_challenge_started`
- [ ] Register an error reporter via `setErrorReporter()` in `@/lib/monitoring/errors`
  - Methods: `logError()`, `logWarning()`
- [ ] Confirm production errors do not leak quiz answers or localStorage contents in logs

---

## 9. Performance & UX

- [ ] Home page loads in reasonable time on mobile (3G throttled)
- [ ] Quiz transitions and animations run smoothly on mobile
- [ ] Touch targets are usable on small screens
- [ ] No layout shift on hero / category cards during load
- [ ] Favicon and app icons display correctly in browser tab and bookmarks (`/favicon.ico`, `/apple-touch-icon.png`)

---

## 10. Post-Deploy Verification

Run immediately after deploying to production:

- [ ] Visit `https://play-trivia.fun` — home page loads
- [ ] Complete a short solo quiz end-to-end
- [ ] Check `/sitemap.xml` — URLs match production domain
- [ ] Check `/robots.txt` — sitemap reference is correct
- [ ] Inspect browser console — no errors during normal gameplay
- [ ] Test on mobile Safari and Chrome
- [ ] Test share flow from final results screen
- [ ] Verify Open Graph preview with production URL

---

## 11. Known Launch Risks (Review Before Go-Live)

| Risk | Mitigation |
|------|------------|
| `NEXT_PUBLIC_SITE_URL` not set | Set to `https://play-trivia.fun` in Vercel before first deploy |
| Analytics not connected | Acceptable for v1; wire provider when ready |
| Error monitoring not connected | Default console reporter active until Sentry (or similar) is added |
| localStorage quiz cache after content updates | Bump `QUIZ_DATA_VERSION` in `src/data/quiz/index.ts` when question data changes |
| Missing picture-round PNG | Check dev startup warnings; verify assets in `public/images/picture-round/` |

---

## Quick Pre-Deploy Command Sequence

```bash
# 1. Quality gates
npm run lint
npm run build

# 2. Smoke test production build locally
npm start
# Run section 5 checks against your local dev server (npm run dev)

# 3. Deploy, then run section 10 post-deploy checks on production URL
```

---

**Last updated:** Production domain launch (`https://play-trivia.fun`)
