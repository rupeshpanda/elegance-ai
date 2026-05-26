type Section = { eyebrow: string; headline: string; sub: string };
type Project = { slug: string; title: string; desc: string; tags: readonly string[]; status: string; url: string };

export default function DemoWork({ section, projects }: { section: Section; projects: Project[] }) {
  return (
    <section id="work" className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold tracking-widest text-indigo uppercase mb-4">
            {section.eyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight whitespace-pre-line mb-5">
            {section.headline}
          </h2>
          <p className="text-base text-muted leading-relaxed">{section.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={project.url}
              className="group flex flex-col bg-card border border-border rounded-2xl p-8 hover:border-indigo/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-semibold tracking-widest text-indigo uppercase border border-indigo/25 px-2.5 py-1 rounded-full">
                  {project.status}
                </span>
                <svg className="text-muted group-hover:text-indigo transition-colors" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 10h12M10 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-navy mb-3 group-hover:text-indigo transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed flex-1 mb-6">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted border border-border rounded-full px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
