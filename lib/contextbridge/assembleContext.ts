import { readFileSync } from 'fs'
import { join } from 'path'
import { computeOrderTrends } from './computeOrderTrends'
import type { Order } from './computeOrderTrends'

export interface Customer {
  customer_id: string
  name: string
  segment: string
  region: string
  account_manager: string
  annual_contract_value: number
  contract_renewal_date: string
  nps_score: number
  nps_previous: number
  nps_date: string
  last_crm_activity_date: string
  open_support_tickets: number
  escalated_tickets: number
  last_support_escalation_date: string | null
  opportunity_stage: string
  opportunity_last_updated: string
  customer_since: string
}

export interface ContextStats {
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

export interface AssembledContext {
  customer: Customer
  sapContext: string
  crmContext: string
  semanticContext: string
  stats: ContextStats
}

const DEMO = new Date('2026-05-27')

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

function fmtVal(v: number) {
  return '$' + Math.round(v).toLocaleString('en-US')
}

export function assembleContext(customerId: string): AssembledContext {
  const base = join(process.cwd(), 'data', 'contextbridge')
  const customers: Customer[] = JSON.parse(readFileSync(join(base, 'customers.json'), 'utf-8'))
  const orders: Order[] = JSON.parse(readFileSync(join(base, 'orders.json'), 'utf-8'))
  const semanticDict = JSON.parse(readFileSync(join(base, 'semantic_dictionary.json'), 'utf-8'))

  const customer = customers.find(c => c.customer_id === customerId)
  if (!customer) throw new Error(`Customer ${customerId} not found`)

  const trend = computeOrderTrends(orders, customerId)
  const daysCRM = daysBetween(new Date(customer.last_crm_activity_date), DEMO)
  const daysToRenewal = daysBetween(DEMO, new Date(customer.contract_renewal_date))
  const npsChange = customer.nps_score - customer.nps_previous

  const sapContext = `SAP ORDER ANALYSIS — ${customer.name} (${customerId})
Segment: ${customer.segment} | Region: ${customer.region} | Annual Contract Value: ${fmtVal(customer.annual_contract_value)}

LAST 90 DAYS (Feb 26 – May 27, 2026):
  Orders placed: ${trend.last90Count}
  Average order value: ${fmtVal(trend.last90AvgValue)}
  Product categories ordered: ${trend.categoriesLast90.join(', ') || 'none'}
  Days since most recent order: ${Math.round(trend.daysSinceLast)}

PRIOR 90 DAYS (Nov 27, 2025 – Feb 25, 2026):
  Orders placed: ${trend.prior90Count}
  Average order value: ${fmtVal(trend.prior90AvgValue)}
  Product categories ordered: ${trend.categoriesPrior90.join(', ') || 'none'}

PERIOD-OVER-PERIOD:
  Order frequency change: ${trend.freqChangePct >= 0 ? '+' : ''}${trend.freqChangePct.toFixed(0)}%
  Average order value change: ${trend.avgValueChangePct >= 0 ? '+' : ''}${trend.avgValueChangePct.toFixed(0)}%
  Category count: ${trend.categoriesLast90.length} now vs ${trend.categoriesPrior90.length} previously`

  const crmContext = `CRM DATA — ${customer.name} (${customerId})
Account Manager: ${customer.account_manager}
Customer since: ${customer.customer_since}

ENGAGEMENT:
  Last CRM activity: ${customer.last_crm_activity_date} (${daysCRM} days ago)
  Open support tickets: ${customer.open_support_tickets}
  Escalated tickets: ${customer.escalated_tickets}
  Last escalation: ${customer.last_support_escalation_date ?? 'none on record'}

NPS:
  Current score: ${customer.nps_score} (measured ${customer.nps_date})
  Previous score: ${customer.nps_previous}
  Change: ${npsChange >= 0 ? '+' : ''}${npsChange} points

RENEWAL:
  Renewal date: ${customer.contract_renewal_date} (${daysToRenewal} days from today)
  Opportunity stage: ${customer.opportunity_stage}
  Last opportunity update: ${customer.opportunity_last_updated} (${daysBetween(new Date(customer.opportunity_last_updated), DEMO)} days ago)`

  return {
    customer,
    sapContext,
    crmContext,
    semanticContext: JSON.stringify(semanticDict, null, 2),
    stats: {
      last90Count: trend.last90Count,
      prior90Count: trend.prior90Count,
      freqChangePct: trend.freqChangePct,
      avgValueChangePct: trend.avgValueChangePct,
      categoriesLast90: trend.categoriesLast90,
      categoriesPrior90: trend.categoriesPrior90,
      daysSinceLast: trend.daysSinceLast,
      daysCRM,
      daysToRenewal,
      npsChange,
    },
  }
}
