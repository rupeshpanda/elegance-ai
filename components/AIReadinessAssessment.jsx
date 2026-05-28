'use client'

import React, { useState } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

const ACCENT = '#1E3A5F'

const DIMENSIONS = [
  {
    name: 'Data Infrastructure',
    shortName: 'Data',
    description:
      'The quality, accessibility, and governance of the data your AI systems will operate on.',
    questions: [
      {
        text: 'How would you describe the quality of your master data across core systems?',
        options: [
          'Significant quality issues. Duplicates, gaps, and inconsistencies are common.',
          'Quality has improved through recent programmes but issues remain in key areas.',
          'Master data is largely clean and governed with defined ownership.',
          'Master data is actively governed, monitored, and fit for real-time AI consumption.',
        ],
      },
      {
        text: 'How accessible is your enterprise data to AI systems at the moment a decision needs to be made?',
        options: [
          'Data lives in siloed systems with no real-time access layer.',
          'Some data is accessible via APIs or integration middleware but coverage is partial.',
          'Most critical data is accessible through defined APIs with reasonable latency.',
          'A governed data access layer exists that delivers enterprise data to AI systems in near real-time.',
        ],
      },
      {
        text: 'How well does your organisation manage unstructured content — policies, contracts, process documents — as a data asset?',
        options: [
          'Unstructured content is scattered across SharePoint, email, and local drives with no governance.',
          'Some content is organised but not maintained consistently or structured for machine consumption.',
          'Key content assets are managed in defined repositories with version control and ownership.',
          'Unstructured content is actively curated, chunked, and maintained as a retrieval-ready knowledge base.',
        ],
      },
      {
        text: 'How current is the operational data your AI systems would act on?',
        options: [
          'Operational data is often stale. Batch updates and manual processes create significant lag.',
          'Most operational data is updated regularly but real-time signals are limited.',
          'Critical operational data is near real-time for most processes.',
          'Operational state is continuously available and can be consumed by agents at the point of decision.',
        ],
      },
    ],
  },
  {
    name: 'Integration Architecture',
    shortName: 'Integration',
    description:
      'Whether your enterprise systems can be reached by AI agents through clean, governed APIs.',
    questions: [
      {
        text: 'How would you describe the API surface of your core enterprise systems?',
        options: [
          'Most capabilities are locked behind UIs. APIs are limited or undocumented.',
          'APIs exist for some systems but coverage is inconsistent and consumption limits are unclear.',
          'Core systems expose well-documented APIs sufficient for standard integration patterns.',
          'Enterprise systems expose a comprehensive, governed API surface designed for high-frequency consumption including by AI agents.',
        ],
      },
      {
        text: 'How capable is your integration layer of supporting agent-scale API consumption patterns?',
        options: [
          'Integration is point-to-point. No middleware or orchestration layer exists.',
          'An integration platform exists but was designed for human-initiated flows, not agent loops.',
          'Integration middleware can support agentic consumption with some configuration.',
          'The orchestration layer manages authentication, rate limiting, retry logic, and governance for agent-scale API use.',
        ],
      },
      {
        text: "How clear is your organisation's position on vendor API policies for agentic consumption?",
        options: [
          'We have not assessed what our platform vendors permit for autonomous AI API use.',
          'We are aware of the issue but have not had formal conversations with key vendors.',
          'We have mapped our major vendor policies and understand the permitted pathways.',
          'We have formal agreements with key vendors covering agentic API consumption at scale.',
        ],
      },
      {
        text: 'How well can your AI systems coexist with your existing ERP, SaaS, and bespoke applications?',
        options: [
          'Integration is not designed for coexistence. AI pilots run in isolation from core systems.',
          'Some integrations exist but they are brittle and require significant maintenance.',
          'A defined integration pattern exists for connecting AI systems to core platforms.',
          'AI systems operate headlessly across the enterprise landscape through a governed API-first architecture.',
        ],
      },
    ],
  },
  {
    name: 'Governance and Observability',
    shortName: 'Governance',
    description:
      'Your ability to oversee, audit, and correct AI systems operating in production.',
    questions: [
      {
        text: 'How clearly has your organisation defined the boundary between autonomous AI decisions and decisions requiring human approval?',
        options: [
          'Autonomy boundaries have not been defined for any deployed or planned AI system.',
          'Boundaries are informally understood but not documented or formally approved.',
          'Autonomy boundaries are defined and documented for active AI use cases.',
          'Autonomy boundaries are formally governed, reviewed regularly, and updated as the business evolves.',
        ],
      },
      {
        text: 'How capable is your organisation of detecting when an AI system is producing wrong or drifting outputs?',
        options: [
          'We rely on downstream process failures to surface AI errors. No dedicated monitoring exists.',
          'We monitor output quality at a surface level but cannot trace reasoning or detect drift.',
          'Output monitoring exists and alerts are in place for defined failure patterns.',
          'Observability covers output quality, reasoning traceability, and drift detection across all production AI systems.',
        ],
      },
      {
        text: "How robust is your organisation's ability to audit AI-driven decisions?",
        options: [
          'No audit trail exists for AI decisions. We cannot explain why a specific decision was made.',
          'Some logging exists but it is not sufficient for regulatory or business review.',
          'AI decisions are logged with enough context to reconstruct the reasoning in most cases.',
          'Full decision audit trails exist, are stored appropriately, and have been tested against regulatory requirements.',
        ],
      },
      {
        text: 'How clearly defined is operational ownership of AI systems after go-live?',
        options: [
          'No one is specifically accountable for AI system performance in production.',
          'Ownership is informally assigned but not formalised with clear responsibilities.',
          'Named owners exist for active AI systems with defined responsibilities for monitoring and updates.',
          'An Agent Operator model is in place with formal accountability for context maintenance, drift management, and cost governance.',
        ],
      },
    ],
  },
  {
    name: 'Talent and Capability',
    shortName: 'Talent',
    description:
      'Whether your organisation has the skills and roles needed to build, deploy, and operate AI systems.',
    questions: [
      {
        text: "How would you describe your organisation's capability to build and deploy agentic AI systems?",
        options: [
          'No internal capability exists. We are entirely dependent on vendors.',
          'A small team has been experimenting but production deployment capability is limited.',
          'A defined team can build and deploy agents for well-scoped use cases.',
          'Multiple teams have demonstrated capability to build, evaluate, and deploy agentic systems at enterprise scale.',
        ],
      },
      {
        text: "How deep is your organisation's understanding of AI failure modes specific to enterprise environments?",
        options: [
          'We understand AI in general terms but have not mapped enterprise-specific failure modes.',
          'Some awareness exists of context gaps and hallucination risks but not systematically addressed.',
          'The team understands context gaps, drift, observability requirements, and inference economics at a working level.',
          'Enterprise AI failure modes are fully understood, actively monitored, and embedded in programme governance.',
        ],
      },
      {
        text: 'How well does your AI team understand the business processes they are automating or augmenting?',
        options: [
          'The AI team is technically strong but largely disconnected from business process knowledge.',
          'Some business process knowledge exists on the team but it is shallow or limited to one domain.',
          'The team has solid process knowledge for the use cases they are working on.',
          'The team combines deep technical capability with genuine business process expertise across multiple domains.',
        ],
      },
      {
        text: 'How prepared is your organisation to manage the change that AI deployment requires at the business level?',
        options: [
          'Change management has not been considered as part of AI deployment planning.',
          'Change management is acknowledged but not resourced or planned in detail.',
          'A change management approach exists and is integrated into the deployment plan.',
          'Change management, process redesign, and workforce transition planning are treated as core programme workstreams alongside the technical deployment.',
        ],
      },
    ],
  },
  {
    name: 'Strategy and Programme Alignment',
    shortName: 'Strategy',
    description:
      'Whether your AI investments are coherent, governed, and connected to business outcomes.',
    questions: [
      {
        text: "How clearly defined is your organisation's AI strategy in terms of specific business outcomes?",
        options: [
          'No formal AI strategy exists. Initiatives are ad hoc and uncoordinated.',
          'A strategy exists at a high level but lacks specific outcome targets or prioritisation.',
          'The strategy names priority use cases with defined business outcomes and investment levels.',
          'The strategy is fully integrated with business planning, regularly reviewed, and connected to measurable KPIs.',
        ],
      },
      {
        text: 'How seriously has your organisation modelled the economics of AI at production scale, including inference costs?',
        options: [
          'Cost modelling is based on pilot economics. No serious inference cost analysis has been done.',
          'Some cost modelling exists but it does not account for agent-scale consumption or adoption growth.',
          'Inference costs have been modelled at projected production volumes with sensitivity analysis.',
          'Inference economics are actively managed in production with model tier routing, caching strategy, and ongoing cost governance.',
        ],
      },
      {
        text: 'How well does your AI programme avoid spreading investment uniformly rather than concentrating on highest-value use cases?',
        options: [
          'AI investment is spread broadly with no systematic prioritisation by value or feasibility.',
          'Some prioritisation exists but it is based on interest rather than structured value assessment.',
          'Use cases are mapped against a value and feasibility framework with clear prioritisation.',
          'A rigorous use case portfolio exists with structured scoring across automation potential, context complexity, failure cost, and ROI.',
        ],
      },
      {
        text: 'How connected are your AI programme decisions to your enterprise architecture roadmap?',
        options: [
          'AI programmes run independently of enterprise architecture planning.',
          'Some coordination exists but AI and architecture decisions are made in separate processes.',
          'AI deployment decisions are reviewed against the enterprise architecture roadmap.',
          'AI readiness is a formal input to all enterprise architecture decisions including platform, data, and integration choices.',
        ],
      },
    ],
  },
]

