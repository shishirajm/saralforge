# Build prompt: SaralLabs.com

> **How to use:** paste this whole file into Claude Code (or save it as `docs/specs/000-website-brief.md` in a new repo and ask Claude Code to work from it). Work runs **one phase at a time**. At the end of each phase, stop, summarise what changed, and wait for approval.
>
> Items in `[BRACKETS]` are facts only Shishir can supply. Never invent them.

---

## 0. Role and mission

You are a senior product engineer and design engineer building **SaralLabs.com**, the home of **Saral Labs**, a Sydney-based software studio founded by Shishir.

*Saral* (सरल) is Sanskrit/Hindi for **simple**. The site has one job: **show that Saral Labs helps clients reach their goals with simple, well-engineered solutions.** Everything on the site should prove that promise by example: it should be fast, clear, calm and visibly ahead of what most small-business and studio websites do today.

Success means that a visitor:

1. Understands what Saral Labs offers within 5 seconds.
2. Trusts the engineering depth behind it.
3. Thinks "I want my website to feel like this", and starts a conversation.

---

## 1. Inputs Shishir must confirm before Phase 2

Put these in `docs/open-questions.md` and ask about any that are still open at the end of Phase 1.

| # | Question | Default until answered |
|---|---|---|
| Q1 | Is Saral Labs a trading name of Saral Infotech, a new entity, or a rename? What ABN goes in the footer? | `[ABN]` placeholder |
| Q2 | Tagline: keep "Simplicity in Innovation", or use one of: "Simple software, built to grow", "Make it simple.", "Simple by design."? | "Simplicity in Innovation" |
| Q3 | Which client names and logos can be shown (MPT, Drive2Door, Mac Precitec India)? | Anonymised case studies |
| Q4 | How should the founder's day-job experience be described? | "10+ years building platforms in regulated financial services". **Never name a current employer.** |
| Q5 | Which products are public: Planbox, Trellis? Which experiments may appear in Labs (Prabal, CareBridge, the grocery health app)? | Planbox and Trellis as "In development". Labs section hidden |
| Q6 | Contact channel: email only, or also a booking link (for example Cal.com)? | `hello@sarallabs.com` |
| Q7 | Pricing shown or "Talk to us"? | "Talk to us" |
| Q8 | Real testimonials available? | Omit the section. **No fake testimonials, ever** |

---

## 2. Brand system (source of truth)

**Logo.** Use the supplied raster `brand/source/saral-labs-logo.png`:

- The mark is an S-shaped stroke that grows into a leaf sprout, blending yellow to orange.
- The wordmark is **SARAL** in bold gold and **LABS** in light orange, with the tagline beneath it.

Tasks:

- Redraw the logo as clean, optimised SVG. Flag the redraw for human review and do not auto-trace blindly.
- Produce these versions:
  - full colour, stacked
  - full colour, horizontal
  - mark only
  - flat two-colour (no gradient, no shadow)
  - all white
  - all dark
  - favicon set: 16, 32, 180 and 512 px, plus a maskable 512 px icon

  At 16 and 32 px, simplify the mark. Drop the thin tail if it disappears.
- Never add bevels, drop shadows or textures to the SVG. Those belong only to hero art.

**Palette.** Define these as W3C Design Tokens (DTCG JSON) and generate CSS custom properties using OKLCH, with hex fallbacks.

| Token | Hex | Use |
|---|---|---|
| `color.ink.950` | `#0F1315` | Primary background (dark-first) |
| `color.gold.500` | `#D5B15B` | "SARAL", headings accents, tagline |
| `color.gold.700` | `#B89042` | Gold on light backgrounds |
| `color.gold.300` | `#F3DB7C` | Highlights |
| `color.orange.500` | `#E77A29` | "LABS", primary action |
| `color.yellow.400` | `#F6CD3F` | Sprout tip, focus rings, sparks |
| `gradient.sprout` | `#F6CD3F → #EFB038 → #ED902F` | The mark and hero art only |
| Neutrals | Warm greys derived in OKLCH from `ink.950` | Body text, surfaces |

- Provide a light theme as well, using `light-dark()` and `prefers-color-scheme`, plus a manual toggle.
- All text must meet WCAG 2.2 AA contrast. Gold on light backgrounds must use `gold.700` or darker.

**Typography**

