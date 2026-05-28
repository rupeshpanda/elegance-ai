'use client'

import React, { useState, useCallback } from 'react'

const ACCENT = '#1E3A5F'
const GREEN = '#16A34A'
const RED = '#DC2626'
const AMBER = '#D97706'

const DEMO_CUSTOMERS = [
  { id: 'C001', name: 'Meridian Group',     detail: 'Enterprise · NA · $480K ACV',    risk: true },
  { id: 'C002', name: 'Tanaka Industries',  detail: 'Mid-Market · APAC · $155K ACV',  risk: true },
  { id: 'C003', name: 'Bluerock Retail',    detail: 'SMB · EMEA · $42K ACV',          risk: true },
  { id: 'C010', name: 'Cedar Group',        detail: 'Mid-Market · NA · $145K ACV',    risk: false },
  { id: 'C019', name: 'Granite Global',     detail: 'Enterprise · NA · $560K ACV',    risk: false },
]

type StageStatus = 'idle' | 'loading' | 'done' | 'error'

interface ContextStats {
  last90Count: number
  prior90Count: number
  freqChangePct: number
  avgValueChangePct: number
  categoriesLast90: string[]
  categoriesPrior90: string[]
  daysSinceLast: number
  daysCRM: number
  daysToRenewal: number
  npsChange: number
}

interface Customer {
  customer_id: string
  name: string
  account_manager: string
  nps_score: number
  nps_previous: number
  escalated_tickets: number
  open_support_tickets: number
}

interface AnalysisState {
  contextStatus: StageStatus
  sapStatus: StageStatus
  crmStatus: StageStatus
  customer: Customer | null
  stats: ContextStats | null
  sapContent: string
  crmContent: string
  error: string
}

const INIT: AnalysisState = {
  contextStatus: 'idle', sapStatus: 'idle', crmStatus: 'idle',
  customer: null, stats: null, sapContent: '', crmContent: '', error: '',
}

function StatRow({ label, value, flag }: { label: string; value: string; flag?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>{label}</span>
      <span style={{ fontWeight: flag ? 600 : 400, fontSize: '0.78rem', color: flag ? RED : '#111827' }}>{value}</span>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '10px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: ACCENT,
          animation: `cb-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes cb-pulse{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

function StageCard({ title, icon, badge, status, children }: {
  title: string; icon: string; badge?: string; status: StageStatus; children?: React.ReactNode
}) {
  const active = status === 'loading'
  const done = status === 'done'
  const borderColor = done ? GREEN : active ? ACCENT : '#E5E7EB'
  const headerBg = done ? '#F0FDF4' : active ? '#EEF2FF' : '#F9FAFB'

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden', background: '#fff', transition: 'border-color 0.3s' }}>
      <div style={{ background: headerBg, padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${borderColor}`, transition: 'background 0.3s' }}>
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <span style={{ fontWeight: 600, color: ACCENT, fontSize: '0.88rem' }}>{title}</span>
        {badge && <span style={{ fontSize: '0.7rem', background: '#EEF2FF', color: ACCENT, padding: '2px 7px', borderRadius: 20, fontWeight: 500 }}>{badge}</span>}
        {done && <span style={{ marginLeft: 'auto', color: GREEN, fontSize: '0.72rem', fontWeight: 600 }}>● Complete</span>}
        {active && <span style={{ marginLeft: 'auto', color: ACCENT, fontSize: '0.72rem', fontWeight: 600 }}>● Analysing…</span>}
      </div>
      <div style={{ padding: '16px 20px' }}>
        {status === 'idle' && (
          <p style={{ color: '#D1D5DB', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>Waiting…</p>
        )}
        {status === 'loading' && <Spinner />}
        {status === 'done' && children}
      </div>
    </div>
  )
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div style={{ fontSize: '0.875rem', lineHeight: 1.75, color: '#374151' }}>
      {lines.map((line, i) => {
        // Bold headers like **RISK LEVEL:**
        if (line.startsWith('**') && line.includes(':**')) {
          const [boldPart, ...rest] = line.split(':**')
          const label = boldPart.replace(/\*\*/g, '')
          const value = rest.join(':**')
          const isRisk = label === 'RISK LEVEL'
          const riskColor = value.includes('Confirmed') ? RED : value.includes('Possible') ? AMBER : GREEN
          return (
            <p key={i} style={{ margin: '12px 0 4px', fontWeight: 700, color: isRisk ? riskColor : ACCENT }}>
              {label}: <span style={{ fontWeight: isRisk ? 700 : 500, color: isRisk ? riskColor : '#374151' }}>{value}</span>
            </p>
          )
        }
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, margin: '3px 0 3px 8px' }}>
              <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>·</span>
              <span>{line.slice(2)}</span>
            </div>
          )
        }
        // Numbered actions
        if (/^\d+\./.test(line)) {
          const [num, ...rest] = line.split('. ')
          const [action, ...why] = rest.join('. ').split(' - ')
          return (
            <div key={i} style={{ display: 'flex', gap: 10, margin: '6px 0', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6, borderLeft: `3px solid ${ACCENT}` }}>
              <span style={{ fontWeight: 700, color: ACCENT, flexShrink: 0, fontSize: '0.8rem' }}>{num}.</span>
              <span>
                <span style={{ fontWeight: 600 }}>{action}</span>
                {why.length > 0 && <span style={{ color: '#6B7280' }}> - {why.join(' - ')}</span>}
              </span>
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} style={{ height: 4 }} />
        return <p key={i} style={{ margin: '2px 0' }}>{line}</p>
      })}
    </div>
  )
}

