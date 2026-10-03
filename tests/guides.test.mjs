import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { SITE, generatedPages, guideUrl, loadGuides, renderGuide, renderLibrary, renderSitemap, staticPages, validateLibrary } from '../scripts/guides.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(projectRoot, 'src');
const library = await loadGuides();
const pages = generatedPages(library);
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('the programme contains 20 distinct guides in four groups, all with source content', () => {
  assert.equal(library.guides.length, 20);
  assert.equal(new Set(library.guides.map((guide) => guide.slug)).size, 20);
  assert.deepEqual(library.groups.map((group) => group.title), [
    'Make your website work harder', 'Reduce manual admin', 'Plan a small app', 'Choose the right help'
  ]);
  for (const guide of library.guides) assert.ok(guide.body, `${guide.slug} needs source content`);
});

test('guide metadata, links, related reading and orphan rules all validate', async () => {
  assert.deepEqual(validateLibrary(library, await staticPages(src)), []);
});

test('every published guide page has the required SEO, structure and honesty markers', () => {
  const titles = new Set();
  for (const guide of library.published) {
    const html = pages.get(`guides/${guide.slug}.html`);
    const url = `${SITE}${guideUrl(guide)}`;
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${guide.slug}: one H1`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}">`), `${guide.slug}: self-referencing canonical`);
    assert.match(html, new RegExp(`<meta property="og:url" content="${url}">`));
    assert.match(html, /<meta property="og:image" content="https:\/\/saralforge\.com\/assets\/saral-forge-logo-display\.jpg">/);
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(!titles.has(title), `${guide.slug}: unique title`);
    titles.add(title);
    assert.match(html, /<nav class="breadcrumb" aria-label="Breadcrumb">/);
    assert.match(html, /<nav class="guide-toc" aria-labelledby="toc-label">/);
    assert.match(html, /class="guide-answer"/);
    assert.match(html, /By Saral Forge/);
    assert.doesNotMatch(text(html), /Reviewed by|reviewed by Shishir/i);
    assert.match(html, /<link rel="stylesheet" href="\/styles\.css">/);
    assert.doesNotMatch(html, /<script(?![^>]*(?:type="module" src="\/app\.js"|type="application\/ld\+json"))[^>]*>/, `${guide.slug}: only the shared script and JSON-LD`);
    assert.doesNotMatch(html, /\sstyle="/);
    assert.match(html, /href="\/services\.html#(?:websites|booking|automation|apps|cloud)"/, `${guide.slug}: one contextual service link`);
    assert.match(html, /href="\/start\.html"/, `${guide.slug}: enquiry link`);
    assert.match(html, new RegExp(`href="/guides\\.html#${guide.group}"`), `${guide.slug}: link back to its library section`);
    const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
    const article = jsonLd['@graph'].find((node) => node['@type'] === 'Article');
    const crumbs = jsonLd['@graph'].find((node) => node['@type'] === 'BreadcrumbList');
    assert.equal(article.headline, guide.title);
    assert.equal(article.author.name, 'Saral Forge');
    assert.match(article.datePublished, /^\d{4}-\d{2}-\d{2}T00:00:00[+-]\d{2}:\d{2}$/);
    assert.match(html, /<meta property="og:image:alt"/);
    assert.doesNotMatch(html, /article:author/);
    assert.ok(html.includes(`datetime="${guide.published}"`), `${guide.slug}: visible date matches structured data`);
    assert.deepEqual(crumbs.itemListElement.map((item) => item.name), ['Home', 'Guides', guide.title]);
    assert.ok(html.includes(guide.title.replace(/&/g, '&amp;')), `${guide.slug}: breadcrumb and H1 show the title`);
  }
});

test('article tables stack with column labels and examples are labelled as hypothetical', () => {
  for (const guide of library.published) {
    const html = pages.get(`guides/${guide.slug}.html`);
    for (const table of html.match(/<table[\s\S]*?<\/table>/g) || []) {
      assert.match(table, /<caption>/, `${guide.slug}: table needs a caption`);
      assert.match(table, /<th scope="col">/);
      assert.ok(!/<td(?![^>]*data-label)/.test(table), `${guide.slug}: every data cell needs a data-label`);
    }
    if (/class="example"/.test(html)) assert.match(html, /class="example-label">Hypothetical example</, `${guide.slug}: label examples`);
  }
});

