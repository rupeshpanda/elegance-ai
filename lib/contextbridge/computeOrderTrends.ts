const DEMO_DATE = new Date('2026-05-27')
const L90_START = new Date(DEMO_DATE.getTime() - 90 * 86400000)
const P90_START = new Date(L90_START.getTime() - 90 * 86400000)

export interface Order {
  order_id: string
  customer_id: string
  order_date: string
  net_value: number
  product_category: string
  quantity: number
  sales_org: string
}

export interface OrderTrend {
  last90Count: number
  prior90Count: number
  last90AvgValue: number
  prior90AvgValue: number
  freqChangePct: number
  avgValueChangePct: number
  categoriesLast90: string[]
  categoriesPrior90: string[]
  daysSinceLast: number
  lastOrderDate: string | null
}

export function computeOrderTrends(orders: Order[], customerId: string): OrderTrend {
  const cOrders = orders
    .filter(o => o.customer_id === customerId)
    .sort((a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime())

  const last90 = cOrders.filter(o => {
    const d = new Date(o.order_date)
    return d >= L90_START && d <= DEMO_DATE
  })

  const prior90 = cOrders.filter(o => {
    const d = new Date(o.order_date)
    return d >= P90_START && d < L90_START
  })

  const last90AvgValue = last90.length > 0
    ? last90.reduce((s, o) => s + o.net_value, 0) / last90.length
    : 0
  const prior90AvgValue = prior90.length > 0
    ? prior90.reduce((s, o) => s + o.net_value, 0) / prior90.length
    : 0

  const freqChangePct = prior90.length > 0
    ? ((last90.length - prior90.length) / prior90.length) * 100
    : 0

  const avgValueChangePct = prior90AvgValue > 0
    ? ((last90AvgValue - prior90AvgValue) / prior90AvgValue) * 100
    : 0

  const categoriesLast90 = [...new Set(last90.map(o => o.product_category))]
  const categoriesPrior90 = [...new Set(prior90.map(o => o.product_category))]

  const lastOrder = cOrders[cOrders.length - 1] ?? null
  const daysSinceLast = lastOrder
    ? (DEMO_DATE.getTime() - new Date(lastOrder.order_date).getTime()) / 86400000
    : 999

  return {
    last90Count: last90.length,
    prior90Count: prior90.length,
    last90AvgValue,
    prior90AvgValue,
    freqChangePct,
    avgValueChangePct,
    categoriesLast90,
    categoriesPrior90,
    daysSinceLast,
    lastOrderDate: lastOrder?.order_date ?? null,
  }
}
