import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://saralforge.com';
export const SHARE_IMAGE = `${SITE}/assets/saral-forge-logo-display.jpg`;
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content', 'guides');

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c', ndash: '\u2013', mdash: '\u2014', nbsp: ' ', hellip: '\u2026' };
const decodeEntities = (text) => text.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (whole, dec, hex, name) => (
  dec ? String.fromCodePoint(Number(dec)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : (ENTITIES[name.toLowerCase()] ?? whole)));
const plainText = (html) => decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const slugify = (value) => plainText(value).toLowerCase().replace(/['\u2019]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
/** ISO 8601 midnight in Sydney, with the offset that applies on that date (daylight saving changes it). */
const sydneyMidnight = (iso) => {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', timeZoneName: 'longOffset' }).formatToParts(new Date(`${iso}T12:00:00Z`));
  const offset = parts.find((part) => part.type === 'timeZoneName').value.replace('GMT', '') || '+00:00';
  return `${iso}T00:00:00${offset}`;
};
const longDate = (iso) => new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  .format(new Date(`${iso}T00:00:00Z`));

export async function loadGuides() {
  const manifest = JSON.parse(await readFile(path.join(contentDir, 'guides.json'), 'utf8'));
  const guides = [];
  for (const entry of manifest.guides) {
    const safeSlug = typeof entry.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug);
    const body = safeSlug ? await readFile(path.join(contentDir, `${entry.slug}.html`), 'utf8').catch(() => null) : null;
    guides.push({ ...entry, body });
  }
  return { groups: manifest.groups, services: manifest.services, guides, published: guides.filter((guide) => guide.status === 'published') };
}

export const guideUrl = (guide) => `/guides/${guide.slug}.html`;
export const readingMinutes = (guide) => Math.max(1, Math.round(plainText(guide.body).split(' ').length / 210));

/** Static pages that exist in src/, used to validate internal links and anchors. */
export async function staticPages(srcDir) {
  const pages = new Map();
  for (const file of (await readdir(srcDir)).filter((name) => name.endsWith('.html'))) {
    const html = await readFile(path.join(srcDir, file), 'utf8');
    pages.set(file === 'index.html' ? '/' : `/${file}`, { html, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])) });
  }
  return pages;
}

function headings(body) {
  return [...body.matchAll(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/g)].map((match) => ({ html: match[0], text: plainText(match[1]) }));
}

