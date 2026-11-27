import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { UPLOAD_DIR } from 'astro:env/server';

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export const uploadDir = () => resolve(process.cwd(), UPLOAD_DIR);

const TYPES = {
  png: { mime: 'image/png', magic: (b: Buffer) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  jpg: { mime: 'image/jpeg', magic: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  webp: { mime: 'image/webp', magic: (b: Buffer) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
} as const;
type Ext = keyof typeof TYPES;

export const FILE_RE = /^[a-z0-9-]+-[a-f0-9]{16}\.(png|jpg|webp)$/;

export function mimeFor(file: string): string | null {
  const ext = file.split('.').pop() as Ext;
  return TYPES[ext]?.mime ?? null;
}

/** Detects the real type from the file's first bytes; the browser's claim is ignored. SVG is refused. */
function sniff(buf: Buffer): Ext | null {
  for (const ext of Object.keys(TYPES) as Ext[]) if (TYPES[ext].magic(buf)) return ext;
  return null;
}

export type SaveResult = { ok: true; file: string } | { ok: false; error: string };

export async function saveUpload(file: File | null, prefix: string): Promise<SaveResult | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: 'Die Datei ist größer als 12 MB.' };
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) return { ok: false, error: 'Nur PNG, JPEG oder WebP. SVG geht aus Sicherheitsgründen nicht.' };
  const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'zeichnung';
  const name = `${safePrefix}-${randomBytes(8).toString('hex')}.${ext}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(join(uploadDir(), name), buf, { flag: 'wx' });
  return { ok: true, file: name };
}

export async function removeUpload(file: string | null | undefined) {
  if (!file || !FILE_RE.test(file)) return;
  await unlink(join(uploadDir(), file)).catch(() => {});
}

export const uploadUrl = (file: string) => `/uploads/${file}`;
