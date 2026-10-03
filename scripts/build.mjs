import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { generatedPages, loadGuides, renderSitemap, staticPages, validateLibrary } from './guides.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(projectRoot, 'src');
const output = process.env.SARAL_BUILD_OUTPUT || path.join(projectRoot, 'dist');
const production = process.env.SARAL_BUILD_TARGET === 'production';

// Validate and render everything before touching dist/, so a failure never leaves a half-built site behind.
const library = await loadGuides();
const guideProblems = validateLibrary(library, await staticPages(source));
if (guideProblems.length) throw new Error(`Guides are not valid:\n${guideProblems.map((problem) => `- ${problem}`).join('\n')}`);
const guidePages = generatedPages(library);
const sitemap = renderSitemap(await readFile(path.join(source, 'sitemap.xml'), 'utf8'), library);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
for (const [file, html] of guidePages) {
  await mkdir(path.dirname(path.join(output, file)), { recursive: true });
  await writeFile(path.join(output, file), html);
}
await writeFile(path.join(output, 'sitemap.xml'), sitemap);

async function htmlFilesIn(directory, prefix = '') {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) found.push(...await htmlFilesIn(path.join(directory, entry.name), `${prefix}${entry.name}/`));
    else if (entry.name.endsWith('.html')) found.push(`${prefix}${entry.name}`);
  }
  return found;
}

if (!production) {
  for (const file of await htmlFilesIn(output)) {
    const page = path.join(output, file);
    const html = await readFile(page, 'utf8');
    const robotsTag = /<meta name="robots" content="[^"]*">/;
    const protectedHtml = robotsTag.test(html)
      ? html.replace(robotsTag, '<meta name="robots" content="noindex, nofollow">')
      : html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex, nofollow">');
    if (protectedHtml === html && !html.includes('name="robots" content="noindex, nofollow"')) {
      throw new Error(`${file}: could not add preview indexing protection`);
    }
    await writeFile(page, protectedHtml);
  }
  await writeFile(path.join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}

console.log(`Built ${production ? 'production' : 'preview'} site in ${path.relative(projectRoot, output)}/`);
