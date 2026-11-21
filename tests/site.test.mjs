import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { generatedPages, loadGuides } from '../scripts/guides.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(projectRoot, 'src');
const htmlFiles = (await readdir(src)).filter((file) => file.endsWith('.html')).sort();

test('every HTML page has one H1 and essential metadata', async () => {
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file} should have one H1`);
    assert.match(html, /<meta name="description" content="[^"]+">/, `${file} needs a description`);
    assert.match(html, /<title>[^<]+<\/title>/, `${file} needs a title`);
  }
});

test('public metadata uses the owned domain', async () => {
  const checked = htmlFiles.filter((file) => file !== '404.html');
  for (const file of checked) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.doesNotMatch(html, /https:\/\/sarallabs\.com/, `${file} uses the superseded domain`);
    assert.match(html, /https:\/\/saralforge\.com/, `${file} needs saralforge.com metadata`);
  }
});

test('local file references resolve', async () => {
  const referencePattern = /(?:href|src)="([^"]+)"/g;
  const generated = new Set(generatedPages(await loadGuides()).keys());
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    for (const [, reference] of html.matchAll(referencePattern)) {
      if (/^(?:https?:|#|mailto:|tel:)/.test(reference)) continue;
      const relative = reference.split('#')[0].split('?')[0];
      if (!relative) continue;
      if (generated.has(relative.replace(/^\//, ''))) continue;
      const target = path.resolve(src, relative.replace(/^\//, ''));
      await assert.doesNotReject(access(target), `${file}: missing ${reference}`);
    }
  }
});

test('safe form behaviour remains explicit', async () => {
  const start = await readFile(path.join(src, 'start.html'), 'utf8');
  const app = await readFile(path.join(src, 'app.js'), 'utf8');
  assert.match(start, /needs JavaScript to enable/);
  assert.match(start, /type="submit" disabled/);
  assert.match(app, /mailto:\$\{CONTACT_EMAIL\}/);
  assert.match(app, /if \(website\.value\)/);
  assert.match(app, /querySelectorAll\('input, select, textarea, button'\).*disabled = false/);
});

test('unpublished pages stay non-indexed and public pages stay indexable', async () => {
  const unpublished = ['404.html', 'products.html'];
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    if (unpublished.includes(file)) {
      assert.match(html, /noindex, nofollow/, `${file} must stay non-indexed`);
    } else {
      assert.doesNotMatch(html, /noindex, nofollow/, `${file} should be indexable in production`);
    }
  }
  const robots = await readFile(path.join(src, 'robots.txt'), 'utf8');
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, 'robots.txt should not block the whole site');
  assert.match(robots, /^Disallow:\s*\/products\.html\s*$/m);
});

test('builds protect the preview while leaving approved production pages indexable', async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'saral-forge-build-'));
  try {
    for (const target of ['preview', 'production']) {
      const output = path.join(temporary, target);
      execFileSync(process.execPath, [path.join(projectRoot, 'scripts/build.mjs')], {
        env: { ...process.env, SARAL_BUILD_TARGET: target, SARAL_BUILD_OUTPUT: output }
      });
      const home = await readFile(path.join(output, 'index.html'), 'utf8');
      const unpublished = await readFile(path.join(output, 'products.html'), 'utf8');
      const robots = await readFile(path.join(output, 'robots.txt'), 'utf8');
      assert.match(unpublished, /noindex, nofollow/);
      if (target === 'preview') {
        assert.match(home, /<meta name="robots" content="noindex, nofollow">/);
        assert.match(robots, /^Disallow:\s*\/$/m);
      } else {
        assert.doesNotMatch(home, /noindex, nofollow/);
        assert.doesNotMatch(robots, /^Disallow:\s*\/$/m);
        assert.match(robots, /^Disallow:\s*\/products\.html$/m);
      }
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('the hero growth line waits until its artwork enters the viewport', async () => {
  const index = await readFile(path.join(src, 'index.html'), 'utf8');
  const app = await readFile(path.join(src, 'app.js'), 'utf8');
  const styles = await readFile(path.join(src, 'styles.css'), 'utf8');

  assert.match(index, /<svg[^>]*data-growth-field/);
  assert.match(app, /querySelectorAll\('\[data-growth-field\]'\)/);
  assert.match(app, /classList\.add\('is-growth-active'\)/);
  assert.match(styles, /\.has-js \.growth-line\s*\{[^}]*stroke-dashoffset:\s*1/);
  assert.match(styles, /\.has-js \.growth-field\.is-growth-active \.growth-line\s*\{[^}]*animation:\s*draw-line/);
});

test('hosting config applies the required security headers', async () => {
  const config = JSON.parse(await readFile(path.join(projectRoot, 'firebase.json'), 'utf8'));
  const globalHeaders = config.hosting.headers.find(({ source }) => source === '**').headers;
  const names = new Set(globalHeaders.map(({ key }) => key.toLowerCase()));
  assert.ok(names.has('content-security-policy'));
  assert.ok(names.has('strict-transport-security'));
  assert.ok(names.has('x-content-type-options'));
  assert.ok(names.has('referrer-policy'));
  const csp = globalHeaders.find(({ key }) => key === 'Content-Security-Policy').value;
  for (const file of ['index.html', 'services.html']) {
    const html = await readFile(path.join(src, file), 'utf8');
    const jsonLd = html.match(/<script type="application\/ld\+json">(.*)<\/script>/)?.[1];
    assert.ok(jsonLd, `${file} should contain JSON-LD`);
    const hash = createHash('sha256').update(jsonLd).digest('base64');
    assert.match(csp, new RegExp(`'sha256-${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  }
  assert.ok(Array.isArray(config.hosting.predeploy));
  assert.ok(config.hosting.predeploy.includes('npm run build'));
});