function prepareBody(guide) {
  let body = guide.body.trim();
  // Ids the template already uses, so a heading can never collide with them.
  const used = new Set(['sources', 'main', 'guide-title', 'toc-label', 'next-heading', 'site-nav']);
  body = body.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (whole, attributes = '', inner) => {
    const explicit = attributes.match(/\sid="([^"]+)"/)?.[1];
    let id = explicit || slugify(inner);
    while (used.has(id)) id += '-2';
    used.add(id);
    return explicit ? whole : `<h2 id="${id}"${attributes}>${inner}</h2>`;
  });
  if (guide.sources?.length) {
    const items = guide.sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a> <span class="source-note">Checked ${longDate(source.reviewed)}.</span></li>`).join('');
    body += `\n<h2 id="sources">Sources and further reading</h2>\n<ul class="source-list">${items}</ul>`;
  }
  body = body.replace(/<table(\s[^>]*)?>([\s\S]*?)<\/table>/g, (whole, attributes = '', inner) => {
    const labels = [...(inner.match(/<thead[\s\S]*?<\/thead>/)?.[0] || '').matchAll(/<th(?:\s[^>]*)?>([\s\S]*?)<\/th>/g)].map((match) => plainText(match[1]));
    const tbody = inner.replace(/<thead[\s\S]*?<\/thead>/, (head) => `<!--head-->${head}<!--/head-->`);
    const [before, head, after] = tbody.split(/<!--head-->|<!--\/head-->/);
    const rows = (after ?? before).replace(/<tr(?:\s[^>]*)?>[\s\S]*?<\/tr>/g, (row) => {
      let column = -1;
      return row.replace(/<(td|th)((?:\s[^>]*)?)>/g, (cell, tag, cellAttributes) => {
        column += 1;
        if (tag === 'th' && /scope="row"/.test(cellAttributes)) return cell;
        return labels[column] ? `<${tag}${cellAttributes} data-label="${escapeHtml(labels[column])}">` : cell;
      });
    });
    const rebuilt = head === undefined ? rows : `${before}${head}${rows}`;
    return `<table class="guide-table${labels.length >= 6 ? ' guide-table--wide' : ''}"${attributes}>${rebuilt}</table>`;
  });
  // WebKit drops list semantics from lists styled with list-style: none unless the role is explicit.
  return body.replace(/<(ul|ol) class="(steps|checklist|decision|source-list)"/g, '<$1 role="list" class="$2"');
}

const navLink = (href, label, current) => `<a href="${href}"${current ? ' aria-current="page"' : ''}>${label}</a>`;

function shell({ title, description, canonicalPath, ogType = 'website', extraMeta = '', jsonLd, body, currentNav = 'guides', bodyClass = '' }) {
  const url = `${SITE}${canonicalPath}`;
  const fullTitle = `${title} — Saral Forge`;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#0f1315">
  <meta property="og:type" content="${ogType}"><meta property="og:site_name" content="Saral Forge"><meta property="og:title" content="${escapeHtml(fullTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SHARE_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="648"><meta property="og:image:alt" content="Saral Forge — Smart Solutions. Made Simple.">${extraMeta}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(fullTitle)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${SHARE_IMAGE}"><title>${escapeHtml(fullTitle)}</title><link rel="canonical" href="${url}">
  <link rel="icon" href="/assets/favicon.png" type="image/png"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <a class="skip-link" href="#main">Skip to content</a><div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
  <header class="site-header" data-header><a class="brand" href="/" aria-label="Saral Forge home"><img class="brand-mark" src="/assets/saral-forge-mark.png" alt="" width="256" height="256"><img class="brand-wordmark" src="/assets/saral-forge-wordmark.png" alt="" width="512" height="174"><span>Saral Forge</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle><span>Menu</span><i aria-hidden="true"></i></button><nav class="site-nav" id="site-nav" aria-label="Primary" data-menu>${navLink('/work.html', 'Work', false)}${navLink('/services.html', 'Services', false)}${navLink('/guides.html', 'Guides', currentNav === 'guides')}${navLink('/about.html', 'About', false)}</nav><div class="header-actions"><button class="theme-toggle" type="button" aria-label="Switch colour theme" data-theme-toggle><span aria-hidden="true">◐</span></button><a class="header-cta" href="/start.html">Start a project <span aria-hidden="true">↗</span></a></div></header>
  <main id="main" tabindex="-1">
${body}
  </main>
  <footer class="site-footer"><div class="footer-logo"><img src="/assets/saral-forge-logo-display.jpg" alt="Saral Forge — Smart Solutions. Made Simple." width="1200" height="648" loading="lazy"></div><div class="footer-copy"><p>Simple software, shaped around real work.</p><span>Sydney, Australia</span></div><nav aria-label="Footer"><a href="/services.html">Services</a><a href="/work.html">Work</a><a href="/guides.html">Guides</a><a href="/about.html">About</a><a href="/start.html">Start a project</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></nav><p class="copyright">© <span data-year></span> Saral Forge</p></footer>
</body>
</html>
`;
}

