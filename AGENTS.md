# Saral Forge Website Agent Guide

## Mission

Build and maintain SaralLabs.com as a clear, fast, accessible website for Saral Forge, demonstrating the studio's principle: simple software that moves real work forward.

The authoritative product and design brief is `inputs/sarallabs-website-build-prompt-v3.md`. Read the relevant sections before changing content, visual design, behaviour, accessibility, performance, analytics, forms, or publishing rules. Link to that brief instead of copying large parts of it into new documentation.

`inputs/index.html` and `inputs/services.html` are historical explorations. They may provide context, but must not guide the current layout, typography, components, interactions, or art direction. Preserve the approved logo; never silently redraw or reinterpret it.

## Working Agreements

- Inspect the current repository before proposing or making changes. The project may be under active construction, so do not assume that files described in plans already exist.
- Keep changes focused on the user's request. Preserve unrelated work and never discard or overwrite user changes.
- Prefer the smallest maintainable solution. Do not add production dependencies, frameworks, hosted fonts, external trackers, or services without explicit approval.
- Keep content, rendering, styling, browser behaviour, build logic, and tests separated by responsibility. Follow established patterns once they exist.
- Treat generated output as disposable. Change its source and rebuild it; do not hand-edit generated site files.
- Use Australian English and short, concrete sentences. Prefer evidence over adjectives.
- Never invent client names, testimonials, metrics, business identifiers, contact details, product status, experience claims, or results. Unverified facts must remain unpublished or visibly marked for approval in internal documentation.
- Do not assume Git is available. Use Git workflows only after confirming this directory is a repository.

## Build and Maintenance Workflow

1. Read the task, the relevant source files, nearby tests, and the applicable parts of the v3 brief.
2. Identify the user-visible outcome and the smallest safe change that produces it.
3. For behaviour changes and bug fixes, write or update a focused regression test first when practical.
4. Implement in source files, keeping public behaviour and content data explicit.
5. Run the narrowest relevant test while iterating, then run all available quality checks.
6. For user-interface changes, inspect the result in a real browser at mobile, tablet, and desktop widths.
7. Report what changed, what was verified, and any unresolved limitation or required factual approval.

Use commands defined by the current `package.json`; inspect it rather than guessing. The intended commands are:

- Focused test: `node --test tests/<relevant-file>.test.mjs`
- Full test suite: `npm test`
- Production build: `npm run build`
- Local preview: `npm run serve`

If a command or implementation is missing because the site is incomplete, report that clearly. Never claim completion while a relevant check fails. Distinguish failures introduced by the change from pre-existing failures, but do not hide either.

## Design and Content Rules

- Preserve the Editorial Growth identity and the Tangled to Simple visual idea from the v3 brief.
- The experience should feel current through strong typography, editorial composition, useful motion, and real evidence—not through fashionable decoration.
- Avoid generic bento grids, glassmorphism, aurora or Gemini-style gradients, gratuitous 3D, invented dashboards, excessive pills, ambient parallax, cursor followers, marquees, and scroll hijacking.
- Keep the approved blue, violet, ink, and lavender-paper palette (`--blue`/`--blue-dark`, `--violet`/`--violet-light`/`--violet-dark`, `--ink`, `--paper`/`--warm` in `src/styles.css`, mirrored in `src/design-tokens.json`), derived from the Saral Forge mark in `inputs/logo-2.png`. New text colour combinations require measured WCAG contrast via `src/check-contrast.mjs`.
- Keep the logo artwork clean. Texture, animation, and depth belong to the surrounding design system.
- Use real project material only when permission and claims are verified. Clearly distinguish client work, owned products, experiments, and work in development.
- Preserve native scrolling. Motion must explain growth, causality, or simplification and must have a composed reduced-motion state.

For a substantial new art direction or redesign, research 6–8 high-quality live websites that were published or materially updated within the previous 18 months. Record the review date, URL, mobile behaviour, one useful principle, and what must not be copied. Include restrained, usability-led references. Extract principles; never reproduce a reference layout. Routine maintenance and small UI changes do not require trend research.

## Quality Gates

Apply these gates in proportion to the change:

