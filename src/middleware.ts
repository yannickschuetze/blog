import { defineMiddleware } from 'astro:middleware';
import { getSession } from './lib/auth';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin && pathname !== '/admin/login' && pathname !== '/admin/login/') {
    const session = await getSession(ctx.cookies);
    if (!session) return ctx.redirect('/admin/login');
    ctx.locals.session = session;
  }

  const res = await next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (isAdmin) {
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
});
