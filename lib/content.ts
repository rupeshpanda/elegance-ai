// ═══════════════════════════════════════════════════════════════
// SITE CONTENT — Edit this file to update everything on the site.
// No design knowledge needed. Just update the text and URLs.
// ═══════════════════════════════════════════════════════════════

export const site = {
  name:     "Elegance AI",
  domain:   "eleganceai.ai",
  linkedin: "https://linkedin.com/in/rupeshpanda",
  email:    "rupeshpanda@gmail.com",
};

export const hero = {
  eyebrow: "Enterprise AI · Independent Perspective",
  headline: ["Helping CIOs navigate", "AI in the enterprise", "landscape."],
  sub: `I write about what it actually takes to integrate AI into complex enterprise environments —
    existing SAP landscapes, legacy architecture, governance constraints, and the real economics
    of inference at scale. No vendor agenda. No hype. Just honest analysis from someone who
    lives in these systems.`,
  cta1: { label: "Read my thinking", href: "#perspectives" },
  cta2: { label: "Explore demos",    href: "#work" },
  byline: {
    name: "Rupesh Panda",
    role: "Enterprise AI Practitioner · Frisco, Dallas TX",
  },
  stats: [
    { value: "8",    label: "Topics covered" },
    { value: "4",    label: "Demo systems built" },
    { value: "100",  label: "AI Edge members" },
    { value: "Free", label: "Always" },
  ],
  quote: {
    text: "Finally — AI writing that speaks to the realities of enterprise IT, not just startup greenfield. This is what CIOs actually need to read.",
    cite: "VP of Technology, Fortune 500",
  },
};

export const whatIShare = {
  eyebrow: "What you'll find here",
  headline: "Three things I do.\nAll of it free.",
  sub: "I write to share what I learn at the intersection of enterprise architecture and AI, build demos to make complex ideas concrete, and host a weekly community where practitioners help each other. No charge. Ever.",
  items: [
    {
      num:   "01",
      title: "Enterprise AI Perspectives",
      desc:  "I write about the real challenges of integrating AI into enterprise landscapes — SAP ecosystems, headless architecture, agentic systems, inference economics, and context engineering. Written for technical leaders making high-stakes decisions.",
      link:  "#perspectives",
      cta:   "Read my writing",
    },
    {
      num:   "02",
      title: "Demo Systems & Experiments",
      desc:  "I build AI systems to explore ideas and make abstract concepts concrete for enterprise audiences. Each demo is documented so engineering teams can understand the architecture and adapt it. All openly shared.",
      link:  "#work",
      cta:   "Explore demos",
    },
    {
      num:   "03",
      title: "The AI Edge — Free Community",
      desc:  "A free weekly session where business leaders and practitioners learn to apply AI. I started it because I couldn't find education that bridged the gap between enterprise IT reality and AI possibility. No fees. No upsells.",
      link:  "#edge",
      cta:   "Join for free",
    },
  ],
};

