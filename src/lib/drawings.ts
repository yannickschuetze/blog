import type { RowDataPacket } from 'mysql2';
import { db } from './db';
import { uploadUrl } from './uploads';

/** The fixed drawing slots outside posts, with what each should show. */
export const SLOTS = {
  home: { label: 'Startseite', idea: 'Das große Bild für die Startseite: ein Selbstporträt, ein Tier, irgendetwas, das nach dir aussieht.', ratio: '5 / 2' },
  geschichten: { label: 'Geschichten', idea: 'Etwas Erzählendes: eine Figur, die gerade etwas erlebt.', ratio: '4 / 3' },
  projekte: { label: 'Projekte', idea: 'Etwas Gebautes: Werkzeug, Schrauben, eine halbfertige Maschine.', ratio: '4 / 3' },
  portrait: { label: 'Über mich', idea: 'Ein gezeichnetes Selbstporträt.', ratio: '1 / 1' },
  '404': { label: 'Seite nicht gefunden', idea: 'Etwas Verlorenes: eine leere Seite, ein Fragezeichen mit Beinen.', ratio: '1 / 1' },
} as const;
export type Slot = keyof typeof SLOTS;
/** Display order (object keys that look like numbers would otherwise sort first). */
export const SLOT_ORDER: Slot[] = ['home', 'geschichten', 'projekte', 'portrait', '404'];

export interface DrawingRef { src: string; alt: string }

export async function getDrawing(slot: Slot): Promise<DrawingRef | null> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT file, alt FROM drawings WHERE slot = ? LIMIT 1', [slot]);
  return rows[0] ? { src: uploadUrl(rows[0].file), alt: rows[0].alt } : null;
}

export async function getAllDrawings(): Promise<Record<string, { file: string; alt: string }>> {
  const [rows] = await db().query<RowDataPacket[]>('SELECT slot, file, alt FROM drawings');
  return Object.fromEntries(rows.map((r) => [r.slot, { file: r.file, alt: r.alt }]));
}
