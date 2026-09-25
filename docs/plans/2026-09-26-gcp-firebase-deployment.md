# Saral Forge GCP and Firebase deployment plan

Date: 26 September 2026

Authoritative brief: [`inputs/sarallabs-website-build-prompt-v3.md`](../../inputs/sarallabs-website-build-prompt-v3.md), especially sections 7, 8 and 10.

## Outcome

Prepare and verify the static site for Firebase Hosting, deploy a non-indexed preview to a dedicated website project, then connect `saralforge.com` only after the publishing gate is complete.

The user's domain instruction supersedes the older `sarallabs.com` domain references in the brief. It does not waive the brief's claims, privacy or contact-verification gates.

## GCP project boundaries

Keep shared domain control separate from product runtimes:

- `saralforge-core-prod`: domain registration, the public Cloud DNS zone, DNSSEC, shared budget alerts and narrowly scoped deployment identities.
- `saralforge-web-prod`: Firebase Hosting for `saralforge.com`; `www.saralforge.com` redirects to the apex.
- `trellis-prod`: Trellis runtime, storage, secrets, monitoring and the `trellis.saralforge.com` custom-domain mapping.
- `planbox-prod`: Planbox runtime, storage, secrets, monitoring and the `planbox.saralforge.com` custom-domain mapping.

Use one project per product and environment when a non-production environment is needed, for example `trellis-dev` rather than putting development resources in `trellis-prod`. Keep the apex public DNS zone central for now; delegate a product subdomain to its own DNS zone only when a separate team needs independent DNS administration.

The registration and public zone currently live in `trellis-app-504909`. Do not move or rename live resources during this website release. Use that zone only to add the Firebase records, then plan a separate, rollback-tested migration to the shared core project if the existing project contains Trellis infrastructure that cannot be cleanly separated.

## Deployment status

- `saralforge-web-prod` is the dedicated Firebase Hosting project for the website.
- A non-indexed preview is deployed at `https://saralforge-web-prod--preview-xj1a3fpm.web.app` until 26 October 2026.
- A monthly A$15 budget alert, approximately matching the requested US$10 budget, is scoped to the website project. It alerts at 50%, 90%, actual 100% and forecast 100%; it is not a hard spend cap.
- Shishir has approved the primary audience and offer, final copy and claims, and the Sydney/Australia identity. ABN publication is deferred.
- `forgesaral@gmail.com` is the intended contact destination, but delivery has not been implemented or tested. The enquiry retention period also awaits approval.
- The apex domain and `www` remain unchanged until the production gate passes.

## Order of work

1. Replace production URL metadata with `https://saralforge.com` while retaining preview `noindex` protection.
2. Add dependency-free tests, a reproducible static build, Firebase Hosting configuration, and a public URL inventory.
3. Run source validation, the production build, the full tests, and local browser checks.
4. Create or select `saralforge-web-prod` as a dedicated GCP/Firebase project with resource labels and no fixed-cost infrastructure.
5. Deploy the built site to a Firebase preview channel and smoke-test every route.
6. Run the named accessibility/responsive, performance/SEO, code-quality, and content/claims reviews. Resolve warranted findings and rerun checks.
7. Before a production deploy or custom-domain cutover, verify the contact destination, retention policy, legal identity requirements, approved audience/offer, and publishable claims. Remove `noindex` and enable form delivery only when those facts and the end-to-end delivery path are approved.
8. Connect the apex domain as canonical, redirect `www` to the apex, verify managed TLS and DNS, and document rollback to the previous Firebase release.

## Verification

- `npm test`
- `npm run build`
- `node src/check-contrast.mjs`
- JavaScript syntax, XML validity, local-link integrity, one H1 per page, canonical/OG domain consistency, and absence of publish-blocking placeholders
- Browser checks at 320 px, 768 px and 1440 px, including keyboard navigation and reduced motion
- Preview smoke tests for `/`, all public routes, assets, the custom 404 response, and security headers
- Production DNS, HTTPS, apex canonicalisation and `www` redirect checks after cutover

## Rollback

Before domain cutover, record the current Firebase release. If a critical route, asset, TLS, accessibility or data-handling check fails, roll back to the previous Firebase Hosting release and leave the domain in its prior DNS state.
