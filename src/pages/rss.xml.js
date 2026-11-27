import rss from '@astrojs/rss';
import { getPosts, postHref, SECTIONS } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'yannicksblog',
    description: 'Geschichten aus meinem Leben und Notizen zu den Projekten, die ich nebenbei baue.',
    site: context.site,
    customData: '<language>de-de</language>',
    items: posts.map((p) => ({
      title: `Nr. ${p.nr}: ${p.title}`,
      pubDate: p.date,
      description: p.summary ?? undefined,
      categories: [SECTIONS[p.section].label],
      link: postHref(p),
    })),
  });
}
