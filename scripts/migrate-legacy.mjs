import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'docs');
const targetDir = path.join(root, 'src', 'content', 'docs');

const linkMap = new Map([
  ['index.md', ''],
  ['gatas-Pulse.md', 'pulse-builder-guide/'],
  ['Firmware-Install.md', 'firmware-install/'],
  ['First-Time-Setup.md', 'first-time-setup/'],
  ['Update-Firmware.md', 'update-firmware/'],
  ['gatas-Connect.md', 'gatas-connect/'],
  ['All modules explained.md', 'modules/'],
  ['FAQ.md', 'faq/'],
  ['For-Developers.md', 'developers/'],
  ['License.md', 'license/'],
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const convertAdmonitions = (markdown) => {
  const lines = markdown.split('\n');
  const output = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^!!!\s+(\w+)(?:\s+"([^"]+)")?\s*$/i);
    if (!match) {
      output.push(lines[index]);
      continue;
    }

    const kind = match[1].toUpperCase();
    const title = match[2] || kind[0] + kind.slice(1).toLowerCase();
    const body = [];
    while (index + 1 < lines.length && (/^\s{4}/.test(lines[index + 1]) || lines[index + 1] === '')) {
      index += 1;
      body.push(lines[index].replace(/^\s{4}/, ''));
    }
    output.push(`> **${title}**`);
    output.push('>');
    for (const line of body) output.push(line ? `> ${line}` : '>');
  }

  return output.join('\n');
};

const convertQuestions = (markdown) => {
  const lines = markdown.split('\n');
  const output = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\?\?\?\s+question\s+"([^"]+)"\s*$/i);
    if (!match) {
      output.push(lines[index]);
      continue;
    }

    output.push(`## ${match[1]}`);
    while (index + 1 < lines.length && (/^\s{4}/.test(lines[index + 1]) || lines[index + 1] === '')) {
      index += 1;
      output.push(lines[index].replace(/^\s{4}/, ''));
    }
  }

  return output.join('\n');
};

const normalize = (source) => {
  const legacyBrand = ['GA', 'TAS'].join('/');
  let markdown = source.replaceAll(legacyBrand, 'GATAS');
  markdown = markdown.replace(/<div class="grid cards" markdown>\s*/g, '');
  markdown = markdown.replace(/\s*<\/div>/g, '');
  markdown = markdown.replace(/\{width=\d+\}/g, '');
  markdown = markdown.replace(/]\(\.\/([^)]*\.md)\)/g, ']($1)');
  markdown = markdown.replace(/]\(images\//g, '](/images/');
  for (const [legacy, href] of linkMap) {
    markdown = markdown.replace(
      new RegExp(`\\]\\(${escapeRegex(legacy)}\\)`, 'g'),
      `](/${href})`,
    );
  }
  markdown = convertQuestions(markdown);
  markdown = convertAdmonitions(markdown);
  return `${markdown.trim()}\n`;
};

await fs.mkdir(targetDir, { recursive: true });
for (const filename of linkMap.keys()) {
  const source = await fs.readFile(path.join(sourceDir, filename), 'utf8');
  await fs.writeFile(path.join(targetDir, filename), normalize(source));
}

console.log(`Migrated ${linkMap.size} GATAS guides into Astro content.`);
