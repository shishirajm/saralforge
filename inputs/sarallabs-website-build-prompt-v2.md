# Build prompt: SaralLabs.com (v2)

> **How to use:** save this as `docs/specs/000-website-brief.md` in the `sarallabs` repo and ask Claude Code to work from it. Work runs **one phase at a time**. At the end of each phase, stop, summarise what changed, and wait for approval.
>
> Items in `[BRACKETS]` are facts only Shishir can supply. Never invent them.
>
> **Changes since v1:**
> - Added a primary-customer decision and business success measures.
> - Added a visual-design approval stage.
> - Split the launch scope from the innovation roadmap.
> - Replaced blanket Web Component rules with testable portability outcomes.
> - Moved proof earlier on Home and added a claims register and publishing gate.
> - Corrected colour contrast, performance measurement, data handling, the MCP scope and phase gating.

---

## 0. Role, mission, success

You are a senior product engineer and design engineer building **SaralLabs.com** for **Saral Labs**, a Sydney-based software studio founded by Shishir.

*Saral* (सरल) is Sanskrit/Hindi for **simple**. **Mission:** help clients achieve their goals through simple, well-engineered solutions. The site should demonstrate that mission by example: it should be clear, fast, calm and noticeably better crafted than typical small-business and studio websites.

**Success means a visitor from the primary audience (D1):**

1. Understands within 5 seconds what Saral Labs builds and for whom.
2. Sees credible proof before being asked to act.
3. Thinks "I want my website to work like this", and gets in touch.

**Business measures.** Track these from launch, next to the technical scores:

- **Completed contact submissions:** delivered to Shishir, not just "form submitted".
- **Qualified enquiries:** submissions that match D1 and the leading offer, tagged manually in a simple log.
- **Call-to-action click-through** from Home and from each service page.
- **Health-check completions**, once that tool ships.

---

## 1. Decisions and facts before design

### 1.1 Blocking decision D1: primary customer and leading offer

The homepage cannot be designed until Shishir answers three questions:

> **Who** should feel "this is exactly for me"? **What problem** brings them here? **What should they engage Saral Labs to do first?**

Record the answer in `docs/decisions/D1-audience-and-offer.md`. Candidate options, drawn from Shishir's real work:

| Option | Audience | Leading offer |
|---|---|---|
| **A** (proposed default, unconfirmed) | Owner-operated service businesses (transport, trades, local services) running on phone calls, spreadsheets and a dated site | A fast website with built-in enquiries/booking that turns enquiries into jobs |
| B | Manufacturers and B2B exporters | A request-for-quote-focused website with SEO and measurable leads |
| C | Small teams buried in admin | AI and workflow automation with safe, tested guardrails |

**Rules**

- Home leads with the chosen audience and offer, stated in concrete terms. "Simple solutions. Real results." can be a supporting line, but never the only statement of what Saral Labs does.
- Every other capability stays available on supporting pages, not competing for attention on Home.

### 1.2 Facts to confirm

Put these in `docs/open-questions.md`. Anything unconfirmed stays out of published pages; see the publishing gate in section 10.

| # | Question | Until confirmed |
|---|---|---|
| Q1 | Is Saral Labs a trading name of Saral Infotech, a new entity, or a rename? Which ABN goes on the site? | `[ABN]` (blocks publish) |
| Q2 | Tagline: "Simplicity in Innovation", or an alternative such as "Simple software, built to grow"? | "Simplicity in Innovation" |
| Q3 | Which clients, logos and project details may be shown (MPT, Drive2Door, Mac Precitec India)? | Anonymised, with details approved per case study |
| Q4 | How should the founder's experience be described, including the exact number of years? | `[YEARS]`. **Never name a current employer** |
| Q5 | Product status and public detail for Planbox and Trellis. Which experiments may appear? | Status `[STATUS]`; Labs hidden |
| Q6 | Contact address and channel (email, booking link)? | `[CONTACT EMAIL]` (blocks publish) |
| Q7 | Show pricing, or "Talk to us"? | "Talk to us" |
| Q8 | Are real testimonials available? | Section omitted. **No fabricated testimonials** |
| Q9 | Data retention periods for submissions and briefs | `[RETENTION]` (blocks the relevant feature) |