export default function ContextBridgePage() {
  const [selected, setSelected] = useState('C001')
  const [running, setRunning] = useState(false)
  const [state, setState] = useState<AnalysisState>(INIT)

  const run = useCallback(async () => {
    setRunning(true)
    setState({ ...INIT, contextStatus: 'loading' })

    const res = await fetch(`/api/contextbridge?customer=${selected}`)
    if (!res.body) { setRunning(false); return }

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    let buf = ''

    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const evt = JSON.parse(line.slice(6))

          if (evt.stage === 'context' && evt.status === 'done') {
            setState(s => ({ ...s, contextStatus: 'done', customer: evt.customer, stats: evt.stats }))
          } else if (evt.stage === 'sap' && evt.status === 'loading') {
            setState(s => ({ ...s, sapStatus: 'loading' }))
          } else if (evt.stage === 'sap' && evt.status === 'done') {
            setState(s => ({ ...s, sapStatus: 'done', sapContent: evt.content }))
          } else if (evt.stage === 'crm' && evt.status === 'loading') {
            setState(s => ({ ...s, crmStatus: 'loading' }))
          } else if (evt.stage === 'crm' && evt.status === 'done') {
            setState(s => ({ ...s, crmStatus: 'done', crmContent: evt.content }))
          } else if (evt.stage === 'complete') {
            setRunning(false)
          } else if (evt.stage === 'error') {
            setState(s => ({ ...s, error: evt.message, contextStatus: 'error' }))
            setRunning(false)
          }
        }
      }
    } finally {
      setRunning(false)
    }
  }, [selected])

  const { stats, customer } = state

  return (
    <div style={{ fontFamily: 'system-ui,-apple-system,sans-serif', background: '#F8FAFC', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Interactive Demo</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: ACCENT, margin: '0 0 14px', letterSpacing: '-0.02em' }}>SAP ContextBridge</h1>
          <p style={{ color: '#4B5563', lineHeight: 1.65, maxWidth: 660, margin: 0, fontSize: '0.93rem' }}>
            Select an account and run the analysis. The AI reads order history from a mock SAP system, then crosses
            the boundary into CRM data to synthesise a churn-risk recommendation - connecting context that would
            otherwise live in two separate systems with no shared language.
          </p>
        </div>

        {/* Selector card */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <p style={{ fontWeight: 600, color: ACCENT, margin: '0 0 14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Select Customer Account
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {DEMO_CUSTOMERS.map(c => {
              const active = selected === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c.id); setState(INIT) }}
                  style={{
                    padding: '10px 16px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left',
                    border: active ? `2px solid ${ACCENT}` : '1px solid #E5E7EB',
                    background: active ? ACCENT : '#fff',
                    color: active ? '#fff' : '#374151',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ opacity: 0.75, fontSize: '0.7rem' }}>{c.detail}</div>
                  {c.risk && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{
                        background: active ? 'rgba(255,255,255,0.2)' : '#FEF2F2',
                        color: active ? '#fff' : RED,
                        padding: '1px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
                      }}>AT RISK</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <button
            onClick={run}
            disabled={running}
            style={{
              background: running ? '#9CA3AF' : ACCENT,
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600,
              cursor: running ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
            }}
          >
            {running ? 'Analysing…' : 'Run Analysis'}
          </button>
        </div>

        {state.error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: RED, fontSize: '0.85rem' }}>
            {state.error}
          </div>
        )}

        {/* Stage cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Card 1 - Context Assembly */}
          <StageCard title="Context Assembly" icon="🔗" badge="SAP + CRM" status={state.contextStatus}>
            {stats && customer && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>SAP Order Data</p>
                  <StatRow label="Orders - last 90 days"  value={String(stats.last90Count)} />
                  <StatRow label="Orders - prior 90 days" value={String(stats.prior90Count)} />
                  <StatRow
                    label="Frequency change"
                    value={`${stats.freqChangePct >= 0 ? '+' : ''}${stats.freqChangePct.toFixed(0)}%`}
                    flag={stats.freqChangePct <= -20}
                  />
                  <StatRow
                    label="Avg value change"
                    value={`${stats.avgValueChangePct >= 0 ? '+' : ''}${stats.avgValueChangePct.toFixed(0)}%`}
                    flag={stats.avgValueChangePct <= -20}
                  />
                  <StatRow label="Categories (last 90d)"  value={stats.categoriesLast90.join(', ') || 'none'} />
                  <StatRow
                    label="Days since last order"
                    value={`${Math.round(stats.daysSinceLast)}d`}
                    flag={stats.daysSinceLast >= 28}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>CRM Signals</p>
                  <StatRow label="Account manager"        value={customer.account_manager} />
                  <StatRow
                    label="Days since CRM activity"
                    value={`${stats.daysCRM}d`}
                    flag={stats.daysCRM >= 30}
                  />
                  <StatRow
                    label="NPS score"
                    value={`${customer.nps_score} (was ${customer.nps_previous})`}
                    flag={customer.nps_score < 5}
                  />
                  <StatRow
                    label="NPS change"
                    value={`${stats.npsChange >= 0 ? '+' : ''}${stats.npsChange}`}
                    flag={stats.npsChange <= -3}
                  />
                  <StatRow
                    label="Days to renewal"
                    value={`${stats.daysToRenewal}d`}
                    flag={stats.daysToRenewal <= 90}
                  />
                  <StatRow
                    label="Escalated tickets"
                    value={String(customer.escalated_tickets)}
                    flag={customer.escalated_tickets > 0}
                  />
                </div>
              </div>
            )}
          </StageCard>

          {/* Card 2 - SAP Analysis */}
          <StageCard title="SAP Order Intelligence" icon="📊" badge="Claude call 1" status={state.sapStatus}>
            {state.sapContent && <MarkdownText text={state.sapContent} />}
          </StageCard>

          {/* Card 3 - Synthesis */}
          <StageCard title="Cross-Boundary Synthesis" icon="🤖" badge="Claude call 2" status={state.crmStatus}>
            {state.crmContent && <MarkdownText text={state.crmContent} />}
          </StageCard>

        </div>

        <p style={{ textAlign: 'center', color: '#D1D5DB', fontSize: '0.72rem', marginTop: 28 }}>
          Synthetic data only · Analysis by Claude claude-sonnet-4-5 · Reference date 2026-05-27
        </p>

      </div>
    </div>
  )
}
