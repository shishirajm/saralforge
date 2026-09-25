import assert from 'node:assert/strict';
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
  assert.match(start, /noindex, nofollow/);
  assert.match(start, /does not transmit or store your details/);
  assert.match(start, /type="submit" disabled/);
  assert.match(app, /has not sent or stored it/);
  assert.match(robots, /^Disallow:\s*\/$/m);
});
