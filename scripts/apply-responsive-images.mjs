import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const manifestPath = path.join(root, 'public', '_generated', 'images', 'manifest.json');
const basePrefix = process.env.GITHUB_ACTIONS === 'true' ? '/gatasDoc' : '';
const withBase = (value) => `${basePrefix}${value}`;

const normalizePublicPath = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (/^(?:data:|mailto:|tel:|#|javascript:)/i.test(value)) return '';
  const url = new URL(value, 'https://www.aeroclubmaritime.com');
  if (url.origin !== 'https://www.aeroclubmaritime.com') return '';
  try {
    const decoded = decodeURIComponent(url.pathname);
    return basePrefix && decoded.startsWith(`${basePrefix}/`)
      ? decoded.slice(basePrefix.length)
      : decoded;
  } catch {
    return url.pathname;
  }
};

const htmlFiles = [];
const cssFiles = [];
const walk = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
    else if (entry.name.endsWith('.css')) cssFiles.push(fullPath);
  }
};

const chooseSizes = ($, image) => {
  const $image = $(image);
  if ($image.closest('.hero-slides').length) return '100vw';
  if ($image.hasClass('contact-qr-image')) return '200px';
  if ($image.closest('.image-gallery-grid').length) {
    return '(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 300px';
  }
  if ($image.closest('.article').length) {
    return '(max-width: 760px) 100vw, (max-width: 1120px) 70vw, 720px';
  }
  return '(max-width: 760px) 100vw, 720px';
};

const chooseFallback = (entry, sizes) => {
  const target = sizes === '100vw' ? 1920 : sizes === '200px' ? 400 : 960;
  return (
    entry.variants.find((variant) => variant.width >= Math.min(entry.width, target)) ??
    entry.variants[entry.variants.length - 1]
  );
};

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
await walk(distDir);

let changedFiles = 0;
let changedImages = 0;
let changedCssFiles = 0;
let changedCssImages = 0;

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const $ = load(html, { decodeEntities: false });
  let changed = false;

  $('img[src]').each((_, image) => {
    const originalSrc = $(image).attr('src');
    const normalized = normalizePublicPath(originalSrc);
    const entry = manifest[normalized];
    if (!entry?.variants?.length) return;

    const sizes = $(image).attr('sizes') || chooseSizes($, image);
    const fallback = chooseFallback(entry, sizes);
    $(image).attr('src', withBase(fallback.src));
    $(image).attr(
      'srcset',
      entry.variants.map((variant) => `${withBase(variant.src)} ${variant.width}w`).join(', '),
    );
    $(image).attr('sizes', sizes);
    if (!$(image).attr('width')) $(image).attr('width', String(entry.width));
    if (!$(image).attr('height')) $(image).attr('height', String(entry.height));
    if (!$(image).attr('decoding')) $(image).attr('decoding', 'async');
    if (!$(image).attr('loading') && !$(image).closest('.hero-slides').length) {
      $(image).attr('loading', 'lazy');
    }

    changed = true;
    changedImages += 1;
  });

  if (changed) {
    await fs.writeFile(file, $.html());
    changedFiles += 1;
  }
}

for (const file of cssFiles) {
  const css = await fs.readFile(file, 'utf8');
  let replacements = 0;
  const rewritten = css.replace(/url\((["']?)(\/(?:images|files)\/[^)"']+\.(?:jpe?g|png|webp))(?:[?#][^)"']*)?\1\)/gi, (match, quote, src) => {
    const entry = manifest[normalizePublicPath(src)];
    if (!entry?.variants?.length) return match;
    replacements += 1;
    return `url(${quote}${withBase(entry.fallback)}${quote})`;
  });

  if (replacements) {
    await fs.writeFile(file, rewritten);
    changedCssFiles += 1;
    changedCssImages += replacements;
  }
}

console.log(`Applied responsive image markup to ${changedImages} images across ${changedFiles} HTML files.`);
console.log(`Rewrote ${changedCssImages} CSS image references across ${changedCssFiles} CSS files.`);
