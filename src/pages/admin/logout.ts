import type { APIRoute } from 'astro';
import { csrfOk, destroySession } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const form = await request.formData();
  if (!csrfOk(locals.session, form)) return new Response('Ungültige Anfrage', { status: 403 });
  await destroySession(cookies);
  return redirect('/admin/login');
};
