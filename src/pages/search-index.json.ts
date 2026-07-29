import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { docs } from '../data/navigation';

const plainText = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async () => {
  const content = await Promise.all(
    docs.map(async (page) => {
      const source = await fs.readFile(
        path.join(process.cwd(), 'src', 'content', 'docs', page.source),
        'utf8',
      );
      return {
        slug: page.slug,
        title: page.title,
        description: page.description,
        order: page.order,
        content: plainText(source).slice(0, 12000),
      };
    }),
  );

  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
