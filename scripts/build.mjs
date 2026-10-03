import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(projectRoot, 'src');
const output = process.env.SARAL_BUILD_OUTPUT || path.join(projectRoot, 'dist');
const production = process.env.SARAL_BUILD_TARGET === 'production';

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

if (!production) {
  for (const file of (await readdir(output)).filter((name) => name.endsWith('.html'))) {
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
