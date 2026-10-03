import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist');
const production = process.argv.includes('--production');
async function htmlFilesIn(directory, prefix = '') {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) found.push(...await htmlFilesIn(path.join(directory, entry.name), `${prefix}${entry.name}/`));
    else if (entry.name.endsWith('.html')) found.push(`${prefix}${entry.name}`);
  }
  return found;
}
const htmlFiles = await htmlFilesIn(src);
const publicHtmlFiles = htmlFiles.filter((file) => !['404.html', 'products.html'].includes(file));
const failures = [];
const robots = await readFile(path.join(src, 'robots.txt'), 'utf8');
const pages = await Promise.all(htmlFiles.map((file) => readFile(path.join(src, file), 'utf8')));

for (const file of htmlFiles) {
  const text = await readFile(path.join(src, file), 'utf8');
  if (/\[(?:ABN|CONTACT EMAIL|AUD)\]|\b(?:TBD|lorem ipsum)\b/i.test(text)) {
    failures.push(`${file}: contains a publishing placeholder`);
  }
  if (text.includes('https://sarallabs.com')) {
    failures.push(`${file}: still refers to sarallabs.com`);
  }
}

const { loadGuides, SITE } = await import('./guides.mjs');
const library = await loadGuides();
const expectedGuides = new Set(library.published.map((guide) => `guides/${guide.slug}.html`));
const builtGuides = htmlFiles.filter((file) => file.startsWith('guides/'));
for (const file of builtGuides) if (!expectedGuides.has(file)) failures.push(`${file}: built but not a published guide in content/guides/guides.json`);
for (const file of expectedGuides) if (!builtGuides.includes(file)) failures.push(`${file}: published guide is missing from the build`);
const sitemap = await readFile(path.join(src, 'sitemap.xml'), 'utf8');
for (const file of ['guides.html', ...expectedGuides]) {
  if (!sitemap.includes(`<loc>${SITE}/${file}</loc>`)) failures.push(`sitemap.xml: missing ${file}`);
}
for (const guide of library.guides.filter((item) => item.status !== 'published')) {
  if (sitemap.includes(`/guides/${guide.slug}.html`)) failures.push(`sitemap.xml: lists draft ${guide.slug}`);
}
for (const unlisted of ['products.html', '404.html']) if (sitemap.includes(`/${unlisted}</loc>`)) failures.push(`sitemap.xml: lists ${unlisted}`);
const seen = { title: new Map(), description: new Map() };
for (const file of builtGuides) {
  const html = await readFile(path.join(src, file), 'utf8');
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (html.match(/<meta property="og:url" content="([^"]+)">/)?.[1] !== canonical) failures.push(`${file}: og:url does not match canonical`);
  for (const field of ['title', 'description']) {
    const value = field === 'title' ? html.match(/<title>([^<]+)<\/title>/)?.[1] : html.match(/<meta name="description" content="([^"]+)">/)?.[1];
    if (!value) { failures.push(`${file}: missing ${field}`); continue; }
    if (seen[field].has(value)) failures.push(`${file}: ${field} duplicates ${seen[field].get(value)}`);
    seen[field].set(value, file);
  }
  try {
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
    const article = graph.find((node) => node['@type'] === 'Article');
    const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList');
    const decode = (text) => text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (!article || decode(h1) !== article.headline) failures.push(`${file}: Article headline does not match the H1`);
    if (!crumbs || crumbs.itemListElement.at(-1).item !== canonical) failures.push(`${file}: breadcrumb does not end at the canonical URL`);
  } catch {
    failures.push(`${file}: structured data is missing or is not valid JSON`);
  }
}
for (const file of htmlFiles.filter((name) => name !== '404.html')) {
  const html = await readFile(path.join(src, file), 'utf8');
  const expected = `${SITE}/${file === 'index.html' ? '' : file}`;
  if (!html.includes(`<link rel="canonical" href="${expected}">`)) failures.push(`${file}: canonical link is not ${expected}`);
}

if (!production) {
  if (pages.some((text) => !text.includes('noindex, nofollow'))) {
    failures.push('preview: one or more HTML pages can be indexed');
  }
  if (!/^Disallow:\s*\/$/m.test(robots)) {
    failures.push('preview: robots.txt does not block the whole site');
  }
}

if (production) {
  const publicHtml = await Promise.all(publicHtmlFiles.map((file) => readFile(path.join(src, file), 'utf8')));
  const approvals = JSON.parse(await readFile(path.join(root, 'docs', 'publishing-approvals.json'), 'utf8'));
  if (publicHtml.some((text) => /<meta name="robots" content="noindex, nofollow">/.test(text))) {
    failures.push('production: noindex remains on one or more public pages');
  }
  if (/^Disallow:\s*\/$/m.test(robots)) {
    failures.push('production: robots.txt still blocks the whole site');
  }
  if (expectedGuides.size && approvals.guidesEditorialApproved !== true) failures.push('production: Guides have not been editorially approved by Shishir');
  const requiredApprovals = {
    audienceAndLeadingOfferApproved: 'audience and leading offer approval',
    claimsApproved: 'final claims approval',
    contactDestination: 'verified contact destination',
    contactDeliveryVerified: 'end-to-end contact delivery verification',
    legalIdentityApproved: 'legal identity requirements',
    retentionPolicyApproved: 'retention policy approval'
  };
  for (const [field, label] of Object.entries(requiredApprovals)) {
    if (!approvals[field]) failures.push(`production: missing ${label}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${production ? 'Production' : 'Preview'} publishing checks passed.`);
}