export function renderGuide(guide, library) {
  const group = library.groups.find((item) => item.id === guide.group);
  const service = library.services[guide.service];
  const body = prepareBody(guide);
  const toc = headings(body).map((heading) => ({ id: heading.html.match(/\sid="([^"]+)"/)[1], text: heading.text }));
  const minutes = readingMinutes(guide);
  const related = guide.related.map((slug) => library.published.find((item) => item.slug === slug)).filter(Boolean);
  const dates = `<time datetime="${guide.published}">${longDate(guide.published)}</time>`;
  const updated = guide.updated && guide.updated !== guide.published ? ` · Updated <time datetime="${guide.updated}">${longDate(guide.updated)}</time>` : '';
  const url = `${SITE}${guideUrl(guide)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description,
        datePublished: sydneyMidnight(guide.published), dateModified: sydneyMidnight(guide.updated || guide.published),
        author: { '@type': 'Organization', name: 'Saral Forge', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'Saral Forge', url: `${SITE}/` },
        mainEntityOfPage: url, image: SHARE_IMAGE, inLanguage: 'en-AU'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}/guides.html` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url }
        ]
      }
    ]
  };
  const tocMarkup = toc.length >= 3
    ? `<nav class="guide-toc" aria-labelledby="toc-label"><p class="kicker" id="toc-label">In this guide</p><ol role="list">${toc.map((item) => `<li><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`).join('')}</ol></nav>`
    : '';
  const page = `    <section class="chapter chapter--paper guide-hero" aria-labelledby="guide-title">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol role="list"><li><a href="/">Home</a></li><li><a href="/guides.html">Guides</a></li><li><span aria-current="page">${escapeHtml(guide.crumb || guide.title)}</span></li></ol></nav>
      <p class="kicker">${escapeHtml(group.title)}</p>
      <h1 id="guide-title">${escapeHtml(guide.title)}</h1>
      <div class="guide-answer"><p class="guide-answer-label">Short answer</p><p>${escapeHtml(guide.answer)}</p></div>
      <p class="guide-meta">By Saral Forge · ${dates}${updated} · ${minutes} min read</p>
    </section>
    <section class="chapter chapter--paper guide-article">
      <div class="guide-layout${tocMarkup ? '' : ' guide-layout--single'}">
        ${tocMarkup}
        <article class="guide-body">
${body}
          <aside class="guide-service" aria-label="Related service and next step">
            <p><strong>Related service:</strong> <a href="${service.href}">${escapeHtml(service.label)}</a>. ${escapeHtml(service.blurb)}</p>
            <p>If you would like to talk it through, <a href="/start.html">send a short project brief</a>. It opens your email app with the message addressed and ready; nothing is sent until you press send.</p>
          </aside>
        </article>
      </div>
    </section>
    <section class="chapter chapter--warm guide-next" aria-labelledby="next-heading">
      <h2 id="next-heading">Next reads</h2>
      <ul class="guide-next-list" role="list">${related.map((item) => `<li><a href="${guideUrl(item)}">${escapeHtml(item.title)}</a><p>${escapeHtml(item.excerpt)}</p></li>`).join('')}</ul>
      <p class="guide-back"><a class="text-link" href="/guides.html#${group.id}">All guides: ${escapeHtml(group.title)} <span aria-hidden="true">↗</span></a></p>
    </section>`;
  return shell({
    title: guide.metaTitle, description: guide.description, canonicalPath: guideUrl(guide), ogType: 'article',
    extraMeta: `<meta property="article:published_time" content="${guide.published}"><meta property="article:modified_time" content="${guide.updated || guide.published}">`,
    jsonLd, body: page
  });
}

