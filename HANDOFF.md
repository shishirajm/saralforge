# Saral Labs website implementation handoff

## Deployment update — 26 September 2026

The user asked to deploy this site and confirmed that the owned domain is `saralforge.com`, with future product subdomains at `trellis.saralforge.com` and `planbox.saralforge.com`.

- A dedicated GCP project, `saralforge-web-prod`, now exists under organisation `1061246246516`. Billing is enabled and Firebase has been added.
- A non-indexed, 30-day Firebase preview was deployed at `https://saralforge-web-prod--preview-xj1a3fpm.web.app` and expires on 26 October 2026 (Australia/Sydney).
- `saralforge.com` and `www.saralforge.com` have not been connected. The production publishing gate still blocks the custom-domain cutover.
- A monthly A$15 budget alert is scoped to `saralforge-web-prod`, approximating the requested US$10 amount. Alerts trigger at 50%, 90%, actual 100% and forecast 100%; this is not a hard spend cap.
- The domain registration and public Cloud DNS zone currently remain in `trellis-app-504909`. That project also contains Trellis-labelled Terraform state, so it was not repurposed or renamed during this release.
- Production URL metadata now uses `https://saralforge.com` rather than the superseded `sarallabs.com` value.
- Deployment source and checks are defined in `package.json`, `firebase.json`, `.firebaserc`, `scripts/`, `tests/`, `docs/url-inventory.csv`, `docs/publishing-approvals.json`, and `docs/plans/2026-09-26-gcp-firebase-deployment.md`.
- The project has no Git repository. `dist/` is disposable output from `npm run build`.

The primary audience and offer, final claims/copy, Sydney/Australia identity and intended contact address are now recorded as approved. ABN publication is deferred. Before connecting the custom domain, approve the enquiry retention period and implement and test the chosen contact delivery path. Then remove the preview crawl blocks, run `npm run check:production`, deploy the live channel, connect the apex in Firebase Hosting, and configure `www` as a redirect to the apex.

Use `npm run deploy:preview` and `npm run deploy:production`; do not use a bare `firebase deploy`. `.firebaserc` deliberately has no default project so an accidental deploy without an explicit target fails. A CI-enforced production gate still depends on creating a Git repository and deployment workflow.

Updated: 20 September 2026 (Australia/Sydney)

## User objective

The user asked to remove the earlier generated implementation, keep `inputs/sarallabs-website-build-prompt-v3.md`, and restart the website implementation in `src/`. They also explicitly required the supplied `inputs/logo.png` to be used.

The user previously asked to uninstall the Superpowers plugin. It was removed with:

```text
codex plugin remove superpowers@claude-plugins-official --json
```

Do not reinstall or invoke Superpowers unless the user explicitly changes that instruction.

## Authoritative project instructions

- Read `AGENTS.md` before further work.
- The authoritative brief is `inputs/sarallabs-website-build-prompt-v3.md`.
- `inputs/index.html` and `inputs/services.html` are historical explorations and must not guide the new design.
- Keep all implementation work in `src/` unless the user asks otherwise.
- Do not publish until the current deployment gate passes. Audience/offer, final copy/claims, Sydney/Australia identity and the intended contact address are approved; retention and end-to-end contact delivery remain unresolved.

The `sites:sites-building` skill was used for the implementation. Its source is:

```text
/Users/shishir/.codex/plugins/cache/openai-bundled/sites/0.1.70/skills/sites-building/SKILL.md
```

## Clean restart already performed

The interrupted first attempt was removed before this implementation began. These old generated files were deleted:

- `docs/superpowers/plans/2026-09-20-sarallabs-site.md`
- the earlier `package.json`
- `src/content.mjs`
- `src/render.mjs`
- `tests/site.test.mjs`

Do not restore those files.

## Current implementation

The fresh dependency-free static site is in `src/`:

