import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FILE_RE, mimeFor, uploadDir } from '../../lib/uploads';

// Serves uploaded drawings. Names are random and never reused, so they can be cached forever.
export const GET: APIRoute = async ({ params }) => {
  const file = params.file ?? '';
  const mime = mimeFor(file);
  if (!FILE_RE.test(file) || !mime) return new Response('Not found', { status: 404 });
  try {
    const body = await readFile(join(uploadDir(), file));
    return new Response(body, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