export const perspectives = {
  eyebrow:  "Perspectives",
  headline: "Ideas worth\nacting on.",
  sub:      "Written for CIOs and enterprise technology leaders navigating the shift to AI — with the complexity of real IT landscapes in mind.",
  articles: [
    {
      tag:     "Agentic AI",
      title:   "Implementing Agentic AI in the Enterprise: What the Vendors Won't Tell You",
      excerpt: "Agentic AI is not a product you deploy — it's an architectural shift. Before you evaluate a single vendor, there are five foundational decisions your organisation needs to make about autonomy, observability, and failure modes.",
      date:    "May 2025",
      url:     "#",
    },
    {
      tag:     "Architecture",
      title:   "Headless Architecture and the AI Integration Layer: A CIO's Framework",
      excerpt: "Headless architecture was sold as a content strategy. In the age of AI, it's becoming the default pattern for enterprise AI integration — separating the intelligence layer from the presentation layer in ways that have profound implications for your existing investments.",
      date:    "May 2025",
      url:     "#",
    },
    {
      tag:     "SAP & ERP",
      title:   "SAP Joule: What Enterprise Leaders Need to Understand Before the Sales Call",
      excerpt: "SAP's Joule is one of the most consequential AI bets in the enterprise software market. Here's an unbiased analysis of what it actually does, where it falls short, and how it changes the calculus for organisations mid-S/4HANA migration.",
      date:    "Apr 2025",
      url:     "#",
    },
    {
      tag:     "Economics",
      title:   "The Inference Economy: Why Token Costs Will Define Your AI Strategy",
      excerpt: "Most enterprise AI strategies are being built without a serious model of inference costs at scale. Token economics isn't a finance problem — it's an architecture problem. And the decisions you make today will be very expensive to unwind.",
      date:    "Apr 2025",
      url:     "#",
    },
    {
      tag:     "Context Engineering",
      title:   "Context Engineering: The Discipline Your AI Team Is Missing",
      excerpt: "Prompt engineering was a starting point. Context engineering is the practice that determines whether your enterprise AI systems actually perform at production scale — and most organisations have not yet built the capability to do it well.",
      date:    "Mar 2025",
      url:     "#",
    },
    {
      tag:     "Agentic Web",
      title:   "The Agentic Web and What It Means for Enterprise IT Governance",
      excerpt: "When AI agents can autonomously browse, interact, and transact across the web on behalf of your organisation, your existing IT governance frameworks are not equipped for what comes next. Here's how to start thinking about it.",
      date:    "Mar 2025",
      url:     "#",
    },
    {
      tag:     "Context Gap",
      title:   "The Context Gap: Why Enterprise AI Pilots Fail to Scale",
      excerpt: "The context gap is the distance between what your AI system knows and what it needs to know to be useful in your specific enterprise environment. Closing it is not a technology problem — it's a data architecture and organisational design problem.",
      date:    "Feb 2025",
      url:     "#",
    },
    {
      tag:     "Strategy",
      title:   "Token Maxing: Getting Maximum Value from Your AI Model Investments",
      excerpt: "Enterprise teams routinely leave 40–60% of their model's capability on the table. Token maxing is the set of practices — context structuring, batching, caching, and output shaping — that close that gap without increasing spend.",
      date:    "Feb 2025",
      url:     "#",
    },
  ],
};

export const work = {
  eyebrow:  "Demo Projects",
  headline: "Built to show.\nShared to teach.",
  sub:      "I build AI systems in my spare time to prove out enterprise architecture patterns and make complex concepts concrete. Each is documented with architecture decisions, not just output.",
  projects: [
    {
      title:  "Enterprise AI Readiness Assessment",
      desc:   "A structured diagnostic that evaluates AI readiness across five enterprise dimensions: data infrastructure, integration architecture, governance maturity, talent, and strategy alignment. Outputs a prioritised gap analysis — not a vendor-neutral score, but a realistic view of where to start.",
      tags:   ["Claude API", "Structured Output", "Enterprise Architecture"],
      status: "demo",
      url:    "#",
    },
    {
      title:  "Agentic Workflow Orchestrator",
      desc:   "A multi-agent system that demonstrates how enterprise tasks can be decomposed, routed, and executed across specialised agents — with human-in-the-loop checkpoints at defined risk thresholds. Built to show what agentic orchestration looks like inside an enterprise boundary, not in a greenfield environment.",
      tags:   ["AI Agents", "Orchestration", "Human-in-the-Loop"],
      status: "demo",
      url:    "#",
    },
    {
      title:  "SAP Context Bridge",
      desc:   "An experiment in connecting SAP transactional data to a language model context window — enabling natural language queries across ERP data without exposing raw APIs. Explores the context engineering challenges specific to structured enterprise data.",
      tags:   ["SAP", "Context Engineering", "RAG"],
      status: "demo",
      url:    "#",
    },
    {
      title:  "Inference Cost Modeller",
      desc:   "A planning tool that models inference costs at enterprise scale across different model tiers, context lengths, and usage patterns. Built because most AI business cases I've seen dramatically underestimate the economics of production AI at volume.",
      tags:   ["Token Economics", "Cost Modelling", "Strategy"],
      status: "demo",
      url:    "#",
    },
  ],
};