const TIERS = [
  { min: 0, max: 39, label: 'AI Uninitiated' },
  { min: 40, max: 54, label: 'AI Exploring' },
  { min: 55, max: 69, label: 'AI Developing' },
  { min: 70, max: 84, label: 'AI Scaling' },
  { min: 85, max: 100, label: 'AI Leading' },
]

const DESCRIPTORS = [
  { max: 39, text: 'Foundational work needed before AI deployment at scale' },
  { max: 54, text: 'Building blocks exist but gaps will limit production reliability' },
  { max: 69, text: 'Solid foundation with specific gaps to address' },
  { max: 84, text: 'Strong position with targeted improvements available' },
  { max: 100, text: 'Leading practice, focus on maintaining and compounding' },
]

const RECOMMENDATIONS = [
  [
    {
      max: 39,
      text: 'Your data infrastructure is the primary constraint on any AI deployment. Before investing in AI platforms or use cases, prioritise master data governance and a realistic assessment of which data assets can support agent-quality decision making. Start with the use case you are most serious about and map the data requirements explicitly.',
    },
    {
      max: 69,
      text: 'Your data foundation is developing but gaps in real-time accessibility and unstructured content governance will limit what your agents can reliably do. Prioritise building a retrieval-ready knowledge base for your highest-priority use case and assess operational data latency for the workflows you are targeting.',
    },
    {
      max: 100,
      text: 'Your data infrastructure is a genuine strength. The focus should be on maintaining currency as the business evolves and ensuring the context layer for each new agent use case is explicitly designed rather than assumed.',
    },
  ],
  [
    {
      max: 39,
      text: 'Your integration landscape is not ready for agentic AI consumption. This is not a reason to delay AI planning, but it is a reason to start the API surface audit now. Map what agents can actually reach today and what needs to be built or rebuilt before meaningful deployment is possible.',
    },
    {
      max: 69,
      text: 'The integration foundation exists but was built for human-initiated flows, not agent loops. Prioritise the RAP or equivalent API modernisation work for the systems your highest-priority agents will need to reach. Have the vendor API policy conversation with your major platform providers before you commit to an architecture.',
    },
    {
      max: 100,
      text: 'Your integration architecture is well-positioned for agentic deployment. Ensure your orchestration layer can handle the governance requirements, rate limits, and audit trails that production agent operation demands at scale.',
    },
  ],
  [
    {
      max: 39,
      text: 'Deploying AI agents without defined autonomy boundaries and observability is the fastest way to lose executive confidence in the programme. Before scaling any use case, define the autonomy boundary in writing, get business sign-off, and build the minimum observability to detect when the agent is wrong.',
    },
    {
      max: 69,
      text: 'Governance exists but is not yet sufficient for the failure modes specific to agentic AI. Extend your monitoring to cover reasoning traceability and drift detection, not just output quality. Formalise the Agent Operator role for any system running in production.',
    },
    {
      max: 100,
      text: 'Governance is a strength. The focus should be on ensuring that audit trails and autonomy boundaries are reviewed and updated as use cases evolve and agent capabilities expand.',
    },
  ],
  [
    {
      max: 39,
      text: 'Capability gaps at this level mean that even well-designed AI programmes will struggle to deliver. Prioritise building one team that combines technical depth and business process knowledge, rather than spreading AI investment across multiple underpowered initiatives. Consider where external expertise can close the gap while internal capability develops.',
    },
    {
      max: 69,
      text: 'The team can build but may be underinvested in the enterprise-specific failure modes that determine production reliability. Invest in the context engineering discipline specifically and ensure change management is treated as a core workstream rather than a communication plan.',
    },
    {
      max: 100,
      text: 'Capability is a competitive asset. The focus should be on retaining it, extending domain coverage, and ensuring the Agent Operator role is developing as a formal function rather than an informal responsibility.',
    },
  ],
  [
    {
      max: 39,
      text: 'Without a coherent strategy and realistic cost model, AI investment will produce activity rather than value. Prioritise use case selection over platform selection and build the inference economics model before you commit to production architecture.',
    },
    {
      max: 69,
      text: 'Strategy exists but the economics and prioritisation disciplines need strengthening. Build a proper inference cost model at projected production volumes and apply a structured prioritisation framework to your use case portfolio before spreading investment further.',
    },
    {
      max: 100,
      text: 'Strategy alignment is strong. Ensure it is reviewed regularly as the AI landscape evolves and that enterprise architecture decisions continue to treat AI readiness as a formal input.',
    },
  ],
]

