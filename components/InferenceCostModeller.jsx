'use client'

import React, { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const ACCENT = '#1E3A5F'
const TIER_COLORS = { frontier: '#1E3A5F', standard: '#2E6DA4', economy: '#5BA4CF' }
const RAMP = [0.20, 0.36, 0.52, 0.68, 0.84, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]

const AGENTIC_OPTIONS = [
  { value: 1,  label: '1x — Single call per interaction (standard chatbot or copilot)' },
  { value: 3,  label: '3x — Light agentic (agent breaks task into 2 to 3 steps)' },
  { value: 8,  label: '8x — Moderate agentic (agent reasons across 5 to 10 steps)' },
  { value: 20, label: '20x — Deep agentic (complex multi-step orchestration)' },
]

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmtCost(n) {
  if (Math.abs(n) >= 1000) return '$' + Math.round(n).toLocaleString('en-US')
  return '$' + Math.abs(n).toFixed(2)
}

function fmtAxis(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

// ─── Calculation engine ───────────────────────────────────────────────────────

function calculate(s) {
  const monthlyInteractions = s.users * s.interactionsPerDay * s.workingDays
  const eff = monthlyInteractions * s.agenticMultiplier

  const fiT = eff * (s.frontierAlloc / 100) * s.inputTokens
  const foT = eff * (s.frontierAlloc / 100) * s.outputTokens
  const siT = eff * (s.standardAlloc / 100) * s.inputTokens
  const soT = eff * (s.standardAlloc / 100) * s.outputTokens
  const eiT = eff * (s.economyAlloc  / 100) * s.inputTokens
  const eoT = eff * (s.economyAlloc  / 100) * s.outputTokens

  const fCost  = fiT / 1e6 * s.frontierInputPrice  + foT / 1e6 * s.frontierOutputPrice
  const stCost = siT / 1e6 * s.standardInputPrice  + soT / 1e6 * s.standardOutputPrice
  const eCostB = eiT / 1e6 * s.economyInputPrice   + eoT / 1e6 * s.economyOutputPrice

  const totalInputTokens = fiT + siT + eiT
  const wAvgInput = totalInputTokens > 0
    ? (fiT * s.frontierInputPrice + siT * s.standardInputPrice + eiT * s.economyInputPrice) / totalInputTokens
    : 0

  const cachingReduction = s.caching
    ? (totalInputTokens * 0.60 / 1e6) * wAvgInput * 0.80
    : 0

  const batchReduction = s.batchProcessing ? eCostB * 0.25 : 0
  const eCost = eCostB - batchReduction

  const total = fCost + stCost + eCost - cachingReduction

  const tierBreakdown = [
    { label: 'Frontier', cost: fCost,  color: TIER_COLORS.frontier },
    { label: 'Standard', cost: stCost, color: TIER_COLORS.standard },
    { label: 'Economy',  cost: eCost,  color: TIER_COLORS.economy  },
  ]

  const projection = RAMP.map((f, i) => ({ month: i + 1, cost: Math.round(total * f) }))

  const agenticTable = [1, 3, 8, 20].map(mult => {
    const e2 = monthlyInteractions * mult
    const fC2  = e2 * (s.frontierAlloc / 100) * s.inputTokens / 1e6 * s.frontierInputPrice
               + e2 * (s.frontierAlloc / 100) * s.outputTokens / 1e6 * s.frontierOutputPrice
    const sC2  = e2 * (s.standardAlloc / 100) * s.inputTokens / 1e6 * s.standardInputPrice
               + e2 * (s.standardAlloc / 100) * s.outputTokens / 1e6 * s.standardOutputPrice
    const eC2B = e2 * (s.economyAlloc  / 100) * s.inputTokens / 1e6 * s.economyInputPrice
               + e2 * (s.economyAlloc  / 100) * s.outputTokens / 1e6 * s.economyOutputPrice
    const cR2 = s.caching ? (e2 * s.inputTokens * 0.60 / 1e6) * wAvgInput * 0.80 : 0
    const bR2 = s.batchProcessing ? eC2B * 0.25 : 0
    return { mult, cost: fC2 + sC2 + eC2B - bR2 - cR2 }
  })

  // Recommendations
  const recs = []

  if (s.frontierAlloc > 40) {
    const newF = s.frontierAlloc - 20
    const newS = s.standardAlloc + 20
    const fC2  = eff * (newF / 100) * s.inputTokens / 1e6 * s.frontierInputPrice
               + eff * (newF / 100) * s.outputTokens / 1e6 * s.frontierOutputPrice
    const sC2  = eff * (newS / 100) * s.inputTokens / 1e6 * s.standardInputPrice
               + eff * (newS / 100) * s.outputTokens / 1e6 * s.standardOutputPrice
    const saving = total - (fC2 + sC2 + eCost - cachingReduction)
    recs.push(`Your current model mix allocates a high proportion of workloads to frontier tier models. At this allocation and usage volume, you are likely using frontier capability on tasks that a standard tier model would handle reliably. Review which workflows genuinely require frontier reasoning versus which were assigned there by default. Shifting 20 percentage points from frontier to standard at this volume would reduce your monthly cost by approximately ${fmtCost(saving)}.`)
  }

  if ((s.agenticMultiplier === 8 || s.agenticMultiplier === 20) && !s.caching) {
    const saving = (totalInputTokens * 0.60 / 1e6) * wAvgInput * 0.80
    recs.push(`Your agentic depth setting is generating a high number of model calls per user interaction. Without prompt caching enabled, your system prompt and static context are being billed on every call. Enabling caching on repeated context at this interaction volume would reduce your monthly cost by approximately ${fmtCost(saving)}.`)
  }

  if (s.economyAlloc < 20) {
    recs.push(`A significant portion of enterprise AI workloads — classification, routing, structured extraction, and summarisation of well-defined content — can be handled reliably by economy tier models at a fraction of standard tier cost. Increasing your economy tier allocation to 30 to 40 percent for eligible workloads is one of the highest-leverage cost optimisations available.`)
  }

  if (total > 500_000) {
    recs.push(`At this cost level, inference economics should be a standing agenda item at programme governance level, not a quarterly review. The decisions that drive this number — model tier routing, context length, agentic depth, and caching strategy — are architectural decisions with direct cost consequences. They should be owned explicitly, not left to default.`)
  }

  if (!s.caching && !s.batchProcessing && total > 100_000) {
    const saving = (totalInputTokens * 0.60 / 1e6) * wAvgInput * 0.80
    recs.push(`Neither prompt caching nor batch processing is currently enabled. At this volume, enabling prompt caching alone would reduce your monthly cost by approximately ${fmtCost(saving)}. These are not experimental features. They are standard cost management practices for enterprise AI deployments.`)
  }

  const finalRecs = recs.slice(0, 2)
  if (finalRecs.length === 0) {
    finalRecs.push(`Your current configuration reflects reasonable cost discipline. The primary lever for further optimisation at this usage pattern is reviewing agentic depth — ensure each workflow's recursion depth is justified by the task complexity rather than set by default.`)
  }

  return {
    total,
    annual: total * 12,
    perUser: s.users > 0 ? total / s.users : 0,
    tierBreakdown,
    projection,
    agenticTable,
    recommendations: finalRecs,
  }
}

// ─── Input primitives ─────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="mb-7">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">{title}</p>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function NumField({ label, helper, value, onChange, min, max, step = 1 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
      />
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  )
}