export const about = {
  eyebrow:  "About",
  headline: "Why I write.\nWhy I share.",
  paragraphs: [
    "I work full-time in the technology industry, at the intersection of enterprise systems and emerging AI capability. The question I hear most often from CIOs and technology leaders is not *\"should we do AI?\"* — that decision has already been made. The question is **\"how do we integrate AI into what we already have\"** — and that question is much harder than the vendors acknowledge.",
    "The complexity is real. Existing SAP landscapes, legacy integration layers, data governance obligations, inference economics at scale, the governance implications of autonomous agents — these are not problems that resolve with a SaaS subscription. They require **clear thinking, architectural discipline, and honest analysis** of trade-offs.",
    "I write about these problems because I find them genuinely fascinating, and because I believe the enterprise technology community deserves more independent analysis and fewer vendor-sponsored perspectives. Everything I publish here is written from my own observation and experience — no sponsorship, no affiliate arrangements.",
    "**Everything I share is pro bono.** I do this in my spare time because I believe clear thinking about enterprise AI should be accessible to the leaders who need it most — not gated behind a consulting retainer.",
  ],
  facts: [
    { key: "Location",   val: "Frisco, Dallas TX" },
    { key: "Focus",      val: "Enterprise AI integration & architecture" },
    { key: "Topics",     val: "Agentic AI · SAP Joule · Context Engineering · Inference Economics" },
    { key: "Community",  val: "The AI Edge — free weekly sessions" },
    { key: "Publishing", val: "Independent perspectives on LinkedIn" },
    { key: "Approach",   val: "Pro bono — no charge, no agenda" },
  ],
};

export const aiEdge = {
  eyebrow: "The AI Edge — Free Weekly Community",
  headline: ["A free community for", "practitioners who want to", "actually use AI."],
  italicLine: "actually use AI.",
  desc: "Every Wednesday I host a free live session on practical AI application — moving from theory to implementation. I started it because I couldn't find AI education that spoke honestly to the constraints of enterprise environments. No fees. No upsells. Just rigorous, practical learning with peers.",
  features: [
    "Weekly live session — every Wednesday, 1 hour",
    "100 members: business owners, technologists, and practitioners",
    "Full recordings + curated resource library",
    "Monthly deep-dives on enterprise AI topics",
    "No technical prerequisite — curiosity is the only requirement",
  ],
  stats: [
    { n: "100",    l: "Members" },
    { n: "1×",     l: "Weekly session" },
    { n: "Free",   l: "Always" },
    { n: "Frisco", l: "TX + remote" },
  ],
  quote: {
    text: "The most grounded AI education I've encountered. It bridges the gap between what vendors promise and what enterprise IT actually has to work with.",
    cite: "IT Director, mid-market manufacturing firm",
  },
};

export const contact = {
  eyebrow:  "Contact",
  headline: "Let's exchange\nideas.",
  sub:      "If you're a CIO, technology leader, or practitioner thinking through AI integration challenges — I'm genuinely happy to have a candid conversation. No pitch. No invoice. Just an honest exchange with someone who finds this space fascinating.",
  links: [
    { key: "Email",    val: "rupeshpanda@gmail.com",       url: "mailto:rupeshpanda@gmail.com" },
    { key: "LinkedIn", val: "linkedin.com/in/rupeshpanda", url: "https://linkedin.com/in/rupeshpanda" },
    { key: "Location", val: "Frisco, Dallas TX",           url: "#" },
    { key: "Approach", val: "Pro bono — no charge, ever",  url: "#" },
  ],
  form: {
    namePlaceholder:    "Your full name",
    orgLabel:           "Organisation",
    orgPlaceholder:     "Company & role",
    emailPlaceholder:   "your@company.com",
    msgLabel:           "What are you working through?",
    msgPlaceholder:     "Describe the AI integration challenge you're facing, or the topic you'd like to discuss…",
    submitLabel:        "Send message →",
    successMsg:         "✓  Received — I'll reply personally within a day or two.",
    note:               "I read every message personally and reply within 48 hours.",
  },
};
