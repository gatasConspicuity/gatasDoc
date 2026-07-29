import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const generatedDir = path.join(publicDir, '_generated', 'images');
const manifestPath = path.join(generatedDir, 'manifest.json');
const sourceRoots = ['src', 'astro.config.mjs'].map((entry) => path.join(root, entry));
const imageExtension = /\.(?:jpe?g|png|webp)$/i;
const candidateWidths = {
  hero: [768, 1280, 1920, 2560],
  gallery: [320, 640, 960, 1280, 1600],
  content: [360, 720, 1080, 1440],
};

const normalizePublicPath = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (/^(?:https?:|data:|#)/i.test(value)) return '';
  const pathOnly = value.split(/[?#]/)[0];
  if (!pathOnly.startsWith('/')) return '';
  try {
    return decodeURIComponent(pathOnly);
  } catch {
    return pathOnly;
  }
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52) || 'image';

const getWidthSet = (src) => {
  const lower = src.toLowerCase();
  if (/hero|header|tile|lelystad-airport|homebase/.test(lower)) return candidateWidths.hero;
  if (/flyin|fly-in|vloot|gallery|foto|img_|whatsapp|vliegverhalen/.test(lower)) return candidateWidths.gallery;
  return candidateWidths.content;
};

const collectFiles = async (entry) => {
  const stat = await fs.stat(entry).catch(() => undefined);
  if (!stat) return [];
  if (stat.isFile()) return [entry];
  const found = [];
  const children = await fs.readdir(entry, { withFileTypes: true });
  for (const child of children) {
    if (child.name === 'node_modules' || child.name === 'dist' || child.name === '.astro') continue;
    found.push(...await collectFiles(path.join(entry, child.name)));
  }
  return found;
};

const collectImageReferences = async () => {
  const files = (await Promise.all(sourceRoots.map(collectFiles))).flat();
  const refs = new Set();

  const patterns = [
    /["'`](\/(?:images|files)\/[^"'`]+\.(?:jpe?g|png|webp))(?:[?#][^"'`]*)?["'`]/gi,
    /!\[[^\]]*]\((\/(?:images|files)\/[^)]+\.(?:jpe?g|png|webp))(?:\s+["'][^)]*)?\)/gi,
    /url\(["']?(\/(?:images|files)\/[^)"']+\.(?:jpe?g|png|webp))(?:[?#][^)"']*)?["']?\)/gi,
  ];

  for (const file of files) {
    if (!/\.(?:astro|css|js|mjs|ts|md|mdx|json)$/i.test(file)) continue;
    const text = await fs.readFile(file, 'utf8');
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        const normalized = normalizePublicPath(match[1]);
        if (normalized && imageExtension.test(normalized)) refs.add(normalized);
      }
    }
  }

  return [...refs].sort();
};

const toPublicFile = (src) => path.join(publicDir, src.replace(/^\/+/, ''));

const makeVariantPath = (src, width, stat) => {
  const hash = crypto
    .createHash('sha256')
    .update(`${src}:${stat.size}:${Math.round(stat.mtimeMs)}:${width}`)
    .digest('hex')
    .slice(0, 10);
  return `/_generated/images/${hash}-${slugify(path.basename(src))}-${width}.webp`;
};

const generateForImage = async (src) => {
  const sourceFile = toPublicFile(src);
  const stat = await fs.stat(sourceFile).catch(() => undefined);
  if (!stat?.isFile()) return undefined;

  const metadata = await sharp(sourceFile).metadata().catch(() => undefined);
  if (!metadata?.width || !metadata?.height) return undefined;

  const widthSet = getWidthSet(src);
  const widths = widthSet.filter((width) => width < metadata.width);
  const maxGeneratedWidth = widthSet[widthSet.length - 1];
  if (metadata.width <= maxGeneratedWidth && !widths.includes(metadata.width)) widths.push(metadata.width);
  if (!widths.length) widths.push(metadata.width);
  widths.sort((a, b) => a - b);

  const variants = [];
  for (const width of widths) {
    const outputPath = makeVariantPath(src, width, stat);
    const outputFile = path.join(publicDir, outputPath.replace(/^\/+/, ''));
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await sharp(sourceFile)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputFile);
    variants.push({ width, src: outputPath });
  }

  const fallback =
    variants.find((variant) => variant.width >= Math.min(metadata.width, 960)) ??
    variants[variants.length - 1];

  return {
    source: src,
    width: metadata.width,
    height: metadata.height,
    fallback: fallback.src,
    variants,
  };
};

const runWithConcurrency = async (items, limit, worker) => {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++];
      results.push(await worker(current));
    }
  });
  await Promise.all(runners);
  return results;
};

await fs.rm(generatedDir, { recursive: true, force: true });
await fs.mkdir(generatedDir, { recursive: true });

const refs = await collectImageReferences();
const generated = (await runWithConcurrency(refs, 4, generateForImage)).filter(Boolean);
const manifest = Object.fromEntries(generated.map((entry) => [entry.source, entry]));

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated responsive variants for ${generated.length} images.`);
