import fs from 'node:fs';

const manifestUrl = new URL('../../public/_generated/images/manifest.json', import.meta.url);

const manifest = fs.existsSync(manifestUrl)
  ? JSON.parse(fs.readFileSync(manifestUrl, 'utf8'))
  : {};

const normalizePublicPath = (value) => {
  if (!value || typeof value !== 'string') return '';
  const pathOnly = value.split(/[?#]/)[0];
  if (!pathOnly.startsWith('/')) return '';
  try {
    return decodeURIComponent(pathOnly);
  } catch {
    return pathOnly;
  }
};

const chooseFallback = (entry, targetWidth) =>
  entry.variants.find((variant) => variant.width >= Math.min(entry.width, targetWidth)) ??
  entry.variants[entry.variants.length - 1];

export const getResponsiveImageAttrs = (src, sizes, fallbackWidth = 960) => {
  const normalized = normalizePublicPath(src);
  const entry = manifest[normalized];
  if (!entry?.variants?.length) return { src };

  const fallback = chooseFallback(entry, fallbackWidth);
  return {
    src: fallback.src,
    srcset: entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
    sizes,
    width: entry.width,
    height: entry.height,
  };
};

export const getResponsiveBackgroundImage = (src, fallbackWidth = 1920) => {
  const normalized = normalizePublicPath(src);
  const entry = manifest[normalized];
  if (!entry?.variants?.length) return `url("${src}")`;

  const fallback = chooseFallback(entry, fallbackWidth);
  return `url("${fallback.src}")`;
};
