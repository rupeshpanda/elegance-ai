import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DocumentRenderer } from '@keystatic/core/renderer';
import { getPerspective, getPerspectiveSlugs, getSite } from '../../../lib/reader';
import Nav from '../../../components/Nav';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPerspectiveSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPerspective(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Elegance AI`,
    description: article.excerpt,
  };
}

export default async function PerspectivePage({ params }: Props) {
  const { slug } = await params;
  const [article, site] = await Promise.all([getPerspective(slug), getSite()]);
  if (!article) notFound();

  return (
    <>
      <Nav site={site} />
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/#perspectives"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-12"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 8H4M8 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold tracking-widest text-indigo uppercase">
                {article.tag}
              </span>
              <span className="text-xs text-muted">{article.date}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-base text-muted leading-relaxed border-l-2 border-indigo pl-4">
              {article.excerpt}
            </p>
          </header>

          <div className="prose-article">
            <DocumentRenderer
              document={article.content as Parameters<typeof DocumentRenderer>[0]['document']}
              renderers={{
                inline: {
                  link: ({ href, children }) => (
                    <a href={href} className="text-indigo hover:underline">{children}</a>
                  ),
                },
                block: {
                  heading: ({ level, children }) => {
                    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                    const sizes: Record<number, string> = {
                      1: 'font-serif text-3xl text-navy mt-12 mb-4',
                      2: 'font-serif text-2xl text-navy mt-10 mb-3',
                      3: 'font-serif text-xl text-navy mt-8 mb-3',
                    };
                    return <Tag className={sizes[level] ?? 'font-serif text-lg text-navy mt-6 mb-2'}>{children}</Tag>;
                  },
                  paragraph: ({ children }) => (
                    <p className="text-base text-ink leading-relaxed mb-5">{children}</p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-indigo pl-4 my-6 text-muted italic">{children}</blockquote>
                  ),
                  divider: () => <hr className="border-border my-10" />,
                  list: ({ type, children }) => {
                    const Tag = type === 'ordered' ? 'ol' : 'ul';
                    return (
                      <Tag className={`mb-5 pl-6 space-y-1 text-ink leading-relaxed ${type === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                        {children}
                      </Tag>
                    );
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
