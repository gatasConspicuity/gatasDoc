import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const dist = path.resolve('dist');
const basePrefix = process.env.GITHUB_ACTIONS === 'true' ? '/gatasDoc//' : '';
const htmlFiles = [];

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
};

const existsForUrl = (pathname) => {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  const withoutBase =
    basePrefix && (decoded === basePrefix || decoded.startsWith(`${basePrefix}/`))
      ? decoded.slice(basePrefix.length) || '/'
      : decoded;
  const clean = withoutBase.replace(/^\/+/, '');
  return [
    path.join(dist, clean),
    path.join(dist, `${clean}.html`),
    path.join(dist, clean, 'index.html'),
  ].some((candidate) => fs.existsSync(candidate));
};

walk(dist);
const missing = new Map();

for (const file of htmlFiles) {
  const $ = load(fs.readFileSync(file, 'utf8'));
  $('[href], [src]').each((_, element) => {
    const value = $(element).attr('href') ?? $(element).attr('src');
    if (!value || /^(https?:|mailto:|tel:|data:|#|javascript:)/.test(value)) return;
    if (basePrefix && value.startsWith(basePrefix) && !value.startsWith(`${basePrefix}/`)) {
      const references = missing.get(value) ?? [];
      references.push(path.relative(dist, file));
      missing.set(value, references);
      return;
    }
    const pathname = new URL(value, 'https://www.aeroclubmaritime.com').pathname;
    if (!existsForUrl(pathname)) {
      const references = missing.get(pathname) ?? [];
      references.push(path.relative(dist, file));
      missing.set(pathname, references);
    }
  });
}

if (missing.size) {
  for (const [url, references] of missing) {
    console.error(`${url} referenced by ${references.slice(0, 3).join(', ')}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Checked local links and assets across ${htmlFiles.length} HTML files.`);
}
