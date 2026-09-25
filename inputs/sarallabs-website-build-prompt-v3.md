# Build prompt: SaralLabs.com (v3)

> **How to use:** save this as `docs/specs/000-website-brief.md` in the `sarallabs` repo and ask Claude Code to work from it. Work runs **one phase at a time**. At the end of each phase, stop, summarise what changed, and wait for approval.
>
> Items in `[BRACKETS]` are facts only Shishir can supply. Never invent them.
>
> **Changes since v2:**
> - Replaced the Gemini-style gradient with an ownable **Editorial Growth** visual system.
> - Made **Tangled → Simple** the visual thread across the whole site, not an isolated effect.
> - Added current-reference research, anti-template rules and a visual-currentness gate.
> - Separated the logo typeface from the website display typography.
> - Reworked Home into a shorter, scan-first sequence with proof and a TL;DR summary near the top.
> - Strengthened the visual-design phase with composition, motion, responsive and accessibility criteria.
> - Added explicit WCAG 2.2 AA, target-size, focus, forced-colour and reduced-motion requirements.
> - Marked the old HTML explorations as unapproved and unsuitable as visual references.

---

## 0. Role, mission, success

You are a senior product engineer and design engineer building **SaralLabs.com** for **Saral Labs**, a Sydney-based software studio founded by Shishir.

*Saral* (सरल) is Sanskrit/Hindi for **simple**. **Mission:** help clients achieve their goals through simple, well-engineered solutions. The site should demonstrate that mission by example: it should be clear, fast, calm and noticeably better crafted than typical small-business and studio websites. It should feel current in 2026 without looking like a collection of fashionable components. Human judgement, original art direction and evidence of real work must be visible.

**Success means a visitor from the primary audience (D1):**

1. Understands within 5 seconds what Saral Labs builds and for whom.
2. Sees credible proof before being asked to act.
3. Thinks "I want my website to work like this", and gets in touch.

**Creative standard.** A competent template is a failure. The approved design must be recognisable as Saral Forge when the logo is hidden. It earns that recognition through its typography, growth-line behaviour, editorial composition, motion language and use of the Seed → Sprout → Grow and Tangled → Simple metaphors.

**Legacy explorations.** Existing files such as `inputs/index.html` and `inputs/services.html` are unapproved early explorations. They may be inspected for history, but they must not guide layout, typography, component shape, interaction or art direction. Do not polish or extend them.

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

- **Source logo:** `inputs/logo-2.png`. It shows an S-shaped stroke growing into a leaf sprout, blending blue to violet, with **SARAL** in bold blue, **FORGE** in violet and the tagline "Smart Solutions. Made Simple." below. This replaces the earlier gold "Saral Labs" mark (`inputs/logo-1.png`), retained for historical reference only.
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
- **"Powered by Saral Forge" badge.** This is a small lockup for client sites and the footers of products Saral Forge builds.
  - If `brand/source/powered-by-badge.*` exists, reproduce it faithfully.
  - Otherwise, design light and dark variants (mark plus "Powered by Saral Forge", minimum width 120 px, links to sarallabs.com) and submit them for approval.
- **Where effects belong:** the logo files remain clean. Texture, grain, line animation and depth belong to the surrounding visual system, never inside the master SVG logo files.

### 2.2 Colour tokens

Store the tokens as W3C Design Tokens (DTCG JSON) and generate CSS custom properties in OKLCH with hex fallbacks.

| Token | Value | Role |
|---|---|---|
| `ink.950` | `#0F1315` | Dark background (dark-first) |
| `text.dark` | `#F3F1FA` | Body text on dark |
| `muted.dark` | `#A79FC4` | Secondary text on dark |
| `violet.500` | `#AA61F2` | Violet on dark: headings, tagline, "FORGE" |
| `violet.300` | `#B773F5` | Highlights on dark |
| `blue.500` | `#1984FF` | "SARAL", primary action fill, focus ring |
| `violet.800` | `#6B21C4` | **Violet text on light backgrounds** |
| `blue.800` | `#14418F` | **Blue text/links on light backgrounds** |
| `paper.50` | `#F7F5FC` | Light background |
| `gradient.sprout` | `#1984FF → #AA61F2 → #B773F5` | Logo mark and signature growth line only |
| `line.growth` | `blue.500` → `violet.500` → `violet.300` | Animated path, wayfinding and evidence accents |
| `surface.warm` | Derived from `paper.50` in OKLCH | Lavender editorial surface in the light theme |
| `surface.raised` | Derived from `ink.950` in OKLCH | Rare raised surface in the dark theme |

