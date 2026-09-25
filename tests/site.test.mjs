import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    for (const [, reference] of html.matchAll(referencePattern)) {
      if (/^(?:https?:|#|mailto:|tel:)/.test(reference)) continue;
      const relative = reference.split('#')[0].split('?')[0];
      if (!relative) continue;
      const target = path.resolve(src, relative);
      await assert.doesNotReject(access(target), `${file}: missing ${reference}`);
    }
  }
});

test('preview protections and safe form behaviour remain explicit', async () => {
  const start = await readFile(path.join(src, 'start.html'), 'utf8');
  const app = await readFile(path.join(src, 'app.js'), 'utf8');
  const robots = await readFile(path.join(src, 'robots.txt'), 'utf8');
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.match(html, /noindex, nofollow/, `${file} must remain non-indexed in preview`);
  }
  assert.match(start, /does not transmit or store your details/);
  assert.match(start, /type="submit" disabled/);
  assert.match(app, /has not sent or stored it/);
  assert.match(robots, /^Disallow:\s*\/$/m);
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

test('marketing copy stays concrete and buyer-facing', async () => {
  const vaguePhrases = [/legible/i, /technology theatre/i, /handover mystery/i, /right-sized response/i, /edited out/i];
  for (const file of htmlFiles) {
    const html = await readFile(path.join(src, file), 'utf8');
    assert.doesNotMatch(html, /↗/, `${file}: internal links should not use the external-link arrow`);
    assert.doesNotMatch(html, /pending approval/i, `${file}: internal approval status is visible`);
    for (const phrase of vaguePhrases) assert.doesNotMatch(html, phrase, `${file}: vague phrase ${phrase}`);
  }
  const home = await readFile(path.join(src, 'index.html'), 'utf8');
  assert.ok((home.match(/proven industry experience/gi) || []).length <= 1, 'home repeats "proven industry experience"');
  const work = await readFile(path.join(src, 'work.html'), 'utf8');
  assert.match(work, /<title>Work\b/, 'work page title should match its navigation label');
});
