import MarkdownIt from 'markdown-it';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Raw HTML in posts is switched off: everything renders from Markdown only.
const md = new MarkdownIt({ html: false, linkify: true, typographer: true, quotes: '„“‚‘' });

// public/ in development; dist/client/ in a production build.
const publicDirs = [join(process.cwd(), 'public'), join(process.cwd(), 'dist', 'client')];
const svgCache = new Map<string, string | null>();

/** Local SVG figures in /images/ are inlined so their lettering uses the page's face. */
function inlineSvg(src: string): string | null {
  if (!/^\/images\/[a-z0-9-]+\.svg$/.test(src)) return null;
  if (svgCache.has(src)) return svgCache.get(src)!;
  const read = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8').replace(/<!--[\s\S]*?-->/g, '') : null);
  const base = publicDirs.find((d) => existsSync(join(d, src)));
  const wide = base ? read(join(base, src)) : null;
  let html: string | null = null;
  if (wide) {
    const narrow = read(join(base!, src.replace(/\.svg$/, '-schmal.svg')));
    html = `<div class="fig-wide">${wide}</div>` + (narrow ? `<div class="fig-narrow">${narrow}</div>` : '');
  }
  svgCache.set(src, html);
  return html;
}

// A paragraph that holds only an image becomes a numbered figure plate ("Abb. n").
md.core.ruler.push('figures', (state) => {
  const t = state.tokens;
  let n = 0;
  for (let i = 0; i < t.length - 2; i++) {
    if (t[i].type !== 'paragraph_open' || t[i + 2].type !== 'paragraph_close') continue;
    const kids = (t[i + 1].children ?? []).filter((c) => !(c.type === 'text' && !c.content.trim()) && c.type !== 'softbreak');
    if (kids.length !== 1 || kids[0].type !== 'image') continue;
    n += 1;
    const img = kids[0];
    const src = img.attrGet('src') ?? '';
    const alt = img.children?.map((c) => c.content).join('') ?? '';
    const caption = img.attrGet('title') || alt;
    const esc = md.utils.escapeHtml;
    const media =
      inlineSvg(src) ??
      `<img src="${esc(md.normalizeLink(src))}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;
    const block = new state.Token('html_block', '', 0);
    block.content = `<figure>${media}<figcaption><span class="fig-no">Abb. ${n}</span> ${esc(caption)}</figcaption></figure>\n`;
    t.splice(i, 3, block);
  }
});

// External links open normally but never get access to this page.
const defaultLink = md.renderer.rules.link_open ?? ((tokens, idx, opts, _env, self) => self.renderToken(tokens, idx, opts));
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  const href = tokens[idx].attrGet('href') ?? '';
  if (/^https?:\/\//.test(href)) tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultLink(tokens, idx, opts, env, self);
};

export function renderMarkdown(src: string): string {
  return md.render(src ?? '');
}