function SliderNum({ label, helper, value, onChange, min, max, step = 100 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        <input
          type="number" value={value} min={min} max={max} step={step}
          onChange={e => onChange(Number(e.target.value))}
          className="w-28 border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-gray-400"
        />
      </div>
      <input
        type="range" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: ACCENT }}
      />
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  )
}

function AllocSlider({ label, helper, value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        <span className="text-sm font-medium text-gray-900 w-12 text-right">{value}%</span>
      </div>
      <input
        type="range" value={value} min={0} max={100} step={5}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: ACCENT }}
      />
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  )
}

function Toggle({ label, helper, checked, onChange }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="mt-0.5 relative flex-shrink-0 w-10 h-6 rounded-full transition-colors"
        style={{ backgroundColor: checked ? ACCENT : '#D1D5DB' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: checked ? '22px' : '4px' }}
        />
      </button>
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {helper && <p className="text-xs text-gray-400 mt-0.5">{helper}</p>}
      </div>
    </div>
  )
}

function CostCard({ value, sublabel }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4 text-center">
      <div className="text-xl font-semibold text-gray-900 mb-1 leading-tight">{value}</div>
      <div className="text-xs text-gray-400">{sublabel}</div>
    </div>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded px-3 py-2 text-xs shadow-sm">
      <p className="text-gray-400 mb-0.5">Month {payload[0].payload.month}</p>
      <p className="font-medium text-gray-900">{fmtCost(payload[0].value)}</p>
    </div>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function InferenceCostModeller() {
  const [s, setS] = useState({
    users: 500,
    interactionsPerDay: 10,
    workingDays: 22,
    inputTokens: 2000,
    outputTokens: 500,
    agenticMultiplier: 3,
    frontierAlloc: 10,
    standardAlloc: 60,
    economyAlloc: 30,
    caching: false,
    batchProcessing: false,
    frontierInputPrice: 15,
    frontierOutputPrice: 75,
    standardInputPrice: 3,
    standardOutputPrice: 15,
    economyInputPrice: 0.30,
    economyOutputPrice: 1.50,
    advancedOpen: false,
  })

  const set = key => val => setS(prev => ({ ...prev, [key]: val }))

  const allocTotal = s.frontierAlloc + s.standardAlloc + s.economyAlloc
  const allocValid = allocTotal === 100

  const r = useMemo(() => calculate(s), [s])

  const PRICE_FIELDS = [
    ['Frontier — Input price per 1M tokens',  'frontierInputPrice'],
    ['Frontier — Output price per 1M tokens', 'frontierOutputPrice'],
    ['Standard — Input price per 1M tokens',  'standardInputPrice'],
    ['Standard — Output price per 1M tokens', 'standardOutputPrice'],
    ['Economy — Input price per 1M tokens',   'economyInputPrice'],
    ['Economy — Output price per 1M tokens',  'economyOutputPrice'],
  ]

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Inference Cost Modeller</h1>
          <p className="text-sm text-gray-400">Model AI inference costs at enterprise scale. All calculations update in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── INPUT PANEL ── */}
          <div className="bg-white border border-gray-200 rounded p-6">

            <Section title="Usage Volume">
              <NumField label="Enterprise users" helper="Active users generating AI interactions" value={s.users} onChange={set('users')} min={1} />
              <NumField label="Daily interactions per user" helper="Average number of AI calls per user per working day" value={s.interactionsPerDay} onChange={set('interactionsPerDay')} min={1} />
              <NumField label="Working days per month" value={s.workingDays} onChange={set('workingDays')} min={1} max={31} />
            </Section>

            <Section title="Token Consumption per Interaction">
              <SliderNum
                label="Input tokens per interaction"
                helper="Includes system prompt, retrieved context, and user message"
                value={s.inputTokens} onChange={set('inputTokens')} min={500} max={50000}
              />
              <SliderNum
                label="Output tokens per interaction"
                value={s.outputTokens} onChange={set('outputTokens')} min={100} max={10000}
              />
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Agentic depth</label>
                <select
                  value={s.agenticMultiplier}
                  onChange={e => set('agenticMultiplier')(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  {AGENTIC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Agents make multiple model calls per user interaction. This multiplies your token consumption.</p>
              </div>
            </Section>

            <Section title="Model Tier Allocation">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Total: <span className={allocValid ? 'text-gray-700' : 'font-semibold text-red-600'}>{allocTotal}%</span>
                </span>
                {!allocValid && (
                  <span className="text-xs font-semibold text-red-600">Allocations must total 100%</span>
                )}
              </div>
              <AllocSlider label="Frontier tier" helper="Complex reasoning, high-stakes decisions" value={s.frontierAlloc} onChange={set('frontierAlloc')} />
              <AllocSlider label="Standard tier" helper="Most enterprise workflows, RAG, analysis" value={s.standardAlloc} onChange={set('standardAlloc')} />
              <AllocSlider label="Economy tier"  helper="Classification, routing, structured extraction" value={s.economyAlloc} onChange={set('economyAlloc')} />
            </Section>

            <Section title="Cost Optimisations">
              <Toggle
                label="Prompt caching enabled"
                helper="Caches repeated system prompts and static context. Reduces input token cost significantly at scale."
                checked={s.caching} onChange={set('caching')}
              />
              <Toggle
                label="Batch processing for async workloads"
                helper="Applicable for non-real-time workloads. Typically 25 to 50% cost reduction on economy tier."
                checked={s.batchProcessing} onChange={set('batchProcessing')}
              />
            </Section>

            <div className="border-t border-gray-100 pt-5">
              <button
                onClick={() => setS(prev => ({ ...prev, advancedOpen: !prev.advancedOpen }))}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Adjust model prices
                <svg
                  style={{ transform: s.advancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                  width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {s.advancedOpen && (
                <div className="mt-4 space-y-3">
                  {PRICE_FIELDS.map(([label, key]) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <label className="text-xs text-gray-500 flex-1">{label}</label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">$</span>
                        <input
                          type="number" value={s[key]} step="0.01" min="0"
                          onChange={e => set(key)(parseFloat(e.target.value) || 0)}
                          className="w-20 border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── OUTPUT PANEL ── */}
          <div className="space-y-5">

            {/* Primary cost cards */}
            <div className="grid grid-cols-3 gap-3">
              <CostCard value={fmtCost(r.total)}  sublabel="per month" />
              <CostCard value={fmtCost(r.annual)} sublabel="per year" />
              <CostCard value={'$' + r.perUser.toFixed(2)} sublabel="per user / month" />
            </div>

            {/* Tier breakdown */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Cost by Tier</p>
              {r.total > 0 ? (
                <>
                  <div className="flex rounded overflow-hidden h-5 mb-4">
                    {r.tierBreakdown.map(t => (
                      <div
                        key={t.label}
                        style={{ width: `${Math.max((t.cost / r.total) * 100, 0)}%`, backgroundColor: t.color }}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {r.tierBreakdown.map(t => (
                      <div key={t.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: t.color }} />
                          <span className="text-gray-600">{t.label}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="text-xs text-gray-400">{((t.cost / r.total) * 100).toFixed(1)}%</span>
                          <span className="font-medium text-gray-900 w-24 text-right">{fmtCost(t.cost)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">Adjust inputs to see breakdown.</p>
              )}
            </div>

            {/* Monthly projection */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Monthly Cost Projection</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={r.projection} margin={{ top: 5, right: 10, bottom: 15, left: 10 }}>
                  <CartesianGrid stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    label={{ value: 'Month', position: 'insideBottom', offset: -8, fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={56} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="linear" dataKey="cost" stroke={ACCENT} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agentic depth impact table */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Agentic Depth Impact</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Agentic Depth</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-2">Monthly Cost</th>
                    <th className="text-right text-xs text-gray-400 font-medium pb-2 pl-4">vs. Current Selection</th>
                  </tr>
                </thead>
                <tbody>
                  {r.agenticTable.map((row, idx) => {
                    const baseline = r.agenticTable[0].cost
                    const pct = baseline > 0 ? ((row.cost - baseline) / baseline * 100) : 0
                    const isCurrent = row.mult === s.agenticMultiplier
                    return (
                      <tr
                        key={row.mult}
                        className="border-b border-gray-50 last:border-0"
                        style={{ backgroundColor: isCurrent ? '#EEF2F7' : 'transparent' }}
                      >
                        <td className="py-3 pr-4">
                          <span className={isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}>
                            {AGENTIC_OPTIONS.find(o => o.value === row.mult)?.label}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-gray-900">{fmtCost(row.cost)}</td>
                        <td className="py-3 pl-4 text-right text-xs text-gray-400">
                          {idx === 0 ? 'baseline' : `+${pct.toFixed(0)}%`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Architectural recommendation */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Architectural Recommendation</p>
              <div className="space-y-4">
                {r.recommendations.map((rec, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">{rec}</p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-1 pb-4">
              <p className="text-xs text-gray-400 italic">
                Prices are based on current market rates as of 2026 and are for planning purposes only. Update the model prices in the advanced section to reflect your contracted rates.
              </p>
              <a href="/perspectives/inference-economy" className="text-xs text-gray-500 hover:text-gray-700 underline">
                Read the Inference Economy article
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