**Tested foreground/background pairs.** Token names alone don't prove accessibility. Only the pairs below are approved for text; add any new pair to this table with its measured ratio before using it.

| Foreground | Background | Ratio | Allowed use |
|---|---|---|---|
| `text.dark` #F3F1FA | `ink.950` #0F1315 | 16.7:1 | All text |
| `muted.dark` #A79FC4 | `ink.950` | 7.5:1 | All text |
| `violet.500` #AA61F2 | `ink.950` | 5.1:1 | All text |
| `blue.500` #1984FF | `ink.950` | 5.1:1 | All text |
| `ink.950` #0F1315 | `blue.500` #1984FF | 5.1:1 | **Button label on blue** |
| `violet.800` #6B21C4 | white / `paper.50` | 8.0 / 7.4:1 | All text in light theme |
| `blue.800` #14418F | white / `paper.50` | 9.6 / 8.9:1 | All text in light theme |

**Pairs that fail and must not be used for text:**

| Pair | Ratio | Why it fails |
|---|---|---|
| `#AA61F2` on white | 3.68:1 | Fails AA for normal text; use `violet.800` on light backgrounds instead |
| `#1984FF` on white | 3.63:1 | Fails AA; use `blue.800` on light backgrounds instead |
| **White text on `#1984FF`** | 3.63:1 | Fails AA; primary buttons use dark ink labels instead |

Add a CI script that recomputes every pair in the table from the token file and fails if any drops below its required ratio.

### 2.2a Signature visual system: Editorial Growth

The site uses a proprietary visual system derived from the logo and the idea of simplifying complexity. Its signature is a fine blue-to-violet line that begins tangled, finds a clear path and eventually becomes the sprout. This line is used with restraint as hero art, section wayfinding, diagram structure, interaction feedback and case-study annotation.

**Hero growth field**

- Compose the hero from an asymmetrical field of thin SVG contour paths, one stronger growth line, a few precise labels or coordinates, generous empty space and a subtle warm grain. It may include restrained, softly diffused brand colour behind the paths, but never a field of floating gradient blobs.
- The line starts with visible complexity near the edge of the composition and resolves as it approaches the message. The visual should communicate the idea before it decorates the page.
- Use only the approved blue and violet family over `ink.950` or the lavender-paper family. Do not introduce unrelated hues (green, red, teal, neon) beyond the approved feedback colours.
- The headline and CTA sit on a quiet, high-contrast area. Never rely on a translucent glass panel to make them readable.
- Build the launch version with SVG and CSS. No canvas, WebGL, generated bitmap background or runtime animation library.
- Motion is slow, deliberate and connected to meaning: a path draws, a label resolves or a tangle loosens. Avoid ambient movement that runs merely because the page is open.
- `prefers-reduced-motion` presents a composed static frame. `prefers-reduced-transparency` removes blur and grain where supported.
- Hero visual CSS and SVG total under 25 KB compressed, add no JavaScript and cause no layout shift.

### 2.3 Typography

- **Wordmark:** preserve the approved Montserrat wordmark. Do not change the logo typography.
- **Display headings:** do not default to Montserrat. During Phase 2, compare at least two self-hostable, properly licensed display systems:
  1. a warm contemporary serif or serif-like variable face paired with a neutral humanist sans; and
  2. an expressive humanist or grotesk variable sans with enough character to carry large editorial headlines.
