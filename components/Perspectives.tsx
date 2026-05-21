import { perspectives } from "@/lib/content";

export default function Perspectives() {
  return (
    <section id="perspectives" className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
              {perspectives.eyebrow}
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight whitespace-pre-line">
              {perspectives.headline}
            </h2>
          </div>
          <p className="text-sm text-muted max-w-xs leading-relaxed md:text-right">
            {perspectives.sub}
          </p>
        </div>

        <div className="divide-y divide-border">
          {perspectives.articles.map((article) => (
            <article key={article.title} className="py-8 group">
              <a
                href={article.url}
                className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold tracking-widest text-indigo uppercase">
                      {article.tag}
                    </span>
                    <span className="text-xs text-muted">{article.date}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-navy mb-3 group-hover:text-indigo transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-2xl">
                    {article.excerpt}
                  </p>
                </div>
                <div className="hidden md:flex items-start pt-1 text-muted group-hover:text-indigo transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M4 10h12M10 4l6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
