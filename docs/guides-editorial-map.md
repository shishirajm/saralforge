# Guides editorial map

Drafted 3 October 2026 (Australia/Sydney). Source: `content/guides/guides.json` and `content/guides/<slug>.html`. How to add or update a guide: [guides-authoring.md](guides-authoring.md). Plan: [plans/2026-10-03-guides-section.md](plans/2026-10-03-guides-section.md).

## Status and approvals

- All 20 guides are `published` in the manifest, so they are built, listed and in the sitemap.
- Shishir reviewed the guides locally and approved publication in chat on 3 October 2026. `guidesEditorialApproved` is now `true` in `docs/publishing-approvals.json`.
- Authorship is "By Saral Forge". Personal authorship has not been approved, and no article says "Reviewed by".
- Dates: every article shows publication date 3 October 2026. `updated` equals `published` until a substantive change is made.

## Research method, stated plainly

- **Search-results scan.** For all 20 questions I ran a web search on the primary question and read the returned titles and summaries to see the likely intent and the common angles. I did not read competitor articles in full. I copied no wording or structure. The scan showed that many pages quote prices, cost bands and success statistics. The guides deliberately include none of these, because none could be verified.  The scan for guide 12 (scoping) was run after drafting, and is described below.
- **Primary sources fetched** on 3 October 2026 for technical claims: the three Google Search Central pages named in the brief (helpful content, SEO starter guide, Article structured data), plus Google's noindex, sitemap and canonicalisation pages, the Search Console page indexing report, the W3C WAI forms tutorial, the OWASP Top 10 site, and the OAIC small business privacy page.
- **Not verified.** The Australian Cyber Security Centre small business page timed out twice, so it is not cited and no claim relies on it. The OWASP fetch confirmed only that the current edition is 2025. The guides name no individual OWASP categories.
- Search phrases below are **intent hypotheses**, not measured volumes. No traffic, keyword-difficulty or ranking estimate is made anywhere.

## Articles