test('delivered client websites are shown as real work, not illustrations', async () => {
  const clients = ['https://www.macprecitecindia.com/', 'https://drive2door.com.au/'];
  for (const file of ['index.html', 'work.html']) {
    const html = await readFile(path.join(src, file), 'utf8');
    for (const url of clients) {
      assert.ok(html.includes(`href="${url}"`), `${file} should link to ${url}`);
    }
    assert.doesNotMatch(html, /Illustrative workflow|Evidence pending approval/, `${file} still labels delivered work as illustrative`);
  }
});

test('the home hero leads with the offer and shows delivered proof', async () => {
  const html = await readFile(path.join(src, 'index.html'), 'utf8');
  const hero = html.slice(html.indexOf('<section class="hero'), html.indexOf('</section>'));
  assert.match(hero, /<h1>[^<]*Websites[^<]*AI/i, 'H1 names websites and AI');
  assert.ok(hero.includes('href="https://www.macprecitecindia.com/"') && hero.includes('href="https://drive2door.com.au/"'), 'hero links to delivered client sites');
  assert.doesNotMatch(html, /experience-proof/, 'unsupported "Proven" box removed');
  assert.ok((html.match(/Proven industry experience/gi) || []).length <= 1, 'experience phrase used at most once');
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="services"'), 'proof comes before services');
});

test('every page shares the dedicated 1200 x 630 social image', async () => {
  const jpg = await readFile(path.join(src, 'assets', 'saral-forge-og.jpg'));
  let offset = 2;
  while (offset < jpg.length && !(jpg[offset] === 0xff && jpg[offset + 1] >= 0xc0 && jpg[offset + 1] <= 0xc2)) offset += 2 + jpg.readUInt16BE(offset + 2);
  assert.equal(jpg.readUInt16BE(offset + 7), 1200, 'share image width');
  assert.equal(jpg.readUInt16BE(offset + 5), 630, 'share image height');
  assert.ok(jpg.length < 150 * 1024, 'share image stays under 150 KB');
  const shell = await readFile(path.join(projectRoot, 'scripts', 'guides.mjs'), 'utf8');
  assert.match(shell, /SHARE_IMAGE = `\$\{SITE\}\/assets\/saral-forge-og\.jpg`/, 'generated guides use the share image');
  for (const file of htmlFiles.filter((name) => !['404.html'].includes(name))) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.match(html, /og:image" content="https:\/\/saralforge\.com\/assets\/saral-forge-og\.jpg"/, `${file} og:image`);
    assert.match(html, /twitter:image" content="https:\/\/saralforge\.com\/assets\/saral-forge-og\.jpg"/, `${file} twitter:image`);
  }
});

test('the project brief asks what is needed and when, and emails both', async () => {
  const start = await readFile(path.join(src, 'start.html'), 'utf8');
  const app = await readFile(path.join(src, 'app.js'), 'utf8');
  for (const id of ['need', 'timing']) {
    assert.match(start, new RegExp(`<label for="${id}">`), `${id} is labelled`);
    assert.match(start, new RegExp(`<select id="${id}" name="${id}"[^>]*disabled`), `${id} disabled until JS runs`);
  }
  assert.match(app, /Help needed: /);
  assert.match(app, /Timing: /);
});

test('each page has a single skip link', async () => {
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.equal((html.match(/class="skip-link"/g) || []).length, 1, `${file} skip links`);
  }
});