### 1.3 Claims register

Maintain `docs/claims.md`. Every factual statement on the site gets a row with these fields:

- claim text
- page
- source or evidence
- status: `unverified`, `verified by Shishir`, or `removed`

This covers years of experience, results, product status, client names, performance numbers and email addresses. Only `verified` claims may publish.

---

## 2. Brand system

### 2.1 Identity assets

- **Source logo:** `brand/source/saral-labs-logo.png`. It shows an S-shaped stroke growing into a leaf sprout, blending yellow to orange, with **SARAL** in bold gold, **LABS** in light orange and the tagline below.
- **Faithful reproduction.** Redraw the logo as optimised SVG that matches the approved logo.
  - Any deviation (simplified curves, adjusted spacing, a changed gradient) must be shown **side by side with the original** in `brand/review/` for Shishir's approval.
  - Never silently "improve" the logo.
- **Versions to produce:**
  - stacked and horizontal full colour
  - mark only
  - flat two-colour
  - all white
  - all dark
  - favicons at 16, 32, 180 and 512 px, plus a maskable icon

  At 16 and 32 px, a simplified mark is allowed, but show it for approval.
- **"Powered by Saral Labs" badge.** This is a small lockup for client sites and the footers of products Saral Labs builds.
  - If `brand/source/powered-by-badge.*` exists, reproduce it faithfully.
  - Otherwise, design light and dark variants (mark plus "Powered by Saral Labs", minimum width 120 px, links to sarallabs.com) and submit them for approval.
- **Where effects belong:** bevels, shadows and textures appear only in hero art, never in the SVG logo files.

### 2.2 Colour tokens

Store the tokens as W3C Design Tokens (DTCG JSON) and generate CSS custom properties in OKLCH with hex fallbacks.

| Token | Hex | Role |
|---|---|---|
| `ink.950` | `#0F1315` | Dark background (dark-first) |
| `text.dark` | `#F2EEE6` | Body text on dark |
| `muted.dark` | `#A89F92` | Secondary text on dark |
| `gold.500` | `#D5B15B` | Gold on dark: headings, tagline |
| `gold.300` | `#F3DB7C` | Highlights on dark |
| `orange.500` | `#E77A29` | "LABS", primary action fill |
| `yellow.400` | `#F6CD3F` | Sprout tip, focus ring on dark |
| `gold.800` | `#886B31` | **Gold text on light backgrounds** |
| `orange.800` | `#B05614` | **Orange text/links on light backgrounds** |
| `paper.50` | `#FAF7F0` | Light background |
| `gradient.sprout` | `#F6CD3F → #EFB038 → #ED902F` | Mark and hero art only |
| `gradient.hero.mesh` | Soft blurred blend of `gold.300`, `gold.500`, `orange.500`, `yellow.400` on `ink.950` | Home hero background only (see 2.2a) |

**Tested foreground/background pairs.** Token names alone don't prove accessibility. Only the pairs below are approved for text; add any new pair to this table with its measured ratio before using it.

| Foreground | Background | Ratio | Allowed use |
|---|---|---|---|
| `text.dark` #F2EEE6 | `ink.950` #0F1315 | 16.1:1 | All text |
| `muted.dark` #A89F92 | `ink.950` | 7.2:1 | All text |
| `gold.500` #D5B15B | `ink.950` | 9.1:1 | All text |
| `orange.500` #E77A29 | `ink.950` | 6.4:1 | All text |
| `ink.950` #0F1315 | `orange.500` #E77A29 | 6.4:1 | **Button label on orange** |
| `gold.800` #886B31 | white / `paper.50` | 5.0 / 4.7:1 | All text in light theme |
| `orange.800` #B05614 | white / `paper.50` | 5.0 / 4.7:1 | All text in light theme |

**Pairs that fail and must not be used for text:**

| Pair | Ratio | Why it fails |
|---|---|---|
| `#B89042` on white | 2.96:1 | Fails AA for normal and large text |
| `#E77A29` on white | 2.91:1 | Fails AA |
| **White text on `#E77A29`** | 2.91:1 | Fails AA; primary buttons use dark ink labels instead |

