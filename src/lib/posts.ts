import type { RowDataPacket } from 'mysql2';
import { db } from './db';

export type Section = 'geschichte' | 'projekt';
export type Status = 'draft' | 'published';

export interface Post {
  id: number;
  nr: number;
  title: string;
  section: Section;
  date: Date;
  dateIso: string;
  summary: string | null;
  body: string;
  drawing: string | null;
  drawingIdea: string | null;
  status: Status;
  placeholder: boolean;
  updatedAt: string;
}

export const SECTIONS = {
  geschichte: { label: 'Geschichte', plural: 'Geschichten', href: '/geschichten/' },
  projekt: { label: 'Projekt', plural: 'Projekte', href: '/projekte/' },
} as const;

function toPost(r: RowDataPacket): Post {
  const iso = String(r.published_on).slice(0, 10);
  return {
    id: r.id,
    nr: r.nr,
    title: r.title,
    section: r.section,
    date: new Date(`${iso}T12:00:00`),
    dateIso: iso,
    summary: r.summary,
    body: r.body,
    drawing: r.drawing,
    drawingIdea: r.drawing_idea,
    status: r.status,
    placeholder: Boolean(r.placeholder),
    updatedAt: String(r.updated_at),
  };
}

/** Published posts, newest number first. */
export async function getPosts(section?: Section): Promise<Post[]> {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT * FROM posts WHERE status = 'published' ${section ? 'AND section = ?' : ''} ORDER BY nr DESC`,
    section ? [section] : [],
  );
  return rows.map(toPost);
}

/** Every post including drafts, for the admin. */
export async function getAllPosts(): Promise<Post[]> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT * FROM posts ORDER BY nr DESC');
  return rows.map(toPost);
}

export async function getPostByNr(nr: number, includeDrafts = false): Promise<Post | null> {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT * FROM posts WHERE nr = ? ${includeDrafts ? '' : "AND status = 'published'"} LIMIT 1`,
    [nr],
  );
  return rows[0] ? toPost(rows[0]) : null;
}

export async function getPostById(id: number): Promise<Post | null> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? toPost(rows[0]) : null;
}

/** Published neighbours by number: older has a lower number, newer a higher one. */
export async function getNeighbours(nr: number): Promise<{ older: Post | null; newer: Post | null }> {
  const [older] = await db().query<RowDataPacket[]>(
    "SELECT * FROM posts WHERE status = 'published' AND nr < ? ORDER BY nr DESC LIMIT 1",
    [nr],
  );
  const [newer] = await db().query<RowDataPacket[]>(
    "SELECT * FROM posts WHERE status = 'published' AND nr > ? ORDER BY nr ASC LIMIT 1",
    [nr],
  );
  return { older: older[0] ? toPost(older[0]) : null, newer: newer[0] ? toPost(newer[0]) : null };
}

export async function nextNr(): Promise<number> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT COALESCE(MAX(nr), 0) + 1 AS next FROM posts');
  return Number(rows[0].next);
}

export const postHref = (p: Pick<Post, 'nr'>) => `/${padNr(p.nr)}/`;
export const padNr = (nr: number) => nr.toString().padStart(3, '0');

const dateFmt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const longFmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
export const fmtDate = (d: Date) => dateFmt.format(d);
export const fmtLong = (d: Date) => longFmt.format(d);

export function readingMinutes(body = ''): number {
  const words = body.replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function groupByYear(posts: Post[]): [number, Post[]][] {
  const groups = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.date.getFullYear();
    groups.set(y, [...(groups.get(y) ?? []), p]);
  }
  return [...groups.entries()];
}
