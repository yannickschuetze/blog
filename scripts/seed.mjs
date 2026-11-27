// Imports the placeholder posts from seed/posts as drafts, plus a placeholder About text.
// Existing rows are never overwritten.
import { readdir, readFile } from 'node:fs/promises';
import { connect } from './db-connect.mjs';

const dir = new URL('../seed/posts/', import.meta.url);

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Missing frontmatter');
  const data = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2].trim() + '\n' };
}

const db = await connect();
let added = 0;
for (const file of (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
  const { data, body } = parse(await readFile(new URL(file, dir), 'utf8'));
  const [res] = await db.query(
    `INSERT IGNORE INTO posts (nr, title, section, published_on, summary, body, drawing_idea, status, placeholder)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
    [
      Number(data.nr),
      data.title,
      data.section,
      data.date,
      data.summary || null,
      body,
      data.drawingIdea || null,
      data.placeholder === 'true' ? 1 : 0,
    ],
  );
  added += res.affectedRows;
}

const about = `Hier steht bald, wer ich bin, wo ich lebe und womit ich meine Tage verbringe. Ein paar Sätze, nicht mehr, so wie man sich jemandem vorstellt, den man gerade kennenlernt.

Die [Geschichten](/geschichten/) sind Erinnerungen und Erlebnisse, aufgeschrieben, damit sie nicht verloren gehen. Die [Projekte](/projekte/) sind Notizen zu Dingen, die ich abends und am Wochenende baue, mit allem, was dabei schiefging.

## Kontakt

Wie man mich erreicht, ergänze ich hier.
`;
await db.query(`INSERT IGNORE INTO pages (slug, body, placeholder) VALUES ('ueber-mich', ?, 1)`, [about]);
console.log(`Imported ${added} placeholder post(s) as drafts.`);
await db.end();