Add a CI script that recomputes every pair in the table from the token file and fails if any drops below its required ratio.

### 2.2a Hero background: colourful gradient mesh

The Home hero (only) carries an animated, colourful gradient-mesh background — the same mechanic as the blurred, softly-shifting blob background behind Google's Gemini chat UI, recoloured to Saral Labs' own palette instead of Gemini's blue/purple/pink.

- **Token:** `gradient.hero.mesh` — 3–4 large, softly blurred blobs built only from existing brand hues (`gold.300`, `gold.500`, `orange.500`, `yellow.400`) over `ink.950`. No new hues are introduced; this must still read as the Saral Labs sprout palette, not a generic AI-chat gradient.
- **Scope:** Home hero section only. Every other page, and every other section of Home (proof cards, services, forms, footer), keeps the plain `ink.950` / `paper.50` backgrounds from the token table above. Never place this behind body copy, form fields or case-study cards.
- **Contrast:** the hero headline, supporting line and CTA sit on a solid `ink.950` panel or scrim over the gradient — never directly on the raw blobs — so text keeps using the tested pairs in the table above. The contrast script (section 2.2) is run against the composited hero, not just against `ink.950`, before this ships.
- **Motion:** pure CSS (blurred, animated `background-position`/transform on gradient layers, or `@property`-driven colour interpolation) — no canvas, WebGL or images. `prefers-reduced-motion` shows one static frame of the same mesh.
- **Budget:** under 15 KB of CSS, no additional JS, no layout shift (CLS gate in 7.1 still applies).

### 2.3 Typography, metaphor, voice

**Typography**

- **Headings and wordmark:** Montserrat (variable, self-hosted, subset).
- **Body:** a highly legible variable sans with a different character (for example Figtree or Geist).
- **Loading:** `font-display: swap` with metric-matched fallbacks (`size-adjust`).
- **Scale:** fluid, using `clamp()`. Use `text-wrap: balance` on headings.

**Brand metaphors**

- **Seed → Sprout → Grow.**
- **Tangled → Simple.** This is the signature idea (section 5.2).

**Voice**

- Plain Australian English and short sentences.
- Facts over adjectives.
- Explain what *Saral* means once, on Home and About.
- Mark anything unfinished as "In development".

---

## 3. Offerings and proof

### 3.1 Offer structure

- **Leading offer:** whatever D1 decides. It gets the Home hero, the first services slot and the main call to action.
- **Supporting services:** each has its own page, structured as **problem → simple solution → what you get → how it works → example → call to action**.

| Service | Example to show (subject to Q3) |
|---|---|
| Websites that work (design, build, managed hosting, SEO foundations, analytics) | B2B manufacturer site built around a request-for-quote (RFQ) funnel with privacy-friendly analytics |
| Booking and scheduling systems | Owner-operator flow: enquiry → quote → confirmed ride → driver notification (Planbox) |
| AI and workflow automation | Enquiries triaged and replies drafted. Principle: "the model proposes, deterministic code decides", with evaluations before scale |
| Custom web and mobile apps | Customer portal, internal dashboard, React Native app |
| Cloud, platform and cost clarity | Infrastructure as code with per-client cost tagging |

**Capabilities list** (restrained text, not a logo wall):

- TypeScript and Node.js
- React, Next.js, Astro, React Native/Expo
- Postgres and pgvector
- AWS and GCP
- Terraform and AWS CDK
- Claude, MCP and LLM evaluation
- Spec-driven delivery
- Experience in regulated financial services, with years per Q4

### 3.2 Proof model

**Every case study has four parts:**

1. **The problem.**
2. **Saral Labs' contribution:** what Shishir personally did.
3. **What was delivered.**
4. **Evidence of the result:** verified metric, screenshot, live link or client quote. If there is no evidence yet, say "Recently launched" rather than inventing an outcome.

**Keep three kinds of work visibly distinct.** Use a labelled tag on each card and a separate section per kind.

| Label | Meaning | Examples |
|---|---|---|
| **Client work** | Delivered for a paying or real client | MPT, Drive2Door, Mac Precitec India (per Q3) |
| **Our products** | Built and owned by Saral Labs | Planbox, Trellis (status per Q5) |
| **Experiments** | Learning and prototypes | Labs (hidden until Q5) |

