#!/usr/bin/env node
/**
 * Pre-launch audit of the built site (run after `npm run build:fast`).
 *  - broken internal links
 *  - exactly one <h1> per page, <title> and meta description present
 *  - images without alt text
 *  - JSON-LD parses
 *  - cross-reference slugs in content point at real entries
 *  - counts remaining admin placeholders (informational — they must be cleared before launch)
 * Exit code 1 on errors.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import yaml from 'js-yaml';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist/client');
const errors = [];
const warnings = [];

async function walk(dir, ext) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, ext)));
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('dist/client not found — run `npm run build:fast` first.');
  process.exit(1);
}

const pages = await walk(DIST, '.html');
const exists = (path) => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return true;
  const f = join(DIST, clean);
  return existsSync(f) || existsSync(join(f, 'index.html')) || clean.startsWith('/api/');
};
let placeholders = 0;

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '');
  if (page.startsWith('/admin')) continue;
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${page}: ${h1} <h1> elements`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page}: missing meta description`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) errors.push(`${page}: <img> without alt`);
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('//')) continue;
    if (!exists(href)) errors.push(`${page}: broken link ${href}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errors.push(`${page}: invalid JSON-LD`); }
  }
  placeholders += (html.match(/class="placeholder/g) ?? []).length;
}

// Cross-reference check on content source.
const C = join(ROOT, 'src/content');
const ids = async (dir, ext) => (await readdir(join(C, dir))).filter((f) => f.endsWith(ext)).map((f) => f.replace(/\.[^.]+$/, ''));
const known = {
  services: await ids('services', '.yaml'),
  industries: await ids('industries', '.yaml'),
  glossary: await ids('glossary', '.yaml'),
  compare: await ids('compare', '.yaml'),
  articles: await ids('blog', '.md'),
  research: await ids('research', '.md'),
  tools: (await readFile(join(ROOT, 'src/lib/tools.ts'), 'utf8')).match(/slug: '([^']+)'/g).map((s) => s.slice(7, -1)),
};
known.related = known.glossary;
for (const dir of ['services', 'industries', 'glossary', 'compare']) {
  for (const f of await readdir(join(C, dir))) {
    const d = yaml.load(await readFile(join(C, dir, f), 'utf8'));
    for (const [k, list] of Object.entries(known)) for (const s of d[k] ?? []) if (!list.includes(s)) errors.push(`content/${dir}/${f}: unknown ${k} slug "${s}"`);
  }
}
for (const dir of ['blog', 'research']) {
  for (const f of await readdir(join(C, dir))) {
    const src = await readFile(join(C, dir, f), 'utf8');
    const d = yaml.load(src.split('---')[1]);
    for (const [k, list] of Object.entries(known)) for (const s of d[k] ?? []) if (!list.includes(s)) errors.push(`content/${dir}/${f}: unknown ${k} slug "${s}"`);
  }
}
const stats = yaml.load(await readFile(join(C, 'statistics/statistics.yaml'), 'utf8')).statistics;
for (const s of stats) {
  for (const k of ['source', 'sourceUrl', 'year', 'geography', 'referencePeriod']) if (!s[k]) errors.push(`statistic ${s.id}: missing ${k}`);
  if (s.verification !== 'editor-verified') warnings.push(`statistic ${s.id}: pending editorial verification`);
}

console.log(`Audited ${pages.length} pages.`);
console.log(`Admin placeholders still visible: ${placeholders} (clear before launch).`);
console.log(`Warnings: ${warnings.length}`);
if (process.argv.includes('--verbose')) warnings.forEach((w) => console.log('  warn', w));
if (errors.length) {
  console.log(`Errors: ${errors.length}`);
  [...new Set(errors)].forEach((e) => console.log('  ✗', e));
  process.exit(1);
}
console.log('No errors.');