- `src/index.html`
- `src/services.html`
- `src/work.html`
- `src/products.html`
- `src/about.html`
- `src/start.html`
- `src/privacy.html`
- `src/terms.html`
- `src/404.html`
- `src/styles.css`
- `src/app.js`
- `src/design-tokens.json`
- `src/check-contrast.mjs`
- `src/robots.txt`
- `src/sitemap.xml`
- `src/llms.txt`
- `src/.well-known/security.txt`
- `src/assets/saral-labs-logo.png`
- `src/assets/saral-labs-logo-display.jpg`
- `src/assets/favicon.png`

### Design and behaviour implemented

- Editorial Growth visual system using ink, warm paper, gold, yellow and orange.
- Asymmetrical editorial hero with SVG contour/growth paths.
- Tangled to Simple SVG section.
- Alternating dark and warm-paper chapters.
- Responsive navigation with a no-JavaScript fallback.
- Light/dark theme control on desktop, with guarded `localStorage` access.
- Reduced-motion, reduced-transparency, forced-colour and increased-contrast styles.
- Focus styles adjusted for dark, light and gold surfaces.
- Responsive compositions for 320 px, 768 px and 1440 px.
- Project brief form that validates locally only. Form controls are disabled by default and enabled only after the local submit handler is installed, preventing personal details from leaking through a no-JavaScript GET fallback.
- Project form success text explicitly says the brief was not sent or stored.
- Unique H1s, page titles, descriptions, canonical URLs and Open Graph metadata.
- Home page ProfessionalService JSON-LD.
- Preview is protected with `noindex, nofollow` and `robots.txt` currently disallows all crawling.

### Logo handling

- `src/assets/saral-labs-logo.png` is a byte-for-byte copy of `inputs/logo.png`.
- The original supplied image is preserved unchanged.
- A visually equivalent 1200 × 648 JPEG derivative (`saral-labs-logo-display.jpg`, about 115 KB) is used for page rendering to avoid serving the 1.6 MB original as the LCP asset.
- A padded 64 × 64 favicon derivative is used for the favicon.
- The full lockup is shown intact in the header, hero and footer. The earlier circular crop treatment was removed after review.

## Content and publishing status

On 26 September 2026, Shishir approved the audience and leading offer as small business owners needing websites and practical AI/LLM solutions. Shishir also approved the final copy/claims and the Sydney/Australia identity, provided `forgesaral@gmail.com` as the intended contact destination, and explicitly deferred adding an ABN.

To avoid publishing unsupported claims:

- The hero calls the current positioning a “Draft audience direction”.
- Project cards are labelled “Illustrative workflow”, “Proposed output”, “Evidence pending approval”, or “Status pending approval”.
- Planbox and Trellis are presented only as directions awaiting approval.
- Client names, testimonials, metrics, ABN, contact details, retention claims, experience years and employer names are absent.
- The site remains `noindex, nofollow` and the contact form does not transmit.

Before publication, the next agent must:

1. Obtain approval for the enquiry retention period.
2. Implement and test the chosen contact delivery path to `forgesaral@gmail.com`.
3. Remove preview/noindex protections only as part of the approved production release.
4. Keep unverified project evidence and product statuses labelled as illustrative or pending approval.

## Reviews already completed

Three read-only reviews were run as required by `AGENTS.md`:

- accessibility/responsive review
- performance/SEO review
- code-quality/content-claims review

The following high-priority findings were fixed:

- Mobile navigation now remains usable without JavaScript.
- The form cannot transmit entered personal data when JavaScript is unavailable or initialisation fails.
- `localStorage` failures no longer stop navigation, reveals or form initialisation.
- Escape closes the mobile menu and returns focus to the menu toggle.
- Mobile Tangled to Simple labels no longer overflow or clip.
- The hard 20rem body minimum was removed for zoom/reflow.
- Surface-aware focus rings were added.
- Reduced-transparency light-theme specificity was fixed.
- In-page service anchors have a fixed-header offset.
- `prefers-contrast: more` support was added.
- The 1.6 MB source logo was replaced in page rendering by a 115 KB derivative while preserving the original unchanged.
- Unsupported client/product claims were converted into clearly labelled draft directions.
- Secondary canonical and Open Graph metadata were added.

