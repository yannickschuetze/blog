import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from './db';
import type { Post, Section, Status } from './posts';
import { saveUpload, removeUpload, uploadUrl } from './uploads';

export interface PostInput {
  nr: string;
  title: string;
  section: Section | '';
  date: string;
  summary: string;
  body: string;
  drawingIdea: string;
  placeholder: boolean;
}

export const todayBerlin = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());

export function inputFromPost(p: Post): PostInput {
  return {
    nr: String(p.nr),
    title: p.title,
    section: p.section,
    date: p.dateIso,
    summary: p.summary ?? '',
    body: p.body,
    drawingIdea: p.drawingIdea ?? '',
    placeholder: p.placeholder,
  };
}

export function inputFromForm(form: FormData): PostInput {
  const s = (k: string, max: number) => String(form.get(k) ?? '').replace(/\r\n/g, '\n').slice(0, max);
  const section = s('section', 20);
  return {
    nr: s('nr', 10).trim(),
    title: s('title', 300).trim(),
    section: section === 'geschichte' || section === 'projekt' ? section : '',
    date: s('date', 10).trim(),
    summary: s('summary', 500).trim(),
    body: s('body', 2_000_000),
    drawingIdea: s('drawingIdea', 300).trim(),
    placeholder: form.get('placeholder') === 'on',
  };
}

export async function validate(input: PostInput, id: number | null, publishing: boolean): Promise<string[]> {
  const errors: string[] = [];
  if (!input.title) errors.push('Der Titel fehlt.');
  if (!input.section) errors.push('Wähle eine Rubrik: Geschichte oder Projekt.');
  const nr = Number(input.nr);
  if (!Number.isInteger(nr) || nr < 1 || nr > 999999) {
    errors.push('Die Nummer muss eine ganze Zahl ab 1 sein.');
  } else {
    const [rows] = await db().query<RowDataPacket[]>('SELECT id FROM posts WHERE nr = ? AND id <> ? LIMIT 1', [nr, id ?? 0]);
    if (rows[0]) errors.push(`Nr. ${nr} ist schon vergeben. Nummern bleiben für immer, nimm eine andere.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) errors.push('Das Datum ist ungültig.');
  if (publishing && !input.body.trim()) errors.push('Ein Beitrag ohne Text kann nicht veröffentlicht werden.');
  return errors;
}

export async function handleUploads(form: FormData, input: PostInput, current: { drawing: string | null }) {
  const errors: string[] = [];
  let drawing = current.drawing;
  let body = input.body;

  if (form.get('removeDrawing') === 'on' && drawing) {
    await removeUpload(drawing);
    drawing = null;
  }
  const d = await saveUpload(form.get('drawing') as File | null, `nr-${input.nr}-zeichnung`);
  if (d && !d.ok) errors.push(`Zeichnung: ${d.error}`);
  if (d?.ok) {
    if (drawing) await removeUpload(drawing);
    drawing = d.file;
  }

  const img = await saveUpload(form.get('image') as File | null, `nr-${input.nr}-bild`);
  if (img && !img.ok) errors.push(`Bild im Text: ${img.error}`);
  if (img?.ok) {
    const caption = String(form.get('imageCaption') ?? '').replace(/[\[\]\n]/g, ' ').trim().slice(0, 200) || 'Bild';
    body = `${body.replace(/\s+$/, '')}\n\n![${caption}](${uploadUrl(img.file)})\n`;
  }
  return { errors, drawing, body };
}

export async function savePost(id: number | null, input: PostInput, drawing: string | null, body: string, status: Status): Promise<number> {
  const values = [
    Number(input.nr), input.title, input.section, input.date, input.summary || null, body,
    drawing, input.drawingIdea || null, status, input.placeholder ? 1 : 0,
  ];
  if (id) {
    await db().query(
      `UPDATE posts SET nr = ?, title = ?, section = ?, published_on = ?, summary = ?, body = ?,
         drawing = ?, drawing_idea = ?, status = ?, placeholder = ? WHERE id = ?`,
      [...values, id],
    );
    return id;
  }
  const [res] = await db().query<ResultSetHeader>(
    `INSERT INTO posts (nr, title, section, published_on, summary, body, drawing, drawing_idea, status, placeholder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    values,
  );
  return res.insertId;
}

export async function deletePost(p: Post) {
  await db().query('DELETE FROM posts WHERE id = ?', [p.id]);
  await removeUpload(p.drawing);
}