| # | Slug | Group | Intent hypothesis | Primary sources (checked 3 Oct 2026) | Next reads | Service link | Notes and claims to check |
|---|---|---|---|---|---|---|---|
| 1 | `website-visitors-no-enquiries` | Website | "website not getting enquiries", "visitors but no leads" | W3C WAI Forms | enquiry form, website checklist, project brief | websites | General audit. The electrician example is fictional and labelled. |
| 2 | `website-builder-or-custom-website` | Website | "website builder vs custom website" | None. General guidance. | website checklist, cost factors, ownership | websites | Names no platform and no price. The scan showed pages quoting price bands; none was used. |
| 3 | `small-business-website-checklist` | Website | "what does a small business website need" | Google SEO Starter Guide | no-enquiries, not on Google, builder vs custom | websites | Google Business Profile is mentioned only as something to check. The bookkeeper example is fictional. |
| 4 | `business-website-not-showing-on-google` | Website | "business website not showing on Google" | Google SEO Starter Guide; noindex; sitemaps; canonical URLs; Page indexing report; helpful content | website checklist, no-enquiries, builder vs custom | websites | States there is no indexing or ranking guarantee, quoting Google's position in paraphrase. Re-check Google's pages at each update. |
| 5 | `better-business-enquiry-form` | Website | "small business enquiry form", "website form best practices" | W3C WAI Forms | project brief, no-enquiries, enquiry-to-booking | websites | Describes this site's form accurately: it opens the visitor's own email app. Update if `start.html` or `app.js` changes. |
| 6 | `spreadsheet-or-small-business-app` | Admin | "replace spreadsheet with app", "business outgrown Excel" | None. General guidance. | duplicate entry, scope, app vs tool | apps | Treats spreadsheets as useful. The scan's "when not to replace" thresholds were not copied. |
| 7 | `reduce-duplicate-data-entry` | Admin | "automate duplicate data entry" | None. General guidance. | scope, what to automate, spreadsheet | automation | Illustrative plumbing flow is fictional and labelled. |
| 8 | `enquiry-to-booking-workflow` | Admin | "small business booking workflow" | None. General guidance. | enquiry form, what to automate, portal | booking | Wedding-photographer path is fictional, labelled, and not a client result. |
| 9 | `what-to-automate-first` | Admin | "small business automation ideas" | None. General guidance. | AI vs automation, enquiry-to-booking, duplicate entry | automation | Worksheet scores are labelled as invented, not benchmarks. |
| 10 | `ai-or-workflow-automation` | Admin | "AI vs automation for small business" | None. General guidance. | enquiry-to-booking, what to automate, AI-built app | automation | The "AI proposes, rules decide" pattern mirrors the approved Services wording. The scan showed cost comparisons; none used. |
| 11 | `app-website-or-existing-tool` | App | "does my business need an app", "web app vs website" | None. General guidance. | AI-built app, scope, spreadsheet | apps | Defines web app and native app in plain words. |
| 12 | `scope-small-business-app` | App | "how to plan a small business app", "MVP scope" | None. General guidance. | project brief, AI-built app, cost factors | apps | Search scan run after drafting (see below). Equipment-hire scope is fictional and labelled. |
| 13 | `ai-built-app-production-checklist` | App | "is an AI built app production ready" | OWASP Top 10 (edition 2025 only) | maintenance, when to involve a developer, scope | apps | No fear-based claims and no statistics. The scan's survey figures were not reused. Tutoring example is fictional. |
| 14 | `customer-portal-or-email` | App | "does my small business need a customer portal" | None. General guidance. | app vs tool, enquiry-to-booking, maintenance | apps | The scan's customer-behaviour percentage was not reused. Renovator example is fictional. |
| 15 | `small-business-app-maintenance` | App | "small business app maintenance" | None. General guidance. | ownership, AI-built app, cost factors | apps (also links to cloud) | Invents no Saral Forge support package, response time or uptime promise, and warns against such promises. The scan's "15–20% of build cost" figure was not used. |
| 16 | `when-to-involve-a-developer` | Help | "do I need a developer for my small business" | None. General guidance. | choosing a provider, cost factors, project brief | apps | Central article. Has a one-paragraph description of Saral Forge, drawn only from approved claims. No savings claims. |
| 17 | `diy-freelancer-studio-or-agency` | Help | "freelancer vs agency website" | None. General guidance. | cost factors, project brief, ownership | apps | Discloses that Saral Forge is a studio with an interest. States no team size. Says no option is always best. |
| 18 | `small-website-app-cost-factors` | Help | "small business website cost factors" | None. General guidance. | project brief, choosing a provider, scope | websites | States clearly that it is not a price list. No rates, ranges or percentages. |
| 19 | `website-app-project-brief` | Help | "website project brief template" | None. General guidance. | cost factors, scope, enquiry form | websites | Describes `start.html` as it behaves: needs the visitor's email app, sends nothing itself. Brief example is fictional. |
| 20 | `website-app-ownership-handover` | Help | "do I own my website code", "website developer handover checklist" | OAIC small business and privacy | maintenance, choosing a provider, when to involve a developer | cloud | Not legal advice, stated in the text. Does not assert that payment transfers ownership. Mentions the Privacy Act only to point to OAIC guidance, with no threshold quoted, since thresholds can change. |

### Scan for guide 12

Run on 3 October 2026 after drafting. The results were consistent with the article: one user, one problem, cut anything that is not needed for the first version. One angle was absent from the draft, which was to test the riskiest part first. A line to that effect was added to the "What you can do without hiring anyone" list. No wording was copied.

## Independent review log (3 October 2026)

Four named reviewers ran read-only. The primary agent verified each material finding and fixed the ones that held.

