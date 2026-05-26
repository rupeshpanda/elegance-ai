import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export async function getSite() {
  const d = await reader.singletons.site.read();
  return {
    name:     d?.name     ?? 'Elegance AI',
    domain:   d?.domain   ?? 'eleganceai.ai',
    linkedin: d?.linkedin ?? '',
    email:    d?.email    ?? '',
  };
}

export async function getHero() {
  const d = await reader.singletons.hero.read();
  return {
    eyebrow:  d?.eyebrow  ?? '',
    headline: d?.headline ?? [],
    sub:      d?.sub      ?? '',
    cta1: { label: d?.cta1Label ?? '', href: d?.cta1Href ?? '' },
    cta2: { label: d?.cta2Label ?? '', href: d?.cta2Href ?? '' },
    byline: { name: d?.bylineName ?? '', role: d?.bylineRole ?? '' },
    stats:  (d?.stats ?? []).map(s => ({ value: s.value, label: s.label })),
    quote:  { text: d?.quoteText ?? '', cite: d?.quoteCite ?? '' },
  };
}

export async function getWhatIShare() {
  const d = await reader.singletons.whatIShare.read();
  return {
    eyebrow:  d?.eyebrow  ?? '',
    headline: d?.headline ?? '',
    sub:      d?.sub      ?? '',
    items: (d?.items ?? []).map(i => ({
      num: i.num, title: i.title, desc: i.desc, link: i.link, cta: i.cta,
    })),
  };
}

export async function getPerspectivesSection() {
  const d = await reader.singletons.perspectivesSection.read();
  return {
    eyebrow:  d?.eyebrow  ?? '',
    headline: d?.headline ?? '',
    sub:      d?.sub      ?? '',
  };
}

export async function getWorkSection() {
  const d = await reader.singletons.workSection.read();
  return {
    eyebrow:  d?.eyebrow  ?? '',
    headline: d?.headline ?? '',
    sub:      d?.sub      ?? '',
  };
}

export async function getAbout() {
  const d = await reader.singletons.about.read();
  return {
    eyebrow:    d?.eyebrow    ?? '',
    headline:   d?.headline   ?? '',
    paragraphs: d?.paragraphs ?? [],
    facts: (d?.facts ?? []).map(f => ({ key: f.key, val: f.val })),
  };
}

export async function getAiEdge() {
  const d = await reader.singletons.aiEdge.read();
  return {
    eyebrow:    d?.eyebrow    ?? '',
    headline:   d?.headline   ?? [],
    italicLine: d?.italicLine ?? '',
    desc:       d?.desc       ?? '',
    features:   d?.features   ?? [],
    stats: (d?.stats ?? []).map(s => ({ n: s.n, l: s.l })),
    quote: { text: d?.quoteText ?? '', cite: d?.quoteCite ?? '' },
  };
}

export async function getContact() {
  const d = await reader.singletons.contact.read();
  return {
    eyebrow:  d?.eyebrow  ?? '',
    headline: d?.headline ?? '',
    sub:      d?.sub      ?? '',
    links: (d?.links ?? []).map(l => ({ key: l.key, val: l.val, url: l.url })),
  };
}

export async function getPerspectives() {
  const slugs = await reader.collections.perspectives.list();
  return Promise.all(
    slugs.map(async slug => {
      const d = await reader.collections.perspectives.read(slug);
      return {
        slug,
        tag:     d?.tag     ?? '',
        title:   d?.title ?? '',
        excerpt: d?.excerpt  ?? '',
        date:    d?.date     ?? '',
        url:     `/perspectives/${slug}`,
      };
    })
  );
}

export async function getPerspective(slug: string) {
  const d = await reader.collections.perspectives.read(slug, { resolveLinkedFiles: true });
  if (!d) return null;
  return {
    slug,
    tag:     d.tag     ?? '',
    title:   d.title   ?? '',
    excerpt: d.excerpt ?? '',
    date:    d.date    ?? '',
    content: d.content ?? [],
  };
}

export async function getPerspectiveSlugs() {
  return reader.collections.perspectives.list();
}

export async function getWork() {
  const slugs = await reader.collections.work.list();
  return Promise.all(
    slugs.map(async slug => {
      const d = await reader.collections.work.read(slug);
      return {
        slug,
        title:  d?.title ?? '',
        desc:   d?.desc   ?? '',
        tags:   d?.tags   ?? [],
        status: d?.status ?? 'demo',
        url:    d?.url    ?? '#',
      };
    })
  );
}
