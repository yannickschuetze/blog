import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { AstroCookies } from 'astro';
import type { RowDataPacket } from 'mysql2';
import { ADMIN_USER, ADMIN_PASSWORD_HASH } from 'astro:env/server';
import { db } from './db';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

export const COOKIE = 'yb_admin';
const SESSION_DAYS = 30;
const WINDOW_MINUTES = 15;
const MAX_FAILURES = 8;
const MAX_FAILURES_GLOBAL = 40;

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checks user name and password against ADMIN_USER / ADMIN_PASSWORD_HASH (scrypt$N$r$p$salt$key). */
export async function verifyLogin(user: string, password: string): Promise<boolean> {
  const parts = ADMIN_PASSWORD_HASH.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, N, r, p, salt, key] = parts;
  const expected = Buffer.from(key, 'base64');
  const actual = await scrypt(password, Buffer.from(salt, 'base64'), expected.length, {
    N: Number(N), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  });
  const userOk = safeEqual(Buffer.from(sha256(user)), Buffer.from(sha256(ADMIN_USER)));
  return safeEqual(actual, expected) && userOk;
}

/**
 * The address used for rate limiting. On netcup the app sits behind Plesk's nginx, which appends
 * the real client address as the LAST X-Forwarded-For entry; earlier entries can be faked by the client.
 */
export function clientKey(request: Request, clientAddress: string): string {
  const xff = request.headers.get('x-forwarded-for');
  const last = xff?.split(',').map((s) => s.trim()).filter(Boolean).pop();
  return (last || clientAddress || 'unknown').slice(0, 64);
}

/** Locked when one address failed too often, or when failures from everywhere pile up (rotating addresses). */
export async function isLockedOut(key: string): Promise<boolean> {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT SUM(ip = ?) AS mine, COUNT(*) AS everyone FROM login_attempts WHERE attempted_at > NOW() - INTERVAL ? MINUTE`,
    [key, WINDOW_MINUTES],
  );
  return Number(rows[0].mine ?? 0) >= MAX_FAILURES || Number(rows[0].everyone ?? 0) >= MAX_FAILURES_GLOBAL;
}

export async function recordFailure(key: string) {
  await db().query('INSERT INTO login_attempts (ip) VALUES (?)', [key]);
  await db().query('DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL 1 DAY');
}

export async function clearFailures(key: string) {
  await db().query('DELETE FROM login_attempts WHERE ip = ?', [key]);
}

export interface Session { csrf: string }

export async function createSession(cookies: AstroCookies, secure: boolean) {
  const token = randomBytes(32).toString('hex');
  const csrf = randomBytes(32).toString('hex');
  await db().query(
    'INSERT INTO sessions (token_hash, csrf, expires_at) VALUES (?, ?, NOW() + INTERVAL ? DAY)',
    [sha256(token), csrf, SESSION_DAYS],
  );
  await db().query('DELETE FROM sessions WHERE expires_at < NOW()');
  cookies.set(COOKIE, token, {
    path: '/admin',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSession(cookies: AstroCookies): Promise<Session | null> {
  const token = cookies.get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const [rows] = await db().query<RowDataPacket[]>(
    'SELECT csrf FROM sessions WHERE token_hash = ? AND expires_at > NOW() LIMIT 1',
    [sha256(token)],
  );
  return rows[0] ? { csrf: rows[0].csrf } : null;
}

export async function destroySession(cookies: AstroCookies) {
  const token = cookies.get(COOKIE)?.value;
  if (token) await db().query('DELETE FROM sessions WHERE token_hash = ?', [sha256(token)]);
  cookies.delete(COOKIE, { path: '/admin' });
}

export function csrfOk(session: Session | null | undefined, form: FormData): boolean {
  const sent = String(form.get('csrf') ?? '');
  return Boolean(session) && safeEqual(Buffer.from(sent), Buffer.from(session!.csrf));
}