- Wordmark and headings: **Montserrat** (variable, self-hosted, subset).
- Body: a highly legible variable sans with a different character from Montserrat (for example Inter Tight, Geist or Figtree). Self-host it and set `font-display: swap`. Match fallback metrics with `size-adjust` so the layout doesn't shift when the font loads.
- Use a fluid type scale with `clamp()`, `text-wrap: balance` on headings and `text-wrap: pretty` on body text.

**Brand metaphor**, used consistently:

- **Seed → Sprout → Grow.** Simple beginnings that grow.
- **Tangled → Single line.** Complexity untangled into one clear path.

**Voice**

- Plain Australian English and short sentences.
- Facts over adjectives: "Pages load in under 1 second", not "blazing fast".
- Confident but honest. Mark anything not yet built as "In development".
- Explain the meaning of *Saral* once, on Home and About, and nowhere else.
- No buzzword soup, no invented metrics, no invented clients.

---

## 3. Offerings to market

Each service gets its own page. Use this structure for every one: **the problem → the simple solution → what you get → how it works → example → call to action.**

| Service | Who it's for | Example outcome to show |
|---|---|---|
| **Websites that work** (design, build, managed hosting, SEO foundations, analytics) | Small businesses, trades, manufacturers, owner-operators | A B2B manufacturer's site built around a request-for-quote (RFQ) funnel with privacy-friendly analytics (based on Mac Precitec India, anonymised unless Q3 allows) |
| **Booking and scheduling systems** | Owner-operators, service businesses, transport | A solo taxi owner goes from enquiry to quote to confirmed ride with automatic driver notifications (Planbox) |
| **AI and agent automation** | Teams drowning in repetitive admin | Enquiries triaged and replies drafted automatically. Principle: **"the model proposes, deterministic code decides"**, with evaluations before scale |
| **Custom web and mobile apps** | Businesses with a workflow no off-the-shelf tool fits | Customer portal, internal dashboard, React Native app |
| **Cloud, platform and cost clarity** | Businesses with a confusing cloud bill | AWS/GCP setup with infrastructure as code (Terraform/CDK) and per-client cost tagging, so every dollar has an owner |

**Capabilities band** (show as a restrained, logo-free list, not a wall of icons):

- TypeScript and Node.js
- React, Next.js, Astro, React Native/Expo
- Postgres and pgvector
- AWS and GCP (Cloud Run, Cloud SQL)
- Terraform and AWS CDK
- Claude and MCP agent systems, LLM evals and observability
- Spec-driven delivery
- Security and compliance thinking from regulated financial services

**Products** (from Q5):

- **Planbox:** scheduling and booking for owner-operator transport businesses.
- **Trellis:** an agent-native task manager that breaks a big goal into sub-tasks and shows where work is stuck.

Each gets a card on Home, a page at `/products/<name>`, and a link to `<name>.sarallabs.com` when that app is live.

**How we work** (four steps, mapped to the sprout):

1. **Discover:** understand the goal.
2. **Simplify:** find the smallest thing that delivers it.
3. **Build:** ship in small, tested slices.
4. **Grow:** measure, then improve.

---

## 4. Information architecture

```
/                         Home
/services                 Overview
/services/websites
/services/booking-systems
/services/ai-automation
/services/custom-apps
/services/cloud
/products                 Overview
/products/planbox
/products/trellis
/work                     Case studies (anonymised until Q3)
/labs                     Experiments + field notes (hidden until Q5)
/notes                    Articles (MDX): engineering write-ups, plain-English guides
/about                    Story, meaning of Saral, founder, principles
/under-the-hood           How this site is built + live performance numbers
/health-check             Free website health check tool
/start                    Start a project (Ask Saral + contact form)
/privacy  /terms
/llms.txt  /sitemap.xml  /robots.txt  /.well-known/security.txt
```

**Home page sections, in order:**

1. **Hero.** Living sprout visual (see 5.1), headline, one-line promise, one primary call to action ("Start a project") and one quiet secondary ("Check your website").
   - Headline candidates: "Simple solutions. Real results." / "We make the complex simple, so you can reach your goal."
2. **Tangled → Simple scroll story** (see 5.2).
3. **Services** grid (5).
4. **Products** (Planbox, Trellis).
5. **How we work** (4 steps).
6. **Proof:** case studies. Show metrics only if they are real; otherwise omit.
7. **"This site is the demo"** band: live Lighthouse/Core Web Vitals numbers, linking to `/under-the-hood`.
8. **Ask Saral** call to action.
9. **Footer:** ABN, location (Sydney, Australia), email, socials, subdomain product links.

