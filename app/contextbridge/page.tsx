import type { Metadata } from 'next'
import ContextBridge from '../../components/ContextBridge'

export const metadata: Metadata = {
  title: 'SAP ContextBridge — Elegance AI',
  description:
    'An AI demo that bridges SAP order data and CRM signals to identify churn risk across system boundaries.',
}

export default function ContextBridgePage() {
  return <ContextBridge />
}