---

## 4. Information architecture

```
/                          Home
/services  (+ one page per service)
/work                      Case studies (client work)
/products  /products/planbox  /products/trellis
/about                     Story, meaning of Saral, founder, principles
/start                     Start a project (contact flow)
/notes                     Articles (MDX)
/under-the-hood            How this site is built (release 2+)
/health-check              Website health check (when shipped)
/labs                      Experiments (hidden until Q5)
/privacy  /terms  /llms.txt  /sitemap.xml  /robots.txt  /.well-known/security.txt
```

**Home page order:**

1. **Hero.** A concrete statement of what Saral Labs builds for the D1 audience, one supporting line, one primary call to action ("Start a project") and one quiet secondary link.
   - Example for option A: *"We build simple websites and booking systems that turn enquiries into jobs."*
   - A static or lightly animated sprout mark is enough at launch.
   - Background: the colourful animated gradient mesh defined in **2.2a** (`gradient.hero.mesh`) — brand-coloured, Gemini-chat-style blurred blobs behind a solid text panel. Home hero only; see 2.2a for the contrast, motion and budget rules.
2. **Compact proof:** 2–3 case study cards with evidence lines, placed directly under the hero.
3. **Tangled → Simple** signature story (section 5.2).
4. **Leading offer in detail**, then the other services as a compact grid.
5. **How we work:** Discover → Simplify → Build → Grow.
6. **Our products:** Planbox and Trellis, each with its status label.
7. **Founder credibility:** a short bio, principles and a photo `[PHOTO]`.
8. **Closing call to action**, then the footer:
   - ABN
   - Sydney, Australia
   - contact email
   - "Powered by Saral Labs" badge showcase
   - product links

One primary action per page, repeated. Never place competing buttons side by side.

---

## 5. Experience scope: launch vs roadmap

### 5.1 Launch foundation (required for v1.0)

- Clear offerings led by D1, selected work, and founder credibility.
- **An excellent mobile experience.** Design mobile-first and test on a real mid-range Android phone and an iPhone.
- **A reliable contact flow**, which is launch-critical. It must:
  - validate input server-side
  - use privacy-friendly bot protection plus a honeypot
  - write the submission first, then send (outbox pattern), with retries on failed email delivery
  - use an idempotency key per submission, so double-clicks and retries don't create duplicates
  - show a confirmation page with a reference ID
  - notify Shishir and send the visitor an auto-reply
  - write every submission to a log that Shishir can review and tag as qualified
- Dark and light themes, modern CSS (container queries, `:has()`, cascade layers, OKLCH), and cross-document View Transitions as a progressive enhancement.
- Complete SEO basics, schema.org JSON-LD, `llms.txt`, and privacy-friendly analytics with consent.

### 5.2 Signature experience: "Tangled → Simple" (required for v1.0; exceptional execution)

This is the most distinctive idea on the site because it explains the brand in one interaction, so it gets the design attention.

- As the visitor scrolls, a tangle of SVG paths labelled with real pain points for the D1 audience ("missed calls", "double bookings", "five different tools") resolves into one clean gold line that grows into the sprout mark.
- Build it with CSS scroll-driven animations (`animation-timeline: view()`), falling back to IntersectionObserver.
- Crafted easing and pacing. It must look deliberate on both mobile and desktop.
- Reduced motion or no JavaScript shows a static before/after illustration with the same message.
- Budget: under 30 KB, with no layout shift.
- **Optional for v1.0:** one useful demonstration, if ready and verified. Either the health check (5.3, R1) or a sandboxed Planbox enquiry widget demo. If neither is ready, ship without one.

### 5.3 Later releases (roadmap)

**Feature card (required).** Before building any roadmap feature, write `docs/features/<name>.md` covering:

- **visitor benefit:** one sentence
- **ongoing cost:** money and maintenance time
- **simpler fallback:** the non-JS or non-AI equivalent
- **success measure**
- **kill switch:** the environment flag that turns it off

Shishir approves the card before build starts.