- **Accessibility:** Target WCAG 2.2 AA. Use semantic landmarks, a logical heading structure, keyboard-operable controls, visible focus, useful labels, sufficient contrast, touch-friendly targets, and meaningful error/status messages. Support `prefers-reduced-motion`, forced colours, and reduced transparency where relevant.
- **Responsive design:** Verify at 320 px, 768 px, and 1440 px or equivalent representative viewports. Prevent horizontal overflow, broken reading order, clipped controls, and fragile headline wrapping.
- **Performance:** Prefer static HTML, modern CSS, SVG, and small progressive-enhancement scripts. Avoid layout shifts, unnecessary client JavaScript, oversized assets, runtime animation libraries, canvas, and WebGL unless the user approves a documented need.
- **SEO and sharing:** Preserve unique titles and descriptions, canonical URLs when applicable, semantic content, crawlable navigation, structured data where justified, and useful social metadata.
- **Privacy and security:** Collect the minimum data, validate on the server when submission is enabled, escape untrusted content, keep secrets out of client code and the repository, and never imply that a preview form transmitted data when it did not.
- **Resilience:** Core content and navigation must remain useful without JavaScript. Interactive enhancements need clear empty, error, loading, and success states where applicable.
- **Content integrity:** Keep one meaningful H1 per page, put credible proof before strong conversion asks, and remove placeholders, fabricated evidence, and unsupported claims from publishable output.

## Subagents: Review Only

The primary agent owns implementation, integration, fixes, final verification, and the final report. Subagents are independent reviewers, not parallel implementers.

Use subagents when a substantial change has at least two independent review dimensions or before a release-sized handoff. Use the project's named reviewer subagents for these scopes, instead of reconstructing the scope from prose each session:

- `.claude/agents/a11y-responsive-reviewer.md` — accessibility and responsive behaviour;
- `.claude/agents/perf-seo-reviewer.md` — performance, SEO, and browser robustness;
- `.claude/agents/code-quality-reviewer.md` — correctness, security, tests, and maintainability;
- `.claude/agents/content-claims-reviewer.md` — brand, content, and claims integrity when copy or visual direction changed.

Run up to three non-overlapping reviews in parallel when tools and capacity allow. Give each reviewer a bounded scope, relevant files or diff, applicable constraints, and an explicit output format. Reviewers must remain read-only and return only prioritized findings with severity, evidence, and file references. They must not edit files, broaden scope, or repeat another reviewer's assignment.

Wait for every requested review. The primary agent must deduplicate the findings, verify each material claim against the code or rendered site, apply warranted fixes, and rerun the relevant checks. Do not blindly accept reviewer suggestions. Summarize conclusions rather than forwarding raw reviewer output.

Do not use subagents for:

- small copy edits or a localized one-file change;
- tightly coupled implementation work;
- debugging until independent failure domains are established;
- tasks where reviewers would need to edit the same files;
- work whose coordination cost exceeds its likely quality benefit.

If subagents are unavailable, perform the same reviews serially. Never delegate final acceptance or completion claims.

**Phase-sized work.** For work matching a full phase in the v3 brief's delivery plan (§9) — for example Phase 2's two homepage directions, Phase 3's full launch-page set, or a complete R1–R3 roadmap feature — do not run it as a single-shot change with no checkpoint. Write a short plan first (what will change, in what order, how it will be verified), save it under `docs/plans/`, implement against it, and run the named reviewers above before reporting it done. This is additive to, not a replacement for, the direct workflow above, which still applies to single-surface changes and everyday fixes. The Superpowers plugin was deliberately uninstalled; do not reinstall or invoke it unless the user explicitly asks.

## Completion Standard

A task is complete only when the requested outcome exists in the source, relevant automated checks pass, and proportionate browser verification has been performed. Before finishing:

- review the diff or changed files for accidental scope creep;
- confirm that generated output, documentation, and tests agree with the source;
- check keyboard use, narrow-screen layout, reduced motion, and visible failure states when relevant;
- state any check that could not be run and why;
- list factual, legal, privacy, or publishing approvals still required.

## Ongoing Maintenance

These apply once the relevant piece exists — most are not yet relevant to a pre-launch site. All of them are scheduled, read-only, reporting runs (for example via the `/loop` or `/schedule` skills): they surface findings for Shishir to act on and never edit production content or infrastructure themselves.

- **Dependency updates:** handled by Renovate once CI exists (v3 §6.4). Review its PRs like any other change; no separate agent task needed.
- **URL and redirect integrity:** once `docs/url-inventory.csv` exists (v3 §6.1), periodically confirm every listed URL still resolves or has a recorded redirect. Report breakage; do not auto-fix routing.
- **Performance and accessibility regression:** once a live or preview deployment exists, periodically rerun the Lighthouse/axe checks from v3 §7.1 against it and compare to the last recorded baseline. Report regressions; do not auto-tune styles, scripts, or markup to chase a score.
- **Claims re-verification:** periodically re-check that entries already marked `verified` in `docs/claims.md` still hold — a case-study metric, a product status, a contact detail. Flag anything that may have drifted; never mark a claim verified from this check alone.

## Nested Agent Guides

Create nested `AGENTS.md` files only when a directory develops genuinely different commands or constraints. Keep shared rules here and place only the narrower override close to the specialised code.
