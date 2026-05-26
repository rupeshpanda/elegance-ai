import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? { kind: 'github', repo: 'rupeshpanda/elegance-ai' }
      : { kind: 'local' },

  cloud: {
    project: 'rupeshpanda/elegance-ai',
  },

  ui: {
    brand: { name: 'Elegance AI' },
  },

  singletons: {
    site: singleton({
      label: 'Site Settings',
      path: 'content/site',
      schema: {
        name:     fields.text({ label: 'Site Name' }),
        domain:   fields.text({ label: 'Domain' }),
        linkedin: fields.text({ label: 'LinkedIn URL' }),
        email:    fields.text({ label: 'Email' }),
      },
    }),

    hero: singleton({
      label: 'Hero Section',
      path: 'content/hero',
      schema: {
        eyebrow:     fields.text({ label: 'Eyebrow' }),
        headline:    fields.array(fields.text({ label: 'Line' }), { label: 'Headline Lines', itemLabel: props => props.value || 'Line' }),
        sub:         fields.text({ label: 'Subheading', multiline: true }),
        cta1Label:   fields.text({ label: 'CTA 1 Label' }),
        cta1Href:    fields.text({ label: 'CTA 1 Link' }),
        cta2Label:   fields.text({ label: 'CTA 2 Label' }),
        cta2Href:    fields.text({ label: 'CTA 2 Link' }),
        bylineName:  fields.text({ label: 'Your Name' }),
        bylineRole:  fields.text({ label: 'Your Role / Location' }),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: props => props.fields.label.value || 'Stat' }
        ),
        quoteText: fields.text({ label: 'Testimonial Quote', multiline: true }),
        quoteCite: fields.text({ label: 'Testimonial Attribution' }),
      },
    }),

    whatIShare: singleton({
      label: 'What I Share Section',
      path: 'content/whatIShare',
      schema: {
        eyebrow:  fields.text({ label: 'Eyebrow' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        sub:      fields.text({ label: 'Subtext', multiline: true }),
        items: fields.array(
          fields.object({
            num:   fields.text({ label: 'Number (e.g. 01)' }),
            title: fields.text({ label: 'Title' }),
            desc:  fields.text({ label: 'Description', multiline: true }),
            link:  fields.text({ label: 'Link' }),
            cta:   fields.text({ label: 'CTA Label' }),
          }),
          { label: 'Items', itemLabel: props => props.fields.title.value || 'Item' }
        ),
      },
    }),

    perspectivesSection: singleton({
      label: 'Perspectives Section Header',
      path: 'content/perspectivesSection',
      schema: {
        eyebrow:  fields.text({ label: 'Eyebrow' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        sub:      fields.text({ label: 'Subtext', multiline: true }),
      },
    }),

    workSection: singleton({
      label: 'Demo Projects Section Header',
      path: 'content/workSection',
      schema: {
        eyebrow:  fields.text({ label: 'Eyebrow' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        sub:      fields.text({ label: 'Subtext', multiline: true }),
      },
    }),

    about: singleton({
      label: 'About Section',
      path: 'content/about',
      schema: {
        eyebrow:  fields.text({ label: 'Eyebrow' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        paragraphs: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Paragraphs', itemLabel: props => props.value?.substring(0, 60) + '…' || 'Paragraph' }
        ),
        facts: fields.array(
          fields.object({ key: fields.text({ label: 'Label' }), val: fields.text({ label: 'Value' }) }),
          { label: 'Facts', itemLabel: props => props.fields.key.value || 'Fact' }
        ),
      },
    }),

    aiEdge: singleton({
      label: 'AI Edge Section',
      path: 'content/aiEdge',
      schema: {
        eyebrow:    fields.text({ label: 'Eyebrow' }),
        headline:   fields.array(fields.text({ label: 'Line' }), { label: 'Headline Lines', itemLabel: props => props.value || 'Line' }),
        italicLine: fields.text({ label: 'Which line to italicise (must match a headline line exactly)' }),
        desc:       fields.text({ label: 'Description', multiline: true }),
        features:   fields.array(fields.text({ label: 'Feature' }), { label: 'Features', itemLabel: props => props.value || 'Feature' }),
        stats: fields.array(
          fields.object({ n: fields.text({ label: 'Value' }), l: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: props => props.fields.l.value || 'Stat' }
        ),
        quoteText: fields.text({ label: 'Testimonial Quote', multiline: true }),
        quoteCite: fields.text({ label: 'Testimonial Attribution' }),
      },
    }),

    contact: singleton({
      label: 'Contact Section',
      path: 'content/contact',
      schema: {
        eyebrow:  fields.text({ label: 'Eyebrow' }),
        headline: fields.text({ label: 'Headline', multiline: true }),
        sub:      fields.text({ label: 'Subtext', multiline: true }),
        links: fields.array(
          fields.object({
            key: fields.text({ label: 'Label' }),
            val: fields.text({ label: 'Display Value' }),
            url: fields.text({ label: 'URL' }),
          }),
          { label: 'Contact Links', itemLabel: props => props.fields.key.value || 'Link' }
        ),
      },
    }),
  },

  collections: {
    perspectives: collection({
      label: 'Perspectives (Articles)',
      slugField: 'title',
      path: 'content/perspectives/*',
      format: { contentField: 'content' },
      schema: {
        title:   fields.slug({ name: { label: 'Title' } }),
        tag:     fields.text({ label: 'Tag (e.g. Agentic AI)' }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        date:    fields.text({ label: 'Date (e.g. May 2025)' }),
        content: fields.document({
          label: 'Article Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),

    work: collection({
      label: 'Demo Projects',
      slugField: 'title',
      path: 'content/work/*',
      format: { contentField: 'content' },
      schema: {
        title:  fields.slug({ name: { label: 'Title' } }),
        desc:   fields.text({ label: 'Short Description', multiline: true }),
        tags:   fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value || 'Tag' }),
        status: fields.text({ label: 'Status (e.g. demo, live)' }),
        url:    fields.text({ label: 'URL' }),
        content: fields.document({
          label: 'Project Detail',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
});