test('guides make no unverified commercial, price, experience or ranking claims', () => {
  for (const guide of library.published) {
    const body = text(pages.get(`guides/${guide.slug}.html`));
    assert.doesNotMatch(body, /\bA?\$\s?\d/, `${guide.slug}: no invented prices`);
    assert.doesNotMatch(body, /\b\d+\s*\+?\s*years\b/i, `${guide.slug}: no experience figures`);
    assert.doesNotMatch(body, /sarallabs|saral labs/i);
    assert.doesNotMatch(body, /\b(?:we|will|can) guarantee\b|guaranteed (?:rank|lead|result|first|page)|will rank first/i, `${guide.slug}: no guaranteed outcomes`);
    assert.doesNotMatch(body, /\bour (?:clients|customers) (?:have|saw|report)/i, `${guide.slug}: no client results`);
  }
});

test('the library lists every published guide in crawlable grouped HTML', () => {
  const html = pages.get('guides.html');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /Find a clearer way through your software problem\./);
  for (const group of library.groups) assert.match(html, new RegExp(`<section[^>]*id="${group.id}"[^>]*>`));
  for (const guide of library.published) {
    assert.ok(html.includes(`href="${guideUrl(guide)}"`), `${guide.slug} listed`);
    assert.ok(html.includes(guide.excerpt.replace(/"/g, '&quot;')), `${guide.slug} has its excerpt`);
  }
  assert.match(html, /<nav class="problem-links"/);
  for (const target of html.match(/class="problem-links"[\s\S]*?<\/nav>/)[0].matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${target[1]}"`));
  assert.doesNotMatch(html, /<script(?![^>]*(?:src="\/app\.js"|ld\+json))/);
});

test('drafts never appear in pages, navigation, library or sitemap', async () => {
  const hidden = library.guides[0].slug;
  const hiddenLibrary = {
    ...library,
    guides: library.guides.map((guide) => (guide.slug === hidden ? { ...guide, status: 'draft' } : guide)),
    published: library.published.filter((guide) => guide.slug !== hidden)
  };
  assert.ok(!generatedPages(hiddenLibrary).has(`guides/${hidden}.html`));
  assert.ok(!renderLibrary(hiddenLibrary).includes(hidden));
  assert.ok(!renderSitemap('</urlset>', hiddenLibrary).includes(hidden));
  const problems = validateLibrary(hiddenLibrary, await staticPages(src));
  assert.ok(problems.some((problem) => problem.includes(hidden)), 'a published guide that points at a draft must be reported');
});

test('guides are linked from navigation, the footer, the home page, services and about', async () => {
  const files = (await readdir(src)).filter((file) => file.endsWith('.html'));
  for (const file of files) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.match(html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0], /guides\.html">Guides</, `${file}: primary nav`);
    assert.match(html.match(/<nav aria-label="Footer">[\s\S]*?<\/nav>/)[0], /guides\.html">Guides</, `${file}: footer`);
  }
  for (const [file, html] of pages) {
    assert.match(html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0], /\/guides\.html"[^>]*>Guides</, `${file}: primary nav`);
    assert.match(html.match(/<nav aria-label="Footer">[\s\S]*?<\/nav>/)[0], /\/guides\.html">Guides</, `${file}: footer`);
  }
  const index = await readFile(path.join(src, 'index.html'), 'utf8');
  const teaser = index.match(/id="guides"[\s\S]*?<\/section>/)[0];
  assert.ok(index.indexOf('id="services"') < index.indexOf('id="guides"') && index.indexOf('id="guides"') < index.indexOf('id="about"'), 'home order: services, guides, about');
  assert.equal((teaser.match(/class="service-row"/g) || []).length, 3);
  for (const slug of ['website-visitors-no-enquiries', 'spreadsheet-or-small-business-app', 'when-to-involve-a-developer']) assert.ok(teaser.includes(`guides/${slug}.html`));
  assert.match(teaser, /Browse all guides/);
  assert.match(teaser, /Practical guides for everyday software problems/);
  const services = await readFile(path.join(src, 'services.html'), 'utf8');
  for (const id of ['websites', 'booking', 'automation', 'apps', 'cloud']) {
    const article = services.match(new RegExp(`<article id="${id}"[\\s\\S]*?</article>`))[0];
    const count = (article.match(/href="guides\//g) || []).length;
    assert.ok(count >= 2 && count <= 3, `services#${id} needs two or three guides (has ${count})`);
  }
  const about = await readFile(path.join(src, 'about.html'), 'utf8');
  const reading = about.match(/guides-reading[\s\S]*?<\/section>/)[0];
  assert.match(reading, /Before you build/);
  for (const slug of ['when-to-involve-a-developer', 'diy-freelancer-studio-or-agency', 'website-app-ownership-handover']) assert.ok(reading.includes(`guides/${slug}.html`));
});

test('the url inventory and llms.txt cover the guides', async () => {
  const inventory = await readFile(path.join(projectRoot, 'docs', 'url-inventory.csv'), 'utf8');
  assert.ok(inventory.includes(`${SITE}/guides.html,`));
  for (const guide of library.published) assert.ok(inventory.includes(`${SITE}${guideUrl(guide)},`), `${guide.slug} in url-inventory.csv`);
  assert.match(await readFile(path.join(src, 'llms.txt'), 'utf8'), /\/guides\.html/);
});

test('builds include nested guides, protect the preview and keep production indexable', async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'saral-forge-guides-'));
  try {
    for (const target of ['preview', 'production']) {
      const output = path.join(temporary, target);
      execFileSync(process.execPath, [path.join(projectRoot, 'scripts/build.mjs')], { env: { ...process.env, SARAL_BUILD_TARGET: target, SARAL_BUILD_OUTPUT: output } });
      const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
      for (const [file] of pages) {
        const html = await readFile(path.join(output, file), 'utf8');
        if (target === 'preview') assert.match(html, /<meta name="robots" content="noindex, nofollow">/, `${file} is protected in preview`);
        else assert.doesNotMatch(html, /<meta name="robots"/, `${file} is indexable in production`);
        assert.ok(sitemap.includes(`<loc>${SITE}/${file}</loc>`), `${file} is in the sitemap`);
      }
      assert.ok((await readdir(path.join(output, 'guides'))).length === library.published.length);
      assert.ok(!sitemap.includes('products.html') && !sitemap.includes('404.html'));
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('Sydney offsets follow daylight saving and the /guides redirect exists', async () => {
  const winter = library.published[0];
  const config = JSON.parse(await readFile(path.join(projectRoot, 'firebase.json'), 'utf8'));
  assert.deepEqual(config.hosting.redirects, [{ source: '/guides', destination: '/guides.html', type: 301 }]);
  const offsetFor = (iso) => JSON.parse(renderGuide({ ...winter, published: iso, updated: iso }, library).match(/ld\+json">(.*?)<\/script>/)[1])['@graph'][0].datePublished.slice(-6);
  assert.equal(offsetFor('2026-10-03'), '+10:00');
  assert.equal(offsetFor('2026-10-05'), '+11:00');
  assert.equal(offsetFor('2026-07-01'), '+10:00');
  assert.equal(offsetFor('2027-01-15'), '+11:00');
});

test('the 404 page uses root-relative links so it works from nested paths', async () => {
  const html = await readFile(path.join(src, '404.html'), 'utf8');
  for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    assert.ok(/^(?:https?:|mailto:|#|\/)/.test(reference), `404.html link ${reference} must be root-relative`);
  }
});

const longBody = (extra = '') => `<h2>One</h2><p>${'word '.repeat(200)}</p><h2>Two</h2><ul class="checklist"><li>a</li></ul><p>${'more '.repeat(200)}</p><h2>Three</h2><p>${'end '.repeat(100)}</p>${extra}`;
const withGuide = (overrides) => ({
  ...library,
  guides: [...library.guides, { ...library.published[0], slug: 'extra-test-guide', metaTitle: 'Extra test guide', body: longBody(), related: library.published[0].related, ...overrides }],
  published: [...library.published]
});

test('validation reports malformed entries as messages instead of crashing', async () => {
  const known = await staticPages(src);
  assert.match(validateLibrary(withGuide({ group: 'nope' }), known).join('\n'), /unknown group nope/);
  assert.match(validateLibrary(withGuide({ body: null }), known).join('\n'), /missing content\/guides\/extra-test-guide\.html/);
  assert.match(validateLibrary(withGuide({ published: '3 Oct' }), known).join('\n'), /published must be a real YYYY-MM-DD date/);
  assert.match(validateLibrary(withGuide({ updated: '2020-01-01' }), known).join('\n'), /updated is earlier than published/);
  assert.match(validateLibrary(withGuide({ slug: library.published[0].slug }), known).join('\n'), /duplicate slug/);
  assert.match(validateLibrary(withGuide({ service: 'nope' }), known).join('\n'), /unknown service/);
  assert.match(validateLibrary(withGuide({ body: longBody('<img src=x onerror=alert(1)>') }), known).join('\n'), /must not contain scripts, embeds, images/);
  assert.match(validateLibrary(withGuide({ body: longBody('<table><tr><td colspan="2">x</td></tr></table>') }), known).join('\n'), /colspan/);
  assert.match(validateLibrary(withGuide({ body: longBody('<p><a href="http://example.com">x</a></p>') }), known).join('\n'), /https/);
});

test('rendering escapes manifest text and decodes entities in headings and labels', () => {
  const guide = {
    ...library.published[0], title: 'A "quoted" <title> & more', metaTitle: 'T & "q"', description: 'D <b> "x"', answer: '</script><b>',
    body: '<h2>Don&rsquo;t &amp; stop</h2><h2>Sources</h2><h2>???</h2><p>x</p><table><caption>c</caption><thead><tr><th scope="col">B &amp; C</th><th scope="col">D</th></tr></thead><tbody><tr><th scope="row">r</th><td>1</td></tr></tbody></table>'
  };
  const html = renderGuide(guide, library);
  assert.ok(!html.includes('<b>'), 'raw markup from manifest text must be escaped');
  assert.ok(!/<\/script><b>/.test(html));
  assert.match(html, /id="dont-stop"/);
  assert.match(html, />Don\u2019t &amp; stop</);
  assert.match(html, /data-label="D"/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'ids must stay unique, including the Sources heading and punctuation-only headings');
  assert.ok(ids.includes('section'), 'a punctuation-only heading falls back to a safe id');
});

test('the sitemap renderer refuses an unusable base file and does not duplicate entries', () => {
  assert.throws(() => renderSitemap('<urlset/>', library), /closing <\/urlset>/);
  const once = renderSitemap('<urlset>\n</urlset>', library);
  assert.equal(renderSitemap(once, library), once);
  assert.equal((once.match(/<loc>/g) || []).length, library.published.length + 1);
});

test('colour contrast pairs still pass', () => {
  execFileSync(process.execPath, [path.join(src, 'check-contrast.mjs')], { stdio: 'pipe' });
});

test('a failed validation leaves the previous build untouched', async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'saral-forge-failed-build-'));
  try {
    const output = path.join(temporary, 'out');
    execFileSync(process.execPath, [path.join(projectRoot, 'scripts/build.mjs')], { env: { ...process.env, SARAL_BUILD_OUTPUT: output } });
    const before = await readFile(path.join(output, 'guides.html'), 'utf8');
    assert.ok(before.length > 0);
    const build = await readFile(path.join(projectRoot, 'scripts/build.mjs'), 'utf8');
    assert.ok(build.indexOf('validateLibrary(') < build.indexOf('await rm(output'), 'validation must run before dist is cleared');
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
