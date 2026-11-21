# Marketing refresh — 21 November 2026

Source: marketing review in chat on 21 November 2026. Shishir asked to apply it, commit, push and deploy.

## In scope (uses only approved claims)

1. Home hero: customer-first H1 and lede that name websites, practical AI and small businesses. Remove the "Proven" box. Add a "Recently delivered" proof strip that links to the two live client sites.
2. Home order: move Selected work directly after the hero so proof comes before the service range. Renumber kickers.
3. Plain-English copy on Home, Services, About and Work. Replace studio jargon with customer outcomes. Make AI concrete through example jobs. "Proven industry experience" stays at most once on Home.
4. Searchable page titles and descriptions for Home, Services, Work and About.
5. A 1200 × 630 share image built from the unaltered approved logo. Used for `og:image` and `twitter:image` on every page, including generated guides.
6. Start form: optional "What do you need help with?" and "When would you like to start?" selects. Both are included in the email body. They stay disabled without JavaScript, like the other controls.
7. Fix the duplicate skip link and scroll-progress bar on Services.

## Out of scope (needs Shishir's input)

Founder section, prices and packages, analytics, booking link, domain email, client quotes and screenshots, Search Console and Google Business Profile.

## Verification

- Regression tests first for the hero proof strip, the share image and the new form fields.
- `npm test`, `npm run check:production`, then a browser check at 320, 768 and 1440 px.
- Reviewers: content-claims, a11y-responsive and perf-seo, run in parallel. Verify their findings, fix what is warranted, then deploy with `npm run deploy:production`.
