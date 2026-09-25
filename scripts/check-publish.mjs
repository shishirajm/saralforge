import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const production = process.argv.includes('--production');
const htmlFiles = (await readdir(src)).filter((file) => file.endsWith('.html'));
const publicHtmlFiles = htmlFiles.filter((file) => !['404.html', 'products.html'].includes(file));
const failures = [];
const robots = await readFile(path.join(src, 'robots.txt'), 'utf8');
const previewHtml = await Promise.all(htmlFiles.map((file) => readFile(path.join(src, file), 'utf8')));

for (const file of htmlFiles) {
  const text = await readFile(path.join(src, file), 'utf8');
  if (/\[(?:ABN|CONTACT EMAIL|AUD)\]|\b(?:TBD|lorem ipsum)\b/i.test(text)) {
    failures.push(`${file}: contains a publishing placeholder`);
  }
  if (text.includes('https://sarallabs.com')) {
    failures.push(`${file}: still refers to sarallabs.com`);
  }
}

if (!production) {
  if (previewHtml.some((text) => !text.includes('noindex, nofollow'))) {
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
  console.log('Preview publishing checks passed.');
}