One primary action per page, repeated. Never place competing buttons side by side.

---

## 5. Next-generation experience (required)

Every feature must be **progressively enhanced**: the site works fully with JavaScript off, respects `prefers-reduced-motion`, and passes the performance budget in section 7.

### 5.1 Living sprout hero

- Build a WebGPU scene (falling back to WebGL2, then to a static SVG). Particles or strokes in the sprout gradient assemble into the S-sprout mark and gently "breathe".
- It reacts subtly to pointer and scroll, never to the point of distraction.
- Load it lazily after LCP. Pause it when off-screen (IntersectionObserver) and when the tab is hidden.
- Keep it under 60 KB gzipped.
- With reduced motion, show the static SVG.

### 5.2 "Tangled → Simple" scroll story

- Use CSS scroll-driven animations (`animation-timeline: view()`), with an IntersectionObserver fallback.
- A tangle of SVG paths labelled with real pain points ("five tools", "manual bookings", "surprise cloud bill") untangles into a single clean gold line ending in the sprout.
- This is the brand metaphor. Make it the most memorable moment on the site.

### 5.3 Instant, app-like navigation

- **Cross-document View Transitions API:** shared-element morphs for the logo, service cards and product cards.
- **Speculation Rules API:** prerender likely next pages on hover or intent.
- **Command palette** (⌘K / Ctrl+K): navigate, search and start a project. Build it on static search (Pagefind or equivalent).

### 5.4 Ask Saral: an AI project-scoping concierge

A chat panel on `/start`, also openable from anywhere, that turns a visitor's goal into a **structured project brief**:

- goal
- current pain
- constraints (budget band, timeline)
- suggested simple solution
- phased outline
- open questions

The visitor reviews and edits the brief, then sends it. It arrives by email, and optionally lands in a CRM.

- **Architecture:** a separate API service (`apps/api`) calling the Claude API with server-side keys.
  - Keep the model ID in an environment variable. Never hard-code it, and verify current model IDs against the provider's docs at build time.
  - Stream the responses.
  - Structured output validated against a Zod schema.
  - Tool calls allowed: `list_services`, `get_service`, `get_case_study`, `create_brief`.
- **Guardrails:**
  - It never quotes prices or promises dates.
  - It stays on the topic of Saral Labs.
  - It refuses prompt-injection attempts.
  - Rate-limited per IP and session, with a hard monthly spend cap and a kill switch.
  - Explicit consent before any personal data is stored.
  - Deterministic validation of every brief before it is sent.
- **Evals first:** before launch, build `evals/concierge/` with at least 30 scripted conversations covering:
  - happy paths across all 5 services
  - off-topic questions
  - injection attempts
  - price-fishing
  - vague goals

  Score them with deterministic checks plus an LLM grader. Evals run in CI, and the launch gate is at least 90% passing with zero price or date promises.
- **Fallback:** if the API is unavailable, show a simple form with the same fields.

### 5.5 Website health check (lead magnet)

- On `/health-check`, a visitor enters their URL. The server calls the Google PageSpeed Insights API and shows:
  - Core Web Vitals
  - accessibility and SEO scores
  - 3–5 plain-English fixes, each with a "why it matters for your business" line
- Offer "Compare with SaralLabs.com" side by side, which is the aspirational moment.
- Rate-limit it, cache results for 24 hours, and never store URLs without consent.

### 5.6 Agent-ready web

The site should be easy for AI assistants to read and use.

- `/llms.txt` and `/llms-full.txt`, generated from content.
- Complete schema.org JSON-LD: `Organization`, `LocalBusiness`, `Service`, `SoftwareApplication` (products), `FAQPage`, `Article`, `BreadcrumbList`.
- **Optional, Phase 5 stretch:** a read-only **MCP server** at `mcp.sarallabs.com` exposing `list_services`, `get_case_study` and `request_contact`. Document it on `/under-the-hood` as a live demonstration of agent integration capability.

### 5.7 Living proof: `/under-the-hood`

- A page that explains the stack, the portability architecture (section 6) and the principles.
- It shows **live** numbers: Lighthouse CI results from the latest deploy (a build artefact), bundle sizes and the latest deploy time.
- End with the call to action: "Want your site to work like this? Start a project."

### 5.8 Modern CSS and platform features