**Fixed**
- Decision-tree questions are now numbered in the text ("Question 2"), so "go to question 2" makes sense. (Accessibility)
- Tables with six or more columns now stack below 64rem, not just 48rem, so the eight-column worksheet cannot be clipped at tablet widths. (Accessibility)
- Explicit `role="list"` on lists styled without markers, so list semantics survive in Safari. The contents list no longer outgrows a short viewport. (Accessibility)
- `404.html` now uses root-relative links. Before this change a mistyped nested address such as `/guides/typo.html` would have rendered unstyled with dead links. (Robustness)
- Structured-data dates now use the correct Sydney offset for the date (+10:00 or +11:00 with daylight saving) instead of a fixed +11:00. (SEO)
- `/guides` now redirects to `/guides.html` in `firebase.json`. This redirect has been tested only as configuration, not against live Firebase. (Robustness)
- Open Graph image width, height and alt text added. The `article:author` string was removed. (SEO)
- Publishing check now compares each guide's structured data with its H1 and canonical URL, requires unique titles and descriptions, and rejects products and 404 in the sitemap. The approval gate requires exactly `true`. (Robustness)
- The build validates and renders before clearing `dist/`. Malformed manifest entries produce readable messages instead of crashes. Heading ids can no longer collide with template ids. HTML entities are decoded in headings and table labels. The sitemap renderer refuses an unusable base file. Dates, slugs, tables and body HTML are validated more strictly. Tests were added for each. (Code quality)
- Copy: generalisations such as "most" and "usually" were softened to "often" or "can", the "biggest savings" and "cheaper than guessing" lines were removed, the Google statements were narrowed to what the fetched pages say, the ownership guide's legal-sounding sentences were softened, the studio wording no longer implies a team size, the guide 10 reference to Saral Forge now points to the Services page, a hypothetical outcome is no longer stated as fact, and repeated section headings were varied by topic.

**Left as is, on purpose or for later**
- Page titles are shorter than their H1s. Google may rewrite titles; this is acceptable and keeps titles under 58 characters.
- Stacked tables hide the header row visually. The `data-label` text keeps each value labelled. Not tested with VoiceOver.
- Library rows are one long link each. Names are descriptive and match the visible text.
- Guides 6/11, 9/10, 15/20 and 16/17 still overlap in places by design, because each links to the other. If Shishir wants the overlap trimmed, that is an editorial choice.
- Several articles share the same final "Next reads" and closing aside. This is deliberate and the closing aside is one honest sentence.
- The `.guide-row` hover no longer animates padding. No other performance changes were needed.

## Reading paths

- No enquiries → enquiry form → project brief: guides 1 → 5 → 19.
- Spreadsheet → duplicate entry → app scope: 6 → 7 → 12.
- Automation priorities → AI vs automation → enquiry workflow: 9 → 10 → 8.
- App or existing tool → AI-built app readiness → maintenance: 11 → 13 → 15.
- Developer → provider → cost → brief: 16 → 17 → 18 → 19.

Each is implemented as `related` lists in the manifest and as inline links in the text. `tests/guides.test.mjs` fails if a published guide is an orphan or is not linked from the library.

## Claims register entries to approve

| Item | Where | Needed from Shishir |
|---|---|---|
| Editorial approval of all 20 guides | `guidesEditorialApproved` | Read and approve, or list changes |
| "Saral Forge is a Sydney studio that works with small business owners on websites and practical AI solutions. It also builds booking and workflow tools, custom applications and cloud systems." | Guide 16 | Confirm wording matches the approved claims |
| Reference to the Services page's "model proposes, deterministic code decides" wording | Guide 10 | Confirm. It now says "On its Services page". |
| Authorship "By Saral Forge" | All guides | Confirm, or approve personal authorship |
| Description of the project form as opening the visitor's email app | Guides 5, 19, and the closing note on every guide | Re-confirm if the form changes |

## Not done, by design

No analytics, tracker, newsletter, pop-up or gated content was added. No Search Console review or recurring monitoring has been set up. After publication, review indexing and queries in Search Console and track qualified enquiries separately from clicks, once Shishir agrees.