export function renderLibrary(library) {
  const problems = [
    ['My website gets visitors but no enquiries', 'website'],
    ['We keep entering the same information twice', 'admin'],
    ['Our spreadsheets are getting hard to manage', 'admin'],
    ['I have an app idea and do not know where to start', 'app'],
    ['Can I build this myself with AI?', 'app'],
    ['I am not sure whether I need a developer', 'help']
  ];
  const sections = library.groups.map((group, index) => {
    const items = library.published.filter((guide) => guide.group === group.id);
    if (!items.length) return '';
    return `    <section class="chapter ${index % 2 ? 'chapter--warm' : 'chapter--paper'} guide-group" id="${group.id}" aria-labelledby="${group.id}-heading">
      <div class="guide-group-head"><p class="kicker">${String(index + 1).padStart(2, '0')}</p><div><h2 id="${group.id}-heading">${escapeHtml(group.title)}</h2><p>${escapeHtml(group.intro)}</p></div></div>
      <ol class="guide-list" role="list">${items.map((guide) => `<li><a class="guide-row" href="${guideUrl(guide)}"><span class="guide-row-text"><span class="guide-row-title">${escapeHtml(guide.title)}</span><span class="guide-row-desc">${escapeHtml(guide.excerpt)}</span></span><span class="guide-row-meta">${readingMinutes(guide)} min read <i aria-hidden="true">↗</i></span></a></li>`).join('')}</ol>
    </section>`;
  }).join('\n');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', name: 'Guides', url: `${SITE}/guides.html`, inLanguage: 'en-AU',
        description: 'Practical guides to websites, small apps and everyday business workflows from Saral Forge.',
        publisher: { '@type': 'Organization', name: 'Saral Forge', url: `${SITE}/` },
        hasPart: library.published.map((guide) => ({ '@type': 'Article', headline: guide.title, url: `${SITE}${guideUrl(guide)}` }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}/guides.html` }
        ]
      }
    ]
  };
  const page = `    <section class="chapter chapter--paper guide-hero guide-hero--library" aria-labelledby="library-title">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol role="list"><li><a href="/">Home</a></li><li><span aria-current="page">Guides</span></li></ol></nav>
      <p class="kicker">Guides</p>
      <h1 id="library-title">Find a clearer way through your software problem.</h1>
      <p class="guide-lede">Practical guides to websites, small apps and everyday business workflows. Each one gives you something to check or decide before you spend money, and says plainly when you can handle it yourself.</p>
      <nav class="problem-links" aria-labelledby="problem-label"><p class="kicker" id="problem-label">Start with your problem</p><ul role="list">${problems.map(([label, target]) => `<li><a href="#${target}">${label}</a></li>`).join('')}</ul></nav>
    </section>
${sections}
    <section class="chapter closing" aria-labelledby="library-closing"><p class="kicker">Still stuck?</p><h2 id="library-closing">Bring the messy version.</h2><p>A short brief is enough to start. Your email app opens with the message addressed and ready to send.</p><a class="button button--dark" href="/start.html">Start a project <span aria-hidden="true">↗</span></a></section>`;
  return shell({
    title: 'Guides for websites, apps and workflows', description: 'Practical guides to websites, small apps and everyday business workflows, from checking why enquiries are missing to deciding when to involve a developer.',
    canonicalPath: '/guides.html', jsonLd, body: page
  });
}

/** Adds published guide URLs to the static sitemap. Drafts never appear. */
export function renderSitemap(baseSitemap, library) {
  if (!baseSitemap.includes('</urlset>')) throw new Error('src/sitemap.xml has no closing </urlset>; cannot add the guides');
  const entries = [{ loc: `${SITE}/guides.html`, lastmod: null }, ...library.published.map((guide) => ({ loc: `${SITE}${guideUrl(guide)}`, lastmod: guide.updated || guide.published }))]
    .filter((entry) => !baseSitemap.includes(`<loc>${entry.loc}</loc>`))
    .map((entry) => `  <url><loc>${entry.loc}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`).join('\n');
  return entries ? baseSitemap.replace('</urlset>', `${entries}\n</urlset>`) : baseSitemap;
}

export function generatedPages(library) {
  return new Map([
    ['guides.html', renderLibrary(library)],
    ...library.published.map((guide) => [`guides/${guide.slug}.html`, renderGuide(guide, library)])
  ]);
}

/** Returns a list of human-readable problems with the guide set. Empty means valid. */
export function validateLibrary(library, pages) {
  const problems = [];
  const slugs = new Set();
  for (const group of library.groups) if (!/^[a-z]+(?:-[a-z]+)*$/.test(group.id) || !group.title || !group.intro) problems.push(`group ${group.id}: needs a kebab-case id, title and intro`);
  const groupIds = new Set(library.groups.map((group) => group.id));
  const publishedSlugs = new Set(library.published.map((guide) => guide.slug));
  const titles = new Set();
  for (const guide of library.guides) {
    const where = `guide ${guide.slug}`;
    if (slugs.has(guide.slug)) problems.push(`${where}: duplicate slug`);
    slugs.add(guide.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug)) problems.push(`${where}: slug is not kebab-case`);
    if (guide.body === null) { problems.push(`${where}: missing content/guides/${guide.slug}.html`); continue; }
    for (const field of ['title', 'metaTitle', 'description', 'excerpt', 'answer', 'group', 'status', 'published', 'service']) {
      if (!guide[field]) problems.push(`${where}: missing ${field}`);
    }
    for (const field of ['published', 'updated']) {
      if (guide[field] && (!/^\d{4}-\d{2}-\d{2}$/.test(guide[field]) || Number.isNaN(Date.parse(guide[field])))) problems.push(`${where}: ${field} must be a real YYYY-MM-DD date`);
    }
    if (guide.updated && guide.published && guide.updated < guide.published) problems.push(`${where}: updated is earlier than published`);
    if (!['published', 'draft'].includes(guide.status)) problems.push(`${where}: status must be published or draft`);
    if (!groupIds.has(guide.group)) problems.push(`${where}: unknown group ${guide.group}`);
    if (!library.services[guide.service]) problems.push(`${where}: unknown service ${guide.service}`);
    if (guide.description?.length > 170 || guide.description?.length < 70) problems.push(`${where}: description should be 70-170 characters (${guide.description?.length})`);
    if (guide.metaTitle && guide.metaTitle.length > 58) problems.push(`${where}: metaTitle too long (${guide.metaTitle.length})`);
    if (titles.has(guide.metaTitle)) problems.push(`${where}: duplicate metaTitle`);
    titles.add(guide.metaTitle);
    if (guide.status !== 'published') continue;
    if (!Array.isArray(guide.related) || guide.related.length < 2 || guide.related.length > 3) problems.push(`${where}: needs two or three related guides`);
    for (const slug of guide.related || []) if (!publishedSlugs.has(slug) || slug === guide.slug) problems.push(`${where}: related "${slug}" is not another published guide`);
    if (/lorem ipsum|\bTBD\b/i.test(guide.body) || /\[[A-Z ]{3,}\]/.test(guide.body)) problems.push(`${where}: contains placeholder text`);
    if (/\bclick here\b/i.test(guide.body)) problems.push(`${where}: uses a generic "click here" link`);
    if (/<h1[\s>]/i.test(guide.body)) problems.push(`${where}: body must not contain an h1`);
    if (/<(?:script|iframe|object|embed|form|style|img|svg)\b|\son\w+\s*=|\sstyle\s*=|javascript:/i.test(guide.body)) problems.push(`${where}: body must not contain scripts, embeds, images, forms, event handlers or inline styles`);
    if (/href="http:\/\//i.test(guide.body)) problems.push(`${where}: external links must use https`);
    for (const table of guide.body.match(/<table[\s\S]*?<\/table>/g) || []) {
      if (/\s(?:colspan|rowspan)=/.test(table)) problems.push(`${where}: tables must not use colspan or rowspan (they break stacked labels)`);
      if (!/<thead/.test(table)) problems.push(`${where}: every table needs a thead`);
      if (/<table\s+[^>]*class=/.test(table)) problems.push(`${where}: do not put a class on a table`);
    }
    const ids = [...guide.body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    if (new Set(ids).size !== ids.length) problems.push(`${where}: duplicate id in body`);
    const words = plainText(guide.body).split(' ').length;
    if (words < 450) problems.push(`${where}: only ${words} words, looks unfinished`);
    if (words > 1900) problems.push(`${where}: ${words} words, should be tightened`);
    const h2s = headings(guide.body);
    if (h2s.length < 3) problems.push(`${where}: needs at least three h2 sections`);
    if (!/class="(?:checklist|steps|decision|guide-table)"|<table/.test(guide.body)) problems.push(`${where}: needs a checklist, steps, decision aid or table`);
    for (const source of guide.sources || []) if (!/^https:\/\//.test(source.url) || !source.reviewed) problems.push(`${where}: source needs an https URL and reviewed date`);
  }
  // Rendering assumes the per-guide checks passed; stop here rather than crash on malformed entries.
  if (problems.length) return problems;
  // Internal link integrity across everything that will ship.
  const known = new Map([...pages].map(([page, { ids }]) => [page, ids]));
  const everything = new Map([...pages].map(([page, { html }]) => [page === '/' ? 'index.html' : page.slice(1), html]));
  for (const [file, html] of generatedPages(library)) {
    known.set(`/${file}`, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
    everything.set(file, html);
  }
  const inbound = new Map(library.published.map((guide) => [guide.slug, new Set()]));
  for (const [file, html] of everything) {
    const isStatic = pages.has(file === 'index.html' ? '/' : `/${file}`);
    for (const [, href] of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
      if (/\.[a-z0-9]+(?:[#?].*)?$/i.test(href) && !/\.html(?:[#?].*)?$/i.test(href)) continue; // assets and text files are covered by the static link test
      const [pagePath, fragment] = href.split('#');
      const target = pagePath === '' ? (file === 'index.html' ? '/' : `/${file}`) : pagePath;
      if (!isStatic && !pagePath.startsWith('/') && pagePath !== '') problems.push(`${file}: link "${href}" is not root-relative`);
      const resolved = isStatic && pagePath !== '' && !pagePath.startsWith('/') ? `/${pagePath}` : target;
      const normalised = resolved === '/index.html' ? '/' : resolved;
      if (!known.has(normalised)) { problems.push(`${file}: broken internal link ${href}`); continue; }
      if (fragment && !known.get(normalised).has(fragment)) problems.push(`${file}: missing anchor ${href}`);
      const slug = normalised.match(/^\/guides\/([^/]+)\.html$/)?.[1];
      if (slug && inbound.has(slug) && file !== `guides/${slug}.html`) inbound.get(slug).add(file);
    }
  }
  for (const [slug, from] of inbound) {
    if (!from.has('guides.html')) problems.push(`guide ${slug}: not linked from the library`);
    if ([...from].every((file) => file === 'guides.html')) problems.push(`guide ${slug}: orphan, no other page links to it`);
  }
  for (const guide of library.guides.filter((item) => item.status === 'draft')) {
    for (const [file, html] of everything) {
      const links = [...html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)].map((match) => match[1].split('#')[0].replace(/^\//, ''));
      if (links.some((href) => href === `guides/${guide.slug}.html`)) problems.push(`${file}: links to draft ${guide.slug}`);
    }
  }
  return problems;
}
