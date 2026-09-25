import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const production = process.argv.includes('--production');
const htmlFiles = (await readdir(src)).filter((file) => file.endsWith('.html'));
const failures = [];

for (const file of htmlFiles) {
  const text = await readFile(path.join(src, file), 'utf8');
  if (/\[(?:ABN|CONTACT EMAIL|AUD)\]|\b(?:TBD|lorem ipsum)\b/i.test(text)) {
    failures.push(`${file}: contains a publishing placeholder`);
  }
  if (text.includes('https://sarallabs.com')) {
    failures.push(`${file}: still refers to sarallabs.com`);
  }
}

if (production) {
  const robots = await readFile(path.join(src, 'robots.txt'), 'utf8');
  const allHtml = await Promise.all(htmlFiles.map((file) => readFile(path.join(src, file), 'utf8')));
  if (allHtml.some((text) => /<meta name="robots" content="noindex, nofollow">/.test(text))) {
    failures.push('production: noindex remains on one or more pages');
  }
  if (/^Disallow:\s*\/$/m.test(robots)) {
    failures.push('production: robots.txt still blocks the whole site');
  }
  failures.push('production: verified contact delivery, retention policy, legal identity and final claims approval must be recorded before launch');
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Preview publishing checks passed.');
}