| Release | Feature | Notes |
|---|---|---|
| R1 | **Website health check** | See the data-handling rules below |
| R1 | **`/under-the-hood`** | Stack, portability approach, **"Latest automated test"** results with timestamp and test conditions, clearly separated from real-visitor data |
| R2 | **Ask Saral** project-scoping assistant | See the data-handling and evaluation rules below |
| R2 | Command palette + static search (Pagefind) | |
| R3 | Advanced hero rendering (WebGPU → WebGL2 → SVG) | Loaded after LCP, paused off-screen, < 60 KB |
| R3 | PWA (offline page only), Speculation Rules | |
| R3 | Optional MCP server | See the scope rules below |

**Health check: data handling**

- The server calls the PageSpeed Insights API.
- **Show lab and field data separately.** Lab data is a simulated test. Field data is real Chrome users, where the Chrome UX Report has enough data.
- **When field data is missing,** show an explicit state: *"Not enough real-user data yet for this site. Showing lab results only."* This is common for new or low-traffic sites.
- **Caching without storing URLs:** key results by a SHA-256 hash of the normalised URL, keep them for at most 24 hours, and let them expire automatically. Never link cached entries to the visitor's IP or identity.
- **Storing a URL together with contact details** happens only if the visitor explicitly asks for a follow-up. That uses the consented contact flow and the Q9 retention period.
- **Comparison with SaralLabs.com** uses the same test conditions, with timestamps shown.
- Rate-limit requests per IP. The rate-limit counters are also short-lived, with a TTL.

**Ask Saral: data handling and evaluation**

- **Sessions:** conversation state lives in the visitor's browser (sessionStorage) and is sent with each request. No server-side transcript is kept by default.
- **Consent and storage:** a brief is stored only when the visitor reviews it and presses **Submit**, after explicit consent. It then goes through the same outbox, retry and idempotency pipeline as the contact form, and is kept for the Q9 retention period.
- **Consequential actions** (sending a brief, contacting Shishir) happen only through that explicit visitor submission, with server-side schema validation. The model can draft a brief but can never send anything itself.
- **Spend control:** per-IP and per-session rate limits and a monthly spend counter live in a small managed store (choose it in an ADR, for example Firestore), with a hard cap and a kill switch.
- **Model:** the model ID lives in an environment variable. Verify it against the provider's current documentation at build time.
- **Guardrails:** no prices, no dates, no commitments, stays on topic.
- **Evaluations:** `evals/concierge/` holds named suites:
  - `happy-v1`: at least 15 cases across the services
  - `offtopic-v1`
  - `pricing-v1`
  - `injection-v1`: at least 10 cases

  **Release gate:** at least 90% overall pass, zero price or date commitments within `pricing-v1`, and zero successful injections **within `injection-v1`**. Passing a finite suite does not prove the assistant is immune to injection. That is why the server-side validation and explicit-submission rules above apply regardless of eval results.

**MCP server: scope**

- **Read-only means read-only.** The server exposes only `list_services`, `get_service` and `get_case_study`.
- **Contact:** it returns the `/start` URL. It never submits anything.
- **If submitting through MCP is wanted later,** define it as a separate write tool with its own feature card, authentication, validation and rate limits.

**Never:** autoplay video, parallax on body text, cursor-follower gimmicks, gradient backgrounds outside the Home hero (the approved hero gradient is scoped and constrained in **2.2a**), stock photos or emoji.

---

## 6. Portability: outcomes, rules, and a test

The website must survive framework, host and vendor changes. **Content, design tokens and business rules are the assets; the framework is a replaceable adapter.** The requirements below are outcomes, not particular technologies.

### 6.1 Required outcomes

1. **Content and images can be exported** (as Markdown/MDX + YAML + original image files) without losing structure or metadata.
2. **Design tokens are framework-independent:** DTCG JSON, compiled to CSS variables.
3. **Every external service has a documented interface:** email, AI provider, analytics, bot protection, PageSpeed. Contracts live in `packages/schemas`, with one adapter per vendor.
4. **URLs survive migrations.** `docs/url-inventory.csv` lists every public URL; a redirect map is kept in version control; CI fails if a published URL disappears without a redirect.
5. **Hosting can change without touching content.** Pages build to static HTML; only `apps/api` needs a runtime, and it is containerised.
6. **Everyday workflows are documented in `docs/workflows/`,** each as a step-by-step guide with an example PR:
   - adding a case study
   - changing an offering
   - publishing a note
   - adding a redirect
   - rotating a vendor