- Choose the system that makes Saral Labs feel precise, human and established. Avoid a generic startup appearance. Document the choice and rejected alternative in the design decision record.
- **Body and UI:** use a highly legible variable sans such as Figtree, Geist or an approved equivalent. UI labels may use a slightly narrower or firmer cut of the same family.
- Self-host and subset production fonts. Use `font-display: swap` with metric-matched fallbacks and `size-adjust`.
- Use a fluid scale with `clamp()`. Headings use `text-wrap: balance`; body copy uses `text-wrap: pretty` where supported.
- Large type is part of the composition, but never forces a word into an unreadable stack or creates horizontal overflow at 320 px.
- Kinetic type is allowed only when it changes meaning or directs attention. Animate no more than one short phrase in a viewport and keep the words readable when motion is disabled.

### 2.4 Composition, material and motion

**Composition**

- Use an editorial, asymmetrical grid with deliberate changes in scale. Let important evidence occupy more space than category labels and decorative art.
- Prefer open layouts, rules, typographic grouping and image scale over wrapping every item in a card.
- Alternate deep-ink and warm-paper sections to create chapters. Transitions should feel connected by the growth line rather than by a stack of unrelated full-width blocks.
- Use section numbers and short margin notes where they improve scanning. These are functional wayfinding, not decoration.
- Maintain a clear reading order in the DOM. Visual asymmetry must collapse naturally on mobile without reordering meaning.

**Material**

- Use real project screenshots, real diagrams and one approved founder photograph. Present software interfaces as considered objects with captions and evidence, not as floating dashboard mockups.
- A subtle paper grain or print-like imperfection may add warmth. It must remain quiet, compress well and disappear in high-contrast or reduced-transparency modes.
- Corners, borders and shadows follow one restrained system. Most sections need no container. Pill shapes are reserved for compact status labels, filters and tags.

**Motion**

- Concentrate launch motion in three places: the hero entrance, Tangled → Simple and evidence reveal. Ordinary controls use brief feedback transitions only.
- Define duration, easing and distance tokens. Motion expresses growth, clarification or causality; it does not make content hover, bob or drift.
- Scroll remains native. Never hijack scrolling, smooth every wheel event or delay navigation for a transition.

### 2.5 Current-reference research and anti-template rules

Before Phase 2, create `docs/design/reference-review.md`:

1. Review 6–8 live, high-quality studio, product and service-business websites. Prefer examples published or substantially updated within the previous 18 months.
2. Record the review date, URL, mobile behaviour and one useful principle from each reference.
3. Record what must not be copied. References are evidence and vocabulary, not layouts to reproduce.
4. Include at least two references whose strength comes from restraint and usability rather than spectacle.
5. Extract 3–5 design principles for Saral Labs and use those principles to judge both Phase 2 directions.

The following patterns are rejected unless a concrete user need justifies an exception in a design decision record:

- Gemini-style or aurora gradient blobs
- default bento grids and rows of identical rounded cards
- glassmorphism, glowing borders and blurred panels
- centred hero copy with a floating 3D object
- decorative dashboards with invented data
- pill-shaped controls everywhere
- marquees that repeat generic claims or technology names
- scroll hijacking, cursor followers and ambient parallax
- gratuitous 3D, chrome, liquid-metal or AI-generated imagery
- animations that hide weak hierarchy or delay access to content

**Brand metaphors**

- **Seed → Sprout → Grow:** simple beginnings that become useful systems.
- **Tangled → Simple:** complexity becomes one clear path. This is the main signature idea and the site-wide visual thread.

**Voice**

- Plain Australian English and short sentences.
- Radical editing: every sentence must earn its space. Prefer a precise statement and evidence over a paragraph of positioning copy.
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

**Keep three kinds of work visibly distinct.** Use a labelled tag on each work item and a separate index section per kind. A work item does not have to be a conventional card.

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

1. **Hero and TL;DR.** A concrete statement of what Saral Labs builds for the D1 audience, one supporting line, one primary call to action ("Start a project") and one quiet link to selected work.
   - Example for option A: *"We build simple websites and booking systems that turn enquiries into jobs."*
   - Use the Editorial Growth hero field from section 2.2a. The growth line should lead the eye from complexity toward the headline or proof.
   - Include a compact scan-first summary answering three questions: **who we help / what we build / what changes**. Each answer is one short phrase, not a paragraph.
   - Include one verified evidence line before or immediately beside the CTA where available. If there is no publishable metric, use a truthful project-status or deliverable statement.