- Container queries, `:has()`, cascade layers, native nesting, OKLCH plus `color-mix()`, `light-dark()`.
- Popover API and `<dialog>` for overlays. Anchor positioning, with a fallback.
- Subtle scroll-linked reveals, limited to one orchestrated reveal per section.
- Installable PWA with an offline page, but no aggressive caching of HTML.

**Do not use:** autoplay video, parallax on body text, cursor-follower gimmicks, heavy gradient backgrounds, stock photos of people pointing at laptops, or emoji.

---

## 6. Built to change: portability architecture

The website must outlive any single framework. **The content, design tokens and business logic are the assets; the framework is a replaceable adapter.**

### 6.1 Repository layout (monorepo)

```
sarallabs/
├── apps/
│   ├── web/                 # Framework adapter (Astro today). Thin: routing, layouts, islands.
│   └── api/                 # Ask Saral + health check. Framework-light HTTP service, OpenAPI contract.
├── packages/
│   ├── content/             # ALL copy: MDX/Markdown + YAML/JSON, validated by Zod schemas. No framework imports.
│   ├── tokens/              # DTCG design tokens → Style Dictionary → CSS vars / TS / JSON.
│   ├── ui/                  # Framework-agnostic components: semantic HTML + CSS; interactive ones as Web Components.
│   ├── hero/                # WebGPU/WebGL sprout scene as a standalone Web Component.
│   └── schemas/             # Shared Zod schemas (content, brief, API I/O).
├── evals/concierge/         # Eval cases, graders, reports.
├── brand/                   # Logo source, SVG exports, usage rules.
├── infra/                   # Terraform: modules/ + envs/ (prod, preview).
├── docs/
│   ├── specs/               # Versioned specs (spec-driven delivery, e.g. OpenSpec).
│   ├── decisions/           # ADRs: ADR-001 framework, ADR-002 hosting, ADR-003 AI provider...
│   ├── open-questions.md
│   └── PORTABILITY.md       # Step-by-step "how to replace the framework" guide.
└── README.md
```

### 6.2 Rules the agent must enforce

These are enforced structurally with lint rules (for example `eslint-plugin-boundaries` or dependency-cruiser), not just by convention.

1. **No copy inside components.** All user-facing text lives in `packages/content`.
2. `packages/content`, `packages/tokens` and `packages/schemas` **must not import** any UI framework.
3. **Interactive UI is built as Web Components** (Lit or vanilla), so it runs under any future framework. The framework layer only places them.
4. **Static-first output.** Every marketing page builds to plain HTML/CSS that can be served from any CDN. Only `apps/api` needs a runtime.
5. **The API is defined by an OpenAPI spec first.** The web app calls it through a generated client, so either side can be rewritten independently.
6. **Vendors sit behind thin interfaces:** AI provider, email, analytics, CRM (`packages/schemas` defines the contracts). Swapping a vendor means changing one adapter.
7. **Configuration comes from environment variables:** model IDs, API keys and feature flags. Nothing is hard-coded.
8. Every significant choice gets an **ADR**. `PORTABILITY.md` stays current.

### 6.3 Recommended stack for today

**Verify each version is current stable at build time, then record it in ADR-001.**

| Concern | Choice | Why |
|---|---|---|
| Web framework | **Astro** (islands, content collections, static output, View Transitions support) | Content-first, framework-agnostic islands, output is plain HTML |
| Interactive components | **Lit Web Components** | Standards-based, portable |
| Styling | Modern CSS + tokens (Tailwind optional, only if it consumes the token CSS vars) | No lock-in |
| Content | MDX + Zod-validated collections | Portable text |
| API | TypeScript on **Hono** (runs on Node, Bun, Cloud Run, or edge runtimes) | Runtime-portable |
| Search | Pagefind (static) | No server |
| Workspace | Bun workspaces or pnpm + Turborepo | Fast; matches the existing toolchain |
| Analytics | Privacy-friendly (Plausible or self-hosted Umami); consent-aware; `track()` wrapper with `data-hook` attributes | Swap-friendly |
| Testing | Vitest, Playwright (end-to-end + visual regression), axe-core, Lighthouse CI | Quality gates |
| Dependency updates | Renovate with grouped weekly PRs | Staying current is routine |

### 6.4 Staying current

- Add `docs/TECH-RADAR.md` with **Adopt / Trial / Assess / Hold**, reviewed quarterly. Each quarter, pick at most one "Trial" item to add to the site behind a feature flag, and write about it on `/notes`.
- Feature flags (env-driven) wrap every experimental browser API, so it can be switched on or off without a code change.

