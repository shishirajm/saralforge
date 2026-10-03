# Adding and updating guides

The Guides section is generated at build time from two kinds of source file. Do not edit anything under `dist/`.

| What | Where |
|---|---|
| Article text (HTML fragment, no `<html>` or `<h1>`) | `content/guides/<slug>.html` |
| Metadata, status, related reading, sources | `content/guides/guides.json` |
| Page template, library, JSON-LD, sitemap entries, validation | `scripts/guides.mjs` |
| Styles | the "Guides" blocks at the end of `src/styles.css` |
| Tests | `tests/guides.test.mjs` |

## Add a guide

1. Check that it answers a question no existing guide answers. Read `docs/guides-editorial-map.md` first.
2. Do the research. Fetch primary sources for any technical, legal or product claim, scan current search results for the question, and note both in `docs/guides-editorial-map.md` with the date. Do not copy wording from other sites.
3. Add an entry to `guides.json`:
   - `slug`: kebab-case. It becomes `/guides/<slug>.html` and should not change after publication.
   - `title`: becomes the H1 and the breadcrumb.
   - `metaTitle`: 58 characters or fewer and unique. The site name is added for you.
   - `description`: 70 to 170 characters, accurate, and written for a person.
   - `excerpt`: one specific sentence for the library listing and "Next reads".
   - `answer`: the short direct answer shown near the top.
   - `group`: `website`, `admin`, `app` or `help`.
   - `service`: `websites`, `booking`, `automation`, `apps` or `cloud`. This sets the contextual service link.
   - `status`: use `draft` while any fact awaits approval. Drafts are not rendered, listed, linked or in the sitemap.
   - `published` and `updated`: ISO dates (`YYYY-MM-DD`). Change `updated` only for a substantive change.
   - `related`: two or three other published guides.
   - `sources`: external pages you relied on, each with an `https` URL and a `reviewed` date.
4. Write `content/guides/<slug>.html` using only these elements: `p`, `h2`, `h3`, `ul`, `ol`, `table` (with `caption`, `thead` and `th scope`), `pre`, `aside`, `strong`, `a`, `code`. The renderer adds heading ids, the contents list, table column labels and the Sources section.
   - Useful classes: `ul.checklist`, `ol.steps`, `ol.decision`, `pre.copy-block`, and `aside.example` with `<p class="example-label">Hypothetical example</p>`.
   - Link internally with root-relative paths such as `/guides/other-slug.html` and `/services.html#apps`.
   - Label every invented example as hypothetical. Never invent a client, quote, result, price, qualification or number of years.
5. Link the new guide from at least one other guide (via `related` or in the text). The library lists it automatically.
6. Add its URL to `docs/url-inventory.csv` and, if it needs a decision, to the claims table in `docs/guides-editorial-map.md`.
7. Run `npm test`, then `npm run build`. Both fail with a readable list if metadata, links, anchors, drafts or orphans are wrong.
8. Look at the page in a browser at 320, 768 and 1440 px.

## Update a guide

1. Re-check the sources it cites, and update their `reviewed` dates only if you re-read them.
2. Edit the fragment. If the change is substantive, set `updated` in `guides.json`. A typo fix does not need it.
3. Update the editorial map if the sources or claims changed.
4. Run `npm test` and `npm run build`.

## Retire or hide a guide

Set `status` to `draft`. Then remove links to it from other guides' text and `related` lists, because the tests will fail while anything links to a draft. If the URL was ever live, add a redirect in `firebase.json` and a row in `docs/url-inventory.csv` instead of letting it return a 404.

## Publishing gate

Published guides need `guidesEditorialApproved: true` in `docs/publishing-approvals.json` before `npm run check:production` passes. Only Shishir sets this, after reading the guides. A new or changed guide after that point should be reviewed the same way.

## What the tests enforce

One H1 per page, self-referencing canonical URL, unique titles and descriptions, JSON-LD that matches the visible title and date, "By Saral Forge" authorship, breadcrumbs, contents list, a service link and an enquiry link on every guide, table captions and labels, hypothetical examples labelled, no price or experience figures, no orphan pages, every guide in the library and sitemap, no draft anywhere, Guides in every nav and footer, and noindex only on preview builds.