Medium items intentionally left for later factual/design approval:

- Clean extensionless production routes need hosting/build rewrite configuration. The current portable static preview uses `.html` URLs consistently.
- The reference review and typography decision record required for formal design approval are not present. The implementation follows the already-authored v3 direction, but these records should be completed before calling the art direction approved.
- Real proof fields, screenshots, metrics and case-study links cannot be added until the user verifies them.
- There is no deployment configuration or analytics because publishing facts and consent decisions are unresolved.

## Verification already performed

Static checks passed before the last interruption:

```text
node --check src/app.js
node src/check-contrast.mjs
xmllint --noout src/sitemap.xml
cmp inputs/logo.png src/assets/saral-labs-logo.png
```

The contrast check reported all registered text pairs above WCAG AA, including:

```text
text.dark on ink.950: 16.14:1
muted.dark on ink.950: 7.15:1
gold.500 on ink.950: 9.13:1
orange.500 on ink.950: 6.42:1
gold.800 on paper.50: 4.68:1
orange.800 on paper.50: 4.69:1
feedback.error on paper.warm: 7.71:1
feedback.success on paper.warm: 5.60:1
```

Additional automated checks confirmed:

- every HTML file has exactly one H1 and one meta description;
- all local `href` and `src` targets exist;
- all same-page anchors resolve;
- JavaScript syntax and CSS block structure are valid;
- the sitemap is well-formed XML;
- the supplied source logo is preserved exactly;
- no placeholder bracket facts, Lorem Ipsum, Gemini/aurora/glassmorphism language or current-employer claims remain in `src/`.

### Real-browser verification completed

Chrome was used against the local server:

```text
python3 -m http.server 4173 --bind 127.0.0.1 --directory src
```

Verified:

- 320 px: no horizontal overflow (`scrollWidth` matched `clientWidth`); mobile menu opens and closes; Tangled to Simple labels all remain within the content width.
- 768 px: no horizontal overflow; tablet hero and navigation render correctly.
- 1440 px: no horizontal overflow; desktop editorial composition and full supplied logo render correctly.
- Escape restores focus to the mobile menu toggle.
- Form controls enable only after JavaScript initialises.
- Invalid form submission displays field errors and keeps the same URL.
- Valid dummy data displays: “Your brief is ready. This preview has not sent or stored it.” and keeps the same URL.
- Browser console contained no warnings or errors on the home page.

The last route-by-route browser check was interrupted by the user while it was running, so rerun a final route pass.

## Current process state

A local preview server was started in tool session `36422` on port 4173. Because the previous turn was interrupted, it may still be running. Check before starting another server:

```text
lsof -nP -iTCP:4173 -sTCP:LISTEN
```

Stop that server when final verification is complete. If the tool session is still available, send Ctrl-C to session `36422`.

The Chrome preview tab was `http://127.0.0.1:4173/`. A temporary responsive viewport override was reset before the interruption.

## Exact next steps

1. Inspect `AGENTS.md`, this file, and the current `src/` tree.
2. Check whether port 4173 is still serving; restart the static server only if needed.
3. Rerun the final route pass for `/`, all seven named pages, and `/404.html`.
4. Rerun:

   ```text
   node --check src/app.js
   node src/check-contrast.mjs
   xmllint --noout src/sitemap.xml
   cmp inputs/logo.png src/assets/saral-labs-logo.png
   ```

5. Recheck local references and one-H1-per-page after any edit.
6. Review the final page in Chrome at 320, 768 and 1440 px if any layout or CSS changes are made.
7. Stop the local preview server.
8. Report the implementation as a local preview, with D1, claims, contact/retention, ABN and publish approval still required.

Do not deploy or enable real form delivery without the user’s verified contact destination, retention policy and explicit publication instruction.