2. **Selected proof:** 2–3 case-study compositions with evidence lines, screenshots and clear Client work / Our products labels. Avoid a row of equal cards; give the strongest evidence visual priority.
3. **Tangled → Simple:** the signature explanation and interaction from section 5.2. It acts as guided scrolling between the problem and Saral Labs' approach.
4. **Offer and method:** explain the leading offer in detail, show the other services as a concise index, then show Discover → Simplify → Build → Grow. Keep this as one coherent chapter rather than two repetitive sections.
5. **Products and founder:** show Planbox and Trellis only at their verified statuses, then a compact founder credibility block with principles and an approved photo `[PHOTO]`. This section supports trust without interrupting the leading offer.
6. **Closing call to action**, then the footer:
   - ABN
   - Sydney, Australia
   - contact email
   - "Powered by Saral Labs" badge showcase
   - product links

One primary action per page, repeated. A quiet text link may sit nearby, but never place two button-weight actions side by side. On mobile, the first viewport must contain the concrete offer and enough context to understand it without waiting for animation.

---

## 5. Experience scope: launch vs roadmap

### 5.1 Launch foundation (required for v1.0)

- Clear offerings led by D1, selected work, and founder credibility.
- **An excellent mobile experience.** Design mobile-first and test on a real mid-range Android phone and an iPhone.
- **WCAG 2.2 AA as the baseline.** Use semantic HTML, logical focus order, visible focus, labelled controls, useful alt text and status announcements. Meet non-text contrast as well as text contrast. Interactive targets are at least 24 × 24 CSS px and preferably 44 × 44 on touch layouts, with adequate spacing between smaller targets.
- Support keyboard-only use, screen readers, 200% zoom, text spacing overrides, `forced-colors`, `prefers-contrast`, `prefers-reduced-motion` and reduced transparency where applicable.
- **A reliable contact flow**, which is launch-critical. It must:
  - validate input server-side
  - use privacy-friendly bot protection plus a honeypot
  - write the submission first, then send (outbox pattern), with retries on failed email delivery
  - use an idempotency key per submission, so double-clicks and retries don't create duplicates
  - show a confirmation page with a reference ID
  - notify Shishir and send the visitor an auto-reply
  - write every submission to a log that Shishir can review and tag as qualified
- Dark and light themes, modern CSS (container queries, `:has()`, cascade layers, OKLCH), and cross-document View Transitions as a progressive enhancement. The two themes share hierarchy and meaning; neither is a colour-inverted afterthought.
- Complete SEO basics, schema.org JSON-LD, `llms.txt`, and privacy-friendly analytics with consent.

### 5.2 Signature experience: "Tangled → Simple" (required for v1.0; exceptional execution)

This is the most distinctive idea on the site because it explains the brand in one interaction. It is also the source for the line motif used elsewhere, so the full experience feels like one system.

- As the visitor scrolls, a tangle of SVG paths labelled with real pain points for the D1 audience ("missed calls", "double bookings", "five different tools") resolves into one clean blue-violet line that grows into the sprout mark.
- The labels use real audience language confirmed during D1. Do not invent software jargon or use decorative pseudo-data.
- Build it with CSS scroll-driven animations (`animation-timeline: view()`), falling back to IntersectionObserver.
- Use the same growth-line token, stroke behaviour and easing as the hero and section wayfinding. It must look deliberate on both mobile and desktop.
- Reduced motion or no JavaScript shows a static before/after illustration with the same message.
- The story must remain understandable if a visitor scrolls quickly, enters the page midway or never triggers the animation.
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
| R3 | Optional advanced growth-field rendering (WebGPU → WebGL2 → SVG) | Must preserve the approved Editorial Growth composition; loaded after LCP, paused off-screen, < 60 KB |
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