### 6.2 Allowed content subset

Define this in `docs/content-rules.md` and enforce it with a lint rule. Content may use:

- **Standard Markdown:** headings, lists, links, images with alt text, tables, blockquotes, code.
- **A whitelist of MDX components:**
  - `<Callout>`
  - `<Figure>`
  - `<CaseStudyEvidence>`
  - `<CTA>`
  - `<Video>`

  Each component has a documented props schema **and a plain-Markdown fallback rendering**, so content still reads correctly outside MDX.
- **No:** imports, inline JavaScript expressions, raw HTML (except `<details>`), or framework-specific syntax.

### 6.3 Portability test (runs in CI)

- A tiny second renderer (`tools/portability-check/`) uses a minimal Markdown pipeline, for example unified/remark, and none of the web framework.
- It renders **one real service page** from `packages/content` using the compiled token CSS.
- The test passes when all headings, body text, links, images, the call to action and evidence blocks are present, and no content or token file was modified to make it work.

### 6.4 Implementation guidance (not dogma)

**Suggested stack.** Verify versions and record them in ADR-001.

| Concern | Choice |
|---|---|
| Framework | Astro (content collections, islands, static output) |
| API | TypeScript on Hono (runs on Node, Bun or Cloud Run) |
| Content validation | Zod |
| Search | Pagefind |
| Tests | Playwright, axe-core, Lighthouse CI |
| Dependency updates | Renovate |

**Interactive components**

- **Default:** plain HTML/CSS plus small scripts.
- **Web Components:** use them only where an interactive widget must be reused outside this site (for example the "Powered by" badge embed or the Planbox demo widget), or where that choice is recorded in an ADR.

**Other rules**

- Lint rules block framework imports in `packages/content`, `packages/tokens` and `packages/schemas`.
- Keep `docs/TECH-RADAR.md` (Adopt / Trial / Assess / Hold) and review it quarterly. Each new browser feature goes behind an environment flag.

**Repository layout**

```
apps/web  apps/api
packages/content  packages/tokens  packages/ui  packages/schemas
tools/portability-check  evals/  brand/  infra/
docs/{specs,decisions,features,workflows}  docs/claims.md  docs/url-inventory.csv
```

---

## 7. Quality and measurement

### 7.1 Lab tests (CI, before release)

**Test conditions**

- Lighthouse mobile preset (emulated mid-tier device with simulated throttling) and desktop preset.
- **5 runs per page; the median is reported.**
- Run against the preview deployment, not localhost.

**Gates**

| Check | Gate |
|---|---|
| Lighthouse scores | ≥ 95 for Performance, Accessibility, Best Practices and SEO (median) |
| LCP (lab) | < 2.0 s mobile |
| CLS (lab) | < 0.05 |
| **TBT** (lab proxy for responsiveness) | < 150 ms mobile |
| JS on Home (initial) | < 80 KB gzipped (the signature story < 30 KB) |
| Accessibility | Zero axe violations. Keyboard and screen-reader checks on Home, a service page and `/start` |
| Contrast | Token-pair script passes (section 2.2) |
| Portability | Section 6.3 passes; URL inventory check passes |

A standard Lighthouse page-load test **cannot measure INP**, because INP needs real interactions. Use TBT as the lab proxy. Optionally, add Lighthouse user-flow (timespan) tests for the main interactions.

### 7.2 Field measurement (after launch)

- **Real-user monitoring:** collect LCP, CLS and INP with the `web-vitals` library into the privacy-friendly analytics, subject to consent.
- **Targets at the 75th percentile:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- **Chrome UX Report:** once the site has enough traffic, compare against its data. Until then, label field data as insufficient.
- **Keep lab and field separate.** Never present lab numbers as real-visitor experience. `/under-the-hood` labels lab results "Latest automated test" with a timestamp and the test conditions.

### 7.3 Security and privacy