---

## 7. Quality bar (launch gates, enforced in CI)

| Gate | Target |
|---|---|
| Lighthouse (mobile) | ≥ 98 on Performance, Accessibility, Best Practices and SEO, on every page |
| Core Web Vitals (lab, mobile) | LCP < 1.8 s · INP < 150 ms · CLS < 0.05 |
| JavaScript on Home (initial, excluding lazy hero) | < 80 KB gzipped |
| Hero scene | < 60 KB gzipped, loaded after LCP |
| Accessibility | WCAG 2.2 AA; zero axe violations; full keyboard support; visible focus; screen-reader tested on key flows |
| Reduced motion / no JS | All content and contact paths work |
| Concierge evals | ≥ 90% pass; zero price or date promises; zero successful injections |
| Security | Strict CSP (no `unsafe-inline` scripts), HSTS, secure headers, secrets only in Secret Manager, rate limits on all API routes |
| Privacy | Australian Privacy Principles-aware privacy page; consent before analytics or storing personal data |
| SEO | Unique titles and descriptions, OG/Twitter images generated per page, canonical URLs, sitemap, JSON-LD validated |

---

## 8. Hosting and infrastructure (GCP, all in Terraform)

- A dedicated GCP project, `saral-platform`, separate from the Planbox and Trellis projects, with labels on every resource and a **budget alert** at `[AUD amount]`.
- Domain: `sarallabs.com` registered through **Cloud Domains**, DNS in **Cloud DNS**.
  - Apex serves the site; `www` redirects to the apex.
  - Reserve records for `trellis.`, `planbox.`, `api.`, `docs.`, `status.` and optionally `mcp.`.
- Static site: **Firebase Hosting** (global CDN, free managed SSL, preview channels per PR), with rewrites so that `/api/**` goes to **Cloud Run** (`apps/api`).
- **Flag any resource with a fixed monthly cost** (for example a global load balancer) and do not create it without approval.
- CI/CD: GitHub Actions with Workload Identity Federation (no long-lived keys), a preview deploy on every PR, and production on merge to `main` after all gates pass.
- Email: MX records for `hello@sarallabs.com` (provider `[TBC]`), with SPF, DKIM and DMARC configured.

---

## 9. Delivery plan (stop after each phase)

| Phase | Output | Exit criteria |
|---|---|---|
| **0. Spec** | `docs/specs/` from this brief, ADR-001 (framework), ADR-002 (hosting), ADR-003 (AI provider), open-questions list | Shishir approves the spec |
| **1. Foundations** | Monorepo, tokens, fonts, boundary lint rules, CI with all gates (initially on a placeholder page), logo SVG set | CI green; tokens render in both themes |
| **2. Content and pages** | All pages in section 4 as static HTML with real copy (placeholders where Q1–Q8 are open) | Lighthouse ≥ 98; axe clean; copy reviewed |
| **3. Next-gen layer** | Sections 5.1–5.3 and 5.8 behind feature flags | Budgets still met; reduced-motion verified |
| **4. Services** | `apps/api`: Ask Saral with evals (5.4), health check (5.5), OpenAPI contract | Eval gate met; rate limits and spend cap tested |
| **5. Agent-ready and proof** | llms.txt, JSON-LD, `/under-the-hood` live numbers, optional MCP server | Structured data validates; numbers update from CI |
| **6. Infrastructure and launch** | Terraform for section 8, DNS, email, production deploy, `PORTABILITY.md`, `TECH-RADAR.md` | Domain live over HTTPS; budget alert set; handover notes |

**Working style**

- Small vertical slices with one PR each.
- Tests written with the code.
- Write decisions back into the spec.
- Ask rather than guess when a fact is missing.
- Show screenshots at desktop (1440) and mobile (390) at the end of every UI phase.

---

## 10. Non-negotiables (summary)

1. No invented clients, metrics, testimonials or prices.
2. Never name Shishir's current employer.
3. Content, tokens and logic stay framework-free, so the framework can be swapped.
4. Every experimental feature is behind a flag and progressively enhanced.
5. Performance and accessibility gates block merges.
6. AI features are eval-gated, rate-limited, spend-capped and never make commitments on Saral Labs' behalf.
7. The site itself must embody *saral*: simple to use, simple to maintain, simple to change.
