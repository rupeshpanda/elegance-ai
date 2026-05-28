// Run with: node scripts/generateContextBridgeData.mjs
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'data', 'contextbridge')
mkdirSync(OUT, { recursive: true })

const DEMO_DATE = new Date('2026-05-27')

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function fmt(d) { return d.toISOString().split('T')[0] }
function daysAgo(n) { return fmt(addDays(DEMO_DATE, -n)) }
function daysAhead(n) { return fmt(addDays(DEMO_DATE, n)) }

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

const customers = [
  // ── Churn signals ──────────────────────────────────────────────────────────
  {
    customer_id: 'C001', name: 'Meridian Group', segment: 'enterprise', region: 'NA',
    account_manager: 'Sarah Chen', annual_contract_value: 480000,
    contract_renewal_date: daysAhead(111),
    nps_score: 3, nps_previous: 8, nps_date: daysAgo(57),
    last_crm_activity_date: daysAgo(87),
    open_support_tickets: 2, escalated_tickets: 2,
    last_support_escalation_date: daysAgo(68),
    opportunity_stage: 'Renewal', opportunity_last_updated: daysAgo(65),
    customer_since: '2019-01-15'
  },
  {
    customer_id: 'C002', name: 'Tanaka Industries', segment: 'mid-market', region: 'APAC',
    account_manager: 'James Liu', annual_contract_value: 155000,
    contract_renewal_date: daysAhead(45),
    nps_score: 4, nps_previous: 7, nps_date: daysAgo(30),
    last_crm_activity_date: daysAgo(40),
    open_support_tickets: 1, escalated_tickets: 0,
    last_support_escalation_date: null,
    opportunity_stage: 'Renewal', opportunity_last_updated: daysAgo(65),
    customer_since: '2021-06-10'
  },
  {
    customer_id: 'C003', name: 'Bluerock Retail', segment: 'smb', region: 'EMEA',
    account_manager: 'Nina Kowalski', annual_contract_value: 42000,
    contract_renewal_date: daysAhead(160),
    nps_score: 4, nps_previous: 7, nps_date: daysAgo(45),
    last_crm_activity_date: daysAgo(50),
    open_support_tickets: 1, escalated_tickets: 0,
    last_support_escalation_date: null,
    opportunity_stage: 'Active', opportunity_last_updated: daysAgo(52),
    customer_since: '2022-03-01'
  },
  // ── Healthy customers ──────────────────────────────────────────────────────
  { customer_id: 'C004', name: 'Vertex Systems',    segment: 'enterprise',  region: 'NA',   account_manager: 'Sarah Chen',   annual_contract_value: 520000, contract_renewal_date: daysAhead(210), nps_score: 8, nps_previous: 8, nps_date: daysAgo(20), last_crm_activity_date: daysAgo(3),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(5),  customer_since: '2018-04-01' },
  { customer_id: 'C005', name: 'Cobalt Partners',   segment: 'enterprise',  region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 395000, contract_renewal_date: daysAhead(195), nps_score: 7, nps_previous: 7, nps_date: daysAgo(25), last_crm_activity_date: daysAgo(5),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(4),  customer_since: '2019-09-01' },
  { customer_id: 'C006', name: 'Pinnacle Corp',     segment: 'enterprise',  region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 440000, contract_renewal_date: daysAhead(240), nps_score: 9, nps_previous: 8, nps_date: daysAgo(18), last_crm_activity_date: daysAgo(2),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(3),  customer_since: '2017-11-01' },
  { customer_id: 'C007', name: 'Ironclad Industries',segment: 'enterprise', region: 'NA',   account_manager: 'Sarah Chen',   annual_contract_value: 610000, contract_renewal_date: daysAhead(280), nps_score: 8, nps_previous: 9, nps_date: daysAgo(30), last_crm_activity_date: daysAgo(7),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(6),  customer_since: '2016-05-01' },
  { customer_id: 'C008', name: 'Summit Digital',    segment: 'mid-market', region: 'EMEA', account_manager: 'Nina Kowalski', annual_contract_value: 185000, contract_renewal_date: daysAhead(220), nps_score: 7, nps_previous: 7, nps_date: daysAgo(22), last_crm_activity_date: daysAgo(4),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(8),  customer_since: '2020-07-01' },
  { customer_id: 'C009', name: 'Pacific Ridge Co',  segment: 'mid-market', region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 125000, contract_renewal_date: daysAhead(190), nps_score: 8, nps_previous: 8, nps_date: daysAgo(28), last_crm_activity_date: daysAgo(6),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(9),  customer_since: '2021-01-01' },
  { customer_id: 'C010', name: 'Cedar Group',       segment: 'mid-market', region: 'NA',   account_manager: 'Tom Bradley',  annual_contract_value: 145000, contract_renewal_date: daysAhead(300), nps_score: 9, nps_previous: 9, nps_date: daysAgo(15), last_crm_activity_date: daysAgo(2),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(3),  customer_since: '2020-04-01' },
  { customer_id: 'C011', name: 'Horizon Logistics', segment: 'mid-market', region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 160000, contract_renewal_date: daysAhead(215), nps_score: 7, nps_previous: 8, nps_date: daysAgo(35), last_crm_activity_date: daysAgo(8),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(7),  customer_since: '2019-11-01' },
  { customer_id: 'C012', name: 'Atlas Software',    segment: 'mid-market', region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 110000, contract_renewal_date: daysAhead(250), nps_score: 8, nps_previous: 8, nps_date: daysAgo(20), last_crm_activity_date: daysAgo(5),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(4),  customer_since: '2021-08-01' },
  { customer_id: 'C013', name: 'Sterling Solutions', segment: 'enterprise', region: 'LATAM',account_manager: 'Carlos Vega',  annual_contract_value: 350000, contract_renewal_date: daysAhead(270), nps_score: 7, nps_previous: 7, nps_date: daysAgo(28), last_crm_activity_date: daysAgo(11), open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(10), customer_since: '2020-02-01' },
  { customer_id: 'C014', name: 'Nordic Systems',    segment: 'enterprise',  region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 410000, contract_renewal_date: daysAhead(305), nps_score: 8, nps_previous: 8, nps_date: daysAgo(22), last_crm_activity_date: daysAgo(4),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(5),  customer_since: '2018-08-01' },
  { customer_id: 'C015', name: 'Canyon Tech',       segment: 'mid-market', region: 'NA',   account_manager: 'Tom Bradley',  annual_contract_value: 130000, contract_renewal_date: daysAhead(230), nps_score: 6, nps_previous: 7, nps_date: daysAgo(40), last_crm_activity_date: daysAgo(9),  open_support_tickets: 1, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Active',      opportunity_last_updated: daysAgo(3),  customer_since: '2022-01-01' },
  { customer_id: 'C016', name: 'Delta Operations',  segment: 'smb',        region: 'EMEA', account_manager: 'Nina Kowalski', annual_contract_value: 38000,  contract_renewal_date: daysAhead(180), nps_score: 7, nps_previous: 7, nps_date: daysAgo(30), last_crm_activity_date: daysAgo(6),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(7),  customer_since: '2022-06-01' },
  { customer_id: 'C017', name: 'Ember Analytics',   segment: 'smb',        region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 29000,  contract_renewal_date: daysAhead(200), nps_score: 8, nps_previous: 8, nps_date: daysAgo(18), last_crm_activity_date: daysAgo(3),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(4),  customer_since: '2023-01-01' },
  { customer_id: 'C018', name: 'Frontier Retail',   segment: 'smb',        region: 'NA',   account_manager: 'Tom Bradley',  annual_contract_value: 45000,  contract_renewal_date: daysAhead(260), nps_score: 7, nps_previous: 7, nps_date: daysAgo(25), last_crm_activity_date: daysAgo(8),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(6),  customer_since: '2022-09-01' },
  { customer_id: 'C019', name: 'Granite Global',    segment: 'enterprise',  region: 'NA',   account_manager: 'Sarah Chen',   annual_contract_value: 560000, contract_renewal_date: daysAhead(320), nps_score: 9, nps_previous: 9, nps_date: daysAgo(10), last_crm_activity_date: daysAgo(1),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(2),  customer_since: '2017-03-01' },
  { customer_id: 'C020', name: 'Harbor Consulting', segment: 'mid-market', region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 175000, contract_renewal_date: daysAhead(240), nps_score: 8, nps_previous: 8, nps_date: daysAgo(22), last_crm_activity_date: daysAgo(5),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(8),  customer_since: '2020-10-01' },
  { customer_id: 'C021', name: 'Indigo Software',   segment: 'smb',        region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 34000,  contract_renewal_date: daysAhead(190), nps_score: 7, nps_previous: 7, nps_date: daysAgo(28), last_crm_activity_date: daysAgo(7),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(5),  customer_since: '2023-04-01' },
  { customer_id: 'C022', name: 'Junction Group',    segment: 'mid-market', region: 'NA',   account_manager: 'Tom Bradley',  annual_contract_value: 140000, contract_renewal_date: daysAhead(275), nps_score: 8, nps_previous: 8, nps_date: daysAgo(20), last_crm_activity_date: daysAgo(4),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(3),  customer_since: '2021-05-01' },
  { customer_id: 'C023', name: 'Keystone Corp',     segment: 'enterprise',  region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 380000, contract_renewal_date: daysAhead(295), nps_score: 7, nps_previous: 7, nps_date: daysAgo(32), last_crm_activity_date: daysAgo(9),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(11), customer_since: '2019-07-01' },
  { customer_id: 'C024', name: 'Lakeview Systems',  segment: 'mid-market', region: 'NA',   account_manager: 'Sarah Chen',   annual_contract_value: 120000, contract_renewal_date: daysAhead(310), nps_score: 9, nps_previous: 9, nps_date: daysAgo(12), last_crm_activity_date: daysAgo(2),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(4),  customer_since: '2021-11-01' },
  { customer_id: 'C025', name: 'Maple Industries',  segment: 'smb',        region: 'EMEA', account_manager: 'Nina Kowalski', annual_contract_value: 52000,  contract_renewal_date: daysAhead(200), nps_score: 7, nps_previous: 8, nps_date: daysAgo(35), last_crm_activity_date: daysAgo(10), open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(6),  customer_since: '2022-02-01' },
  { customer_id: 'C026', name: 'Neptune Digital',   segment: 'mid-market', region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 95000,  contract_renewal_date: daysAhead(265), nps_score: 8, nps_previous: 8, nps_date: daysAgo(18), last_crm_activity_date: daysAgo(5),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(7),  customer_since: '2021-09-01' },
  { customer_id: 'C027', name: 'Orion Consulting',  segment: 'enterprise',  region: 'NA',   account_manager: 'Tom Bradley',  annual_contract_value: 430000, contract_renewal_date: daysAhead(285), nps_score: 8, nps_previous: 8, nps_date: daysAgo(24), last_crm_activity_date: daysAgo(6),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(8),  customer_since: '2018-12-01' },
  { customer_id: 'C028', name: 'Phoenix Retail',    segment: 'smb',        region: 'EMEA', account_manager: 'Marco Ferrari', annual_contract_value: 31000,  contract_renewal_date: daysAhead(175), nps_score: 6, nps_previous: 6, nps_date: daysAgo(30), last_crm_activity_date: daysAgo(12), open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(9),  customer_since: '2023-02-01' },
  { customer_id: 'C029', name: 'Quantum Solutions', segment: 'mid-market', region: 'APAC', account_manager: 'James Liu',    annual_contract_value: 108000, contract_renewal_date: daysAhead(230), nps_score: 7, nps_previous: 7, nps_date: daysAgo(26), last_crm_activity_date: daysAgo(8),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(5),  customer_since: '2021-07-01' },
  { customer_id: 'C030', name: 'Radius Global',     segment: 'enterprise',  region: 'NA',   account_manager: 'Sarah Chen',   annual_contract_value: 490000, contract_renewal_date: daysAhead(315), nps_score: 9, nps_previous: 9, nps_date: daysAgo(14), last_crm_activity_date: daysAgo(3),  open_support_tickets: 0, escalated_tickets: 0, last_support_escalation_date: null, opportunity_stage: 'Closed Won', opportunity_last_updated: daysAgo(2),  customer_since: '2016-08-01' },
]

// ─── ORDERS ──────────────────────────────────────────────────────────────────

const orders = []
let ordNum = 1

function ord(customerId, date, value, category, salesOrg) {
  const year = new Date(date).getFullYear()
  orders.push({
    order_id: `ORD-${year}-${String(ordNum++).padStart(4, '0')}`,
    customer_id: customerId,
    order_date: date,
    net_value: value,
    product_category: category,
    quantity: Math.max(1, Math.round(value / 2000)),
    sales_org: salesOrg
  })
}

// C001 — Meridian Group (NA, enterprise, $65K/order)
// Good: Nov 2024–Jan 2026 (~every 9 days, 4 categories)
const C001_CATS_GOOD = ['Infrastructure','Analytics','Security','Consulting']
const C001_GOOD_START = new Date('2024-11-27')
const C001_BAD_START = new Date('2026-01-27')
for (let d = new Date(C001_GOOD_START); d < C001_BAD_START; d = addDays(d, 9)) {
  const cat = C001_CATS_GOOD[Math.floor((d - C001_GOOD_START) / (9 * 86400000)) % 4]
  ord('C001', fmt(d), 58000 + ((ordNum * 1234) % 14000), cat, '1000')
}
// Bad: Feb 2026–May 2026 (every 46 days, Infrastructure only, ~$27K)
for (let d = new Date('2026-02-10'); d < DEMO_DATE; d = addDays(d, 46)) {
  ord('C001', fmt(d), 24000 + ((ordNum * 567) % 8000), 'Infrastructure', '1000')
}

// C002 — Tanaka Industries (APAC, mid-market, $12K/order)
// Good: Nov 2024–Jan 2026 (weekly, Analytics+Security)
const C002_CATS = ['Analytics','Security']
const C002_BAD_START = new Date('2026-01-25')
for (let d = new Date('2024-11-27'); d < C002_BAD_START; d = addDays(d, 7)) {
  const cat = C002_CATS[Math.floor((d - new Date('2024-11-27')) / (7 * 86400000)) % 2]
  ord('C002', fmt(d), 9500 + ((ordNum * 789) % 5000), cat, '3000')
}
// Bad: Feb 2026–May 2026 (every 21 days, Analytics only, ~$6.5K)
for (let d = new Date('2026-02-04'); d < DEMO_DATE; d = addDays(d, 21)) {
  ord('C002', fmt(d), 5500 + ((ordNum * 321) % 2000), 'Analytics', '3000')
}

// C003 — Bluerock Retail (EMEA, smb, $3.2K/order)
// Good: Nov 2024–Mar 2026 (every 10 days, Consulting+Analytics)
const C003_CATS = ['Consulting','Analytics']
const C003_BAD_START = new Date('2026-03-17')
for (let d = new Date('2024-11-27'); d < C003_BAD_START; d = addDays(d, 10)) {
  const cat = C003_CATS[Math.floor((d - new Date('2024-11-27')) / (10 * 86400000)) % 2]
  ord('C003', fmt(d), 2800 + ((ordNum * 456) % 800), cat, '2000')
}
// Bad: Two small orders then silence (last order Apr 2, nothing after)
ord('C003', '2026-03-22', 1800, 'Consulting', '2000')
ord('C003', '2026-04-02', 1600, 'Consulting', '2000')
// 55-day gap — no orders until demo date

// Healthy customers C004–C030: every 10 days, multiple categories, consistent value
const HEALTHY_CATS = ['Infrastructure','Analytics','Security','Consulting','Licensing']
const HEALTHY_ORGS = { NA: '1000', EMEA: '2000', APAC: '3000', LATAM: '4000' }
const HEALTHY_VALUES = {
  enterprise: 40000, 'mid-market': 15000, smb: 4000
}

for (const c of customers.slice(3)) {
  const baseValue = HEALTHY_VALUES[c.segment]
  const org = HEALTHY_ORGS[c.region]
  let catIdx = 0
  for (let d = new Date('2024-11-27'); d <= DEMO_DATE; d = addDays(d, 10)) {
    const cat = HEALTHY_CATS[catIdx % HEALTHY_CATS.length]
    const jitter = ((ordNum * 137 + catIdx * 31) % 10 - 5) * (baseValue * 0.05)
    ord(c.customer_id, fmt(d), Math.round(baseValue + jitter), cat, org)
    catIdx++
  }
}

// ─── SEMANTIC DICTIONARY ─────────────────────────────────────────────────────

const semanticDictionary = {
  churn_risk_signals: {
    description: 'Behavioural patterns suggesting customer disengagement or intent to leave',
    sap_indicators: [
      'declining order frequency over 3 or more consecutive months',
      'declining average order value over 3 or more consecutive months',
      'narrowing product category mix — ordering fewer categories than historical baseline',
      'extended gap between orders vs historical average cadence',
      'complete cessation of orders for 4 or more weeks in a previously active account'
    ],
    crm_indicators: [
      'no CRM activity logged in 30 or more days',
      'NPS score below 5',
      'NPS score decline of 3 or more points since last measurement',
      'renewal opportunity within 90 days with no recent activity',
      'support ticket open and unresolved for more than 21 days',
      'escalated support ticket open',
      'renewal opportunity stage not updated in 45 or more days'
    ],
    risk_levels: {
      confirmed: '3 or more signals present across both systems',
      possible: '2 signals present, or signals from one system only',
      watch: '1 signal present — monitor but no immediate action required'
    }
  },
  order_pattern_change: {
    description: 'Statistically meaningful change in a customer ordering behaviour',
    calculation: 'compare order frequency and average value in last 90 days vs prior 90 days',
    meaningful_threshold: '20 percent or more decline in frequency or value',
    tables: ['orders']
  },
  crm_engagement_decline: {
    description: 'Reduction in sales and support touchpoints with a customer',
    fields: [
      'last_crm_activity_date','open_support_tickets','escalated_tickets',
      'nps_score','nps_previous','opportunity_last_updated'
    ],
    tables: ['customers']
  },
  cross_signal_analysis: {
    description: 'Synthesis of SAP behavioural signals and CRM engagement signals',
    approach: 'flag customers where two or more signals from different systems align',
    priority: 'customers with signals in both systems are higher risk than those with signals from one system only'
  },
  product_category_mix: {
    description: 'The range of product categories a customer orders across',
    calculation: 'count distinct categories ordered in last 90 days vs prior 90 days',
    signal: 'reduction of 2 or more categories is a meaningful narrowing signal'
  }
}

// ─── WRITE FILES ─────────────────────────────────────────────────────────────

writeFileSync(join(OUT, 'customers.json'), JSON.stringify(customers, null, 2))
writeFileSync(join(OUT, 'orders.json'), JSON.stringify(orders, null, 2))
writeFileSync(join(OUT, 'semantic_dictionary.json'), JSON.stringify(semanticDictionary, null, 2))

console.log(`customers: ${customers.length}`)
console.log(`orders: ${orders.length}`)

// Quick sanity check — which customers get flagged?
const DEMO = new Date('2026-05-27')
const L90S = new Date(DEMO.getTime() - 90 * 86400000)
const P90S = new Date(L90S.getTime() - 90 * 86400000)

for (const c of customers) {
  const custOrders = orders.filter(o => o.customer_id === c.customer_id)
  const last90 = custOrders.filter(o => new Date(o.order_date) >= L90S && new Date(o.order_date) <= DEMO)
  const prior90 = custOrders.filter(o => new Date(o.order_date) >= P90S && new Date(o.order_date) < L90S)
  const freqChg = prior90.length > 0 ? (last90.length - prior90.length) / prior90.length * 100 : 0
  const daysSinceLast = custOrders.length > 0
    ? (DEMO - new Date(Math.max(...custOrders.map(o => new Date(o.order_date))))) / 86400000
    : 999
  const daysCRM = (DEMO - new Date(c.last_crm_activity_date)) / 86400000
  const daysRenewal = (new Date(c.contract_renewal_date) - DEMO) / 86400000
  const npsChg = c.nps_score - c.nps_previous

  const flags = []
  if (freqChg <= -20) flags.push(`freq${freqChg.toFixed(0)}%`)
  if (daysSinceLast >= 28) flags.push(`lastOrder${Math.round(daysSinceLast)}d`)
  if (daysCRM >= 30) flags.push(`CRM${Math.round(daysCRM)}d`)
  if (c.nps_score < 5) flags.push(`NPS${c.nps_score}`)
  if (npsChg <= -3) flags.push(`NPSdrop${npsChg}`)
  if (c.escalated_tickets > 0) flags.push(`escalated`)
  if (daysRenewal <= 90 && daysCRM >= 30) flags.push(`renewal${Math.round(daysRenewal)}d+CRM`)

  if (flags.length > 0) {
    console.log(`FLAGGED ${c.customer_id} ${c.name}: ${flags.join(', ')}`)
  }
}