function getDimScore(answers, dimIdx) {
  const dimAnswers = answers[dimIdx]
  if (dimAnswers.some((a) => a === null)) return 0
  const sum = dimAnswers.reduce((acc, a) => acc + a, 0)
  return (sum / 16) * 100
}

function getOverallScore(answers) {
  const scores = DIMENSIONS.map((_, i) => getDimScore(answers, i))
  return scores.reduce((a, b) => a + b, 0) / 5
}

function getTier(score) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0]
}

function getDescriptor(score) {
  return (
    DESCRIPTORS.find((d) => score <= d.max)?.text ||
    DESCRIPTORS[DESCRIPTORS.length - 1].text
  )
}

function getRecommendation(dimIdx, score) {
  const recs = RECOMMENDATIONS[dimIdx]
  return recs.find((r) => score <= r.max)?.text || recs[recs.length - 1].text
}

function emptyAnswers() {
  return Array(5)
    .fill(null)
    .map(() => Array(4).fill(null))
}

function LandingScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-medium text-gray-900 mb-6 leading-tight">
          Enterprise AI Readiness Assessment
        </h1>
        <p className="text-gray-600 leading-relaxed mb-10">
          This assessment diagnoses where your organisation stands on AI readiness across five
          dimensions: data infrastructure, integration architecture, governance and observability,
          talent and capability, and strategy and programme alignment. It takes approximately ten
          minutes. You will receive a scored diagnostic with dimension-level analysis and
          prioritised recommendations.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-3 text-white text-sm font-medium rounded"
          style={{ backgroundColor: ACCENT }}
        >
          Start Assessment
        </button>
      </div>
    </div>
  )
}