- Strict CSP, HSTS and secure headers.
- Secrets live in Secret Manager.
- Every API route is rate-limited.
- The privacy page reflects the Australian Privacy Principles, actual data flows and the Q9 retention periods.

---

## 8. Hosting and infrastructure (GCP, Terraform)

- **Project:** a dedicated GCP project, `saral-platform`, with labels on every resource and a budget alert at `[AUD]`.
- **Domain and DNS:**
  - `sarallabs.com` via Cloud Domains, with DNS in Cloud DNS.
  - Apex is canonical; `www` redirects to it.
  - Reserve records for `trellis.`, `planbox.` and `api.`.
- **Serving:** Firebase Hosting (CDN, managed SSL, preview channel per PR), with `/api/**` rewritten to Cloud Run.
- **Fixed costs:** flag any resource with a fixed monthly cost and get approval before creating it.
- **CI/CD:** GitHub Actions with Workload Identity Federation.
- **Email:** configure SPF, DKIM and DMARC for `[CONTACT EMAIL]`'s domain.

---

## 9. Delivery plan

Each phase activates **only the gates relevant to features that exist**. A gate for a feature that hasn't been built (for example concierge evals in Phase 1) is registered as `pending`, not run.

| Phase | Output | Exit criteria (gates active in this phase) |
|---|---|---|
| **0. Decisions and spec** | D1 decided, open questions logged, claims register started, ADR-001 (framework), ADR-002 (hosting) | Shishir approves D1 and the spec |
| **1. Foundations and preview** | Monorepo, tokens, contrast script, lint boundaries, CI skeleton, **preview deployment live** on a Firebase preview channel, brand asset set and badge in `brand/review/` | Preview URL works; contrast and lint gates pass; logo reproduction approved |
| **2. Visual design approval** | **Two distinct homepage directions** using the approved identity, each shown on **desktop (1440) and mobile (390) with real content**, plus a **working prototype of "Tangled → Simple"** | Shishir approves one direction: typography, spacing, hierarchy and overall character. No page build before this |
| **3. Launch pages** | All section 4 launch pages, including the contact flow (5.1), case studies (3.2) and content rules (6.2) | Lab gates (7.1); axe; portability test; URL inventory; content lint |
| **4. Signature experience** | Production "Tangled → Simple" (5.2); optional demo if ready | Budget and reduced-motion checks; approval on real devices |
| **5. Launch readiness** | Terraform (section 8), DNS, email, analytics with consent, privacy page | **Contact delivery verified end to end** (including a forced email failure → retry → delivery); **rollback rehearsed** (redeploy the previous release in under 10 minutes); **publishing gate passes** (section 10) |
| **R1–R3** | Roadmap features (5.3), one at a time | Feature card approved; that feature's own gates (evals, data handling, budgets) pass before release |

**Working style**

- Vertical slices with one PR each, and tests alongside the code.
- Record decisions in ADRs.
- Ask rather than guess.
- Share screenshots at 1440 and 390 px for every UI change.

---

## 10. Publishing gate (blocks every production deploy)

CI fails the production deploy if any of these are true:

1. **A visible placeholder remains.** This covers `[...]`, "TBD", "lorem" and example emails.
2. **A claim on a page is not `verified`** in `docs/claims.md`.
3. **Project details are unapproved.** A client name, logo, screenshot or metric appears without Q3 approval recorded against that case study.
4. **A product or experiment is shown with a status that doesn't match Q5.**
5. **The contact address hasn't been verified** as receiving mail.

The gate prints a checklist of what it blocked so Shishir can resolve each item.

---

## 11. Non-negotiables

1. No invented clients, results, testimonials, prices or experience figures.
2. Never name Shishir's current employer.
3. Home leads with the D1 audience and offer, and proof appears before the long sell.
4. Faithful logo reproduction; every change is shown for approval.
5. Only tested colour pairs are used for text.
6. Launch scope first. Each roadmap feature needs an approved card with its benefit, cost and fallback.
7. Portability is proven by the CI test, not just asserted.
8. Lab and field performance are always labelled separately.
9. AI features never act on their own. Visitor submission and server-side validation are always required.
10. The site itself embodies *saral*: simple to use, simple to maintain, simple to change.
