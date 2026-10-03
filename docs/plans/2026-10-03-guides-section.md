# Guides section — implementation plan

Date: 3 October 2026 (Australia/Sydney). Status: in progress.
Brief: the owner's Guides request (20 articles, library, navigation, SEO, verification). Related rules: `AGENTS.md`, `inputs/sarallabs-website-build-prompt-v3.md` (content integrity, SEO, accessibility, §7.1 checks).

## Repository findings (not live-verified)

- Static site: `src/*.html`, one `styles.css` (cascade layers), one `app.js`, no framework or runtime dependency.
- `scripts/build.mjs` copies `src/` to `dist/`. The preview target injects `noindex` and a blanket `Disallow`; the production target leaves public pages indexable. It only handles top-level `.html` files today.
- `scripts/check-publish.mjs` checks `dist/` but only top-level files (`readdir` is not recursive). It must cover nested article files.
- `tests/site.test.mjs` reads top-level `src/*.html` only. It checks one H1, metadata, local references, form behaviour, indexing and headers.
- `docs/url-inventory.csv` marks the core pages `live`. `docs/publishing-approvals.json` has every gate approved. `docs/claims.md` approves only: audience and offer, Sydney/Australia, generic "Proven industry experience" (no number), enquiry address, seven-year retention, ABN deferred.
- Existing pages use relative links (`services.html`). Nested article pages need root-relative links.
- CSP: `script-src 'self'` plus two hashes for the home and services JSON-LD blocks. JSON-LD (`application/ld+json`) is a data block, not executable script, so article JSON-LD needs no new hash. `firebase.json` is not modified.

## Design decisions

1. **Source of truth.** `content/guides/guides.json` (metadata and status) plus one HTML fragment per article in `content/guides/<slug>.html`. Authors write semantic HTML only: `h2` sections, lists, tables, `<pre>` blocks.
2. **Rendering.** `scripts/guides.mjs` is a pure module: validates the manifest, builds the contents list from `h2` headings, adds `data-label` attributes so tables stack on narrow screens, and returns full pages. `build.mjs` writes `dist/guides.html`, `dist/guides/*.html` and an extended `dist/sitemap.xml`. Tests import the same module, so they validate what ships.
3. **Drafts.** `status: "draft"` articles are never rendered, linked, listed or put in the sitemap. Published articles also need `guidesEditorialApproved` in `docs/publishing-approvals.json` before `check:production` passes, because Shishir has not reviewed the copy. This is deliberate: it keeps the existing gate meaningful.
4. **Authorship.** "By Saral Forge". No "reviewed by" claim.
5. **Styles.** A new `guides` block in `styles.css` reusing existing tokens, layers and chapter classes. No new colours, so no new contrast pairs.
6. **Navigation.** Guides added to the primary nav and footer of every page. The homepage gets a compact three-guide section before the about section. Services gets two or three guide links per service. About gets a "Before you build" reading list.
7. **No new dependency, tracker, font or service.**

## Stages and checkpoints

1. Shared module, template, styles, manifest, library, nav and footer, tests. First five articles (1, 6, 11, 16, 19) integrated and previewed. Review checkpoint with the named reviewers.
2. Remaining 15 articles in three batches (A/B, C, D), each rebuilt and tested.
3. Homepage, Services, About links; sitemap; URL inventory; `llms.txt`; editorial map; contributor guide.
4. Full verification: `npm test`, `npm run build`, `npm run check:contrast`, production publishing check, browser checks at 320/768/1440 px (keyboard, menu, contents links, no-JS, reduced motion, forced colours), then the four named reviewers, then fixes and re-checks.

## Research method (recorded honestly in `docs/guides-editorial-map.md`)

- Primary sources fetched for the technical claims (Google Search Central, W3C WAI, OWASP and similar).
- A search-results scan per article question to refine the wording. Search phrases remain hypotheses; no volume or ranking claims are made.
- Anything not checked against a source is written as general guidance with no figures, or left out.

## Out of scope

Deployment, analytics, Search Console monitoring (to be agreed after publication), new fonts, imagery, a CMS.