function QuestionScreen({ dimIdx, questionIdx, answer, onSelect, onNext, onBack }) {
  const dimension = DIMENSIONS[dimIdx]
  const question = dimension.questions[questionIdx]

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-xl mx-auto">
        <p className="text-sm text-gray-400 mb-8">
          Dimension {dimIdx + 1} of 5, Question {questionIdx + 1} of 4
        </p>

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          {dimension.name}
        </p>
        <p className="text-lg font-medium text-gray-900 leading-snug mb-8">
          {question.text}
        </p>

        <div className="space-y-3 mb-10">
          {question.options.map((option, i) => {
            const score = i + 1
            const selected = answer === score
            return (
              <button
                key={i}
                onClick={() => onSelect(score)}
                className="w-full text-left px-5 py-4 rounded border text-sm leading-relaxed transition-colors"
                style={{
                  borderColor: selected ? ACCENT : '#E5E7EB',
                  backgroundColor: selected ? '#EEF2F7' : 'white',
                  color: '#111827',
                }}
              >
                {option}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          {answer !== null && (
            <button
              onClick={onNext}
              className="px-6 py-2.5 text-white text-sm rounded transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RadarDot(props) {
  const { cx, cy } = props
  if (cx == null || cy == null) return null
  return <circle cx={cx} cy={cy} r={4} fill={ACCENT} stroke="none" />
}

function ResultsScreen({ answers, onRestart }) {
  const dimScores = DIMENSIONS.map((_, i) => getDimScore(answers, i))
  const overall = getOverallScore(answers)
  const tier = getTier(overall)

  const radarData = DIMENSIONS.map((dim, i) => ({
    subject: dim.shortName,
    score: parseFloat(dimScores[i].toFixed(1)),
  }))

  const bottomThree = dimScores
    .map((score, i) => ({ score, i }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@media print { .no-print { display: none !important; } body { background: white; } }` }} />
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-12">
            <div
              className="inline-block px-5 py-2 rounded text-white text-sm font-medium mb-5"
              style={{ backgroundColor: ACCENT }}
            >
              {tier.label}
            </div>
            <div className="text-6xl font-medium text-gray-900 mb-2">
              {overall.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Overall AI Readiness Score</div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6 mb-8">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 13, fill: '#374151', fontFamily: 'inherit' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="score"
                  stroke={ACCENT}
                  strokeWidth={2}
                  fill={ACCENT}
                  fillOpacity={0}
                  dot={<RadarDot />}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {DIMENSIONS.map((dim, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded p-4">
                <div className="text-xs text-gray-500 mb-2 leading-tight">{dim.name}</div>
                <div className="text-2xl font-medium mb-1" style={{ color: ACCENT }}>
                  {dimScores[i].toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 leading-snug">
                  {getDescriptor(dimScores[i])}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-base font-medium text-gray-900 mb-5">Where to focus next</h2>
            <div className="space-y-4">
              {bottomThree.map(({ score, i }) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">
                      {DIMENSIONS[i].name}
                    </span>
                    <span className="text-sm text-gray-400">{score.toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getRecommendation(i, score)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-8 no-print">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
            >
              Download Report
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-2.5 text-white text-sm rounded transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              Start Again
            </button>
          </div>

          <p className="text-xs text-gray-400 italic">
            This assessment reflects the analytical framework developed through EleganceAI's
            enterprise AI research. It is a directional diagnostic, not a comprehensive audit.
          </p>
        </div>
      </div>
    </>
  )
}

export default function AIReadinessAssessment() {
  const [screen, setScreen] = useState('landing')
  const [currentDim, setCurrentDim] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState(emptyAnswers)

  const handleSelect = (score) => {
    setAnswers((prev) =>
      prev.map((dim, di) =>
        di === currentDim
          ? dim.map((q, qi) => (qi === currentQ ? score : q))
          : dim
      )
    )
  }

  const handleNext = () => {
    if (currentQ < 3) {
      setCurrentQ((q) => q + 1)
    } else if (currentDim < 4) {
      setCurrentDim((d) => d + 1)
      setCurrentQ(0)
    } else {
      setScreen('results')
    }
  }

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1)
    } else if (currentDim > 0) {
      setCurrentDim((d) => d - 1)
      setCurrentQ(3)
    } else {
      setScreen('landing')
    }
  }

  const handleRestart = () => {
    setAnswers(emptyAnswers())
    setCurrentDim(0)
    setCurrentQ(0)
    setScreen('landing')
  }

  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('assessment')} />
  }

  if (screen === 'results') {
    return <ResultsScreen answers={answers} onRestart={handleRestart} />
  }

  return (
    <QuestionScreen
      dimIdx={currentDim}
      questionIdx={currentQ}
      answer={answers[currentDim][currentQ]}
      onSelect={handleSelect}
      onNext={handleNext}
      onBack={handleBack}
    />
  )
}