**Never:** autoplay video, parallax on body text, cursor-follower gimmicks, generic gradient-mesh backgrounds, stock photos, emoji used as interface icons, fake software UI, invented dashboard data or motion that blocks reading.

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
| Accessibility | WCAG 2.2 AA; zero axe violations; keyboard, screen-reader, 200% zoom and forced-colour checks on Home, a service page and `/start` |
| Contrast | Token-pair script passes (section 2.2) |
| Portability | Section 6.3 passes; URL inventory check passes |
| Visual regression | Approved reference screenshots at 390, 768 and 1440 px; no overflow, clipped type, hidden focus or accidental layout change |

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
| **2. Visual design approval** | Current-reference review; **two distinct Editorial Growth homepage directions** using the approved identity and real content; responsive compositions; theme samples; motion studies; working Tangled → Simple prototype | Shishir approves one direction against the Phase 2 criteria below. No launch-page build before this |
| **3. Launch pages** | All section 4 launch pages, including the contact flow (5.1), case studies (3.2) and content rules (6.2) | Lab gates (7.1); axe; portability test; URL inventory; content lint |
| **4. Signature experience** | Production "Tangled → Simple" (5.2); optional demo if ready | Budget and reduced-motion checks; approval on real devices |
| **5. Launch readiness** | Terraform (section 8), DNS, email, analytics with consent, privacy page | **Contact delivery verified end to end** (including a forced email failure → retry → delivery); **rollback rehearsed** (redeploy the previous release in under 10 minutes); **publishing gate passes** (section 10) |
| **R1–R3** | Roadmap features (5.3), one at a time | Feature card approved; that feature's own gates (evals, data handling, budgets) pass before release |

**Working style**

- Vertical slices with one PR each, and tests alongside the code.
- Record decisions in ADRs.
- Ask rather than guess.
- Share screenshots at 1440 and 390 px for every UI change, plus 768 px whenever layout structure changes.

### 9.1 Phase 2 visual-design deliverables and gate

Start with the completed `docs/design/reference-review.md`. Build two genuinely different expressions of the same brand system:

- **Direction A — Warm Editorial:** paper-led, generous space, a contemporary serif or serif-like display voice, large evidence and quiet technical annotation.
- **Direction B — Technical Organic:** ink-led, an expressive humanist or grotesk display voice, stronger contour-line structure and more visible process diagrams.

These names describe starting points, not templates. Change them if the reference work supports better directions. Both must remain recognisably Saral Labs and must avoid the rejected patterns in section 2.5.

For each direction, provide:

1. the full Home composition at 1440 and 390 px using publishable or clearly labelled draft content;
2. focused views of navigation, hero/TL;DR, selected proof, service index, Tangled → Simple, founder credibility, closing CTA and footer;
3. at least one case-study detail composition and the `/start` form, so approval is not based on the hero alone;
4. a light- and dark-theme sample with the same hierarchy;
5. typography specimens showing headline, body, evidence, label, number and button styles;
6. a motion sheet naming the trigger, purpose, duration, easing and reduced-motion result for every non-trivial animation;
7. a working Tangled → Simple prototype on desktop and mobile;
8. a 320 px stress check and a 200% zoom check for the hardest headline and densest evidence block;
9. a one-page rationale mapping decisions back to D1, the reference-review principles and the brand metaphors.

Score each direction from 1–5 on:

- five-second comprehension
- visual hierarchy and proof visibility
- recognisability without the logo
- mobile composition
- typography and reading comfort
- accessibility and reduced-motion quality
- performance feasibility
- resistance to looking dated or template-generated

The selected direction must score at least 4 in every category. Resolve weaknesses before approval rather than averaging them away. Approval covers the system—typography, spacing, colour use, composition, imagery, line behaviour and motion—not just a favourite hero.

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
6. Editorial Growth and Tangled → Simple form one recognisable visual system across the site.
7. No generic AI-gradient, bento-card or glassmorphism treatment is accepted as a visual direction.
8. Mobile is designed as its own composition and approved with real content.
9. Launch scope first. Each roadmap feature needs an approved card with its benefit, cost and fallback.
10. Portability is proven by the CI test, not just asserted.
11. Lab and field performance are always labelled separately.
12. AI features never act on their own. Visitor submission and server-side validation are always required.
13. The site itself embodies *saral*: simple to use, simple to maintain, simple to change.
