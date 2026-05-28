import type { Metadata } from 'next'
import InferenceCostModeller from '../../components/InferenceCostModeller'

export const metadata: Metadata = {
  title: 'Inference Cost Modeller - Elegance AI',
  description:
    'Model AI inference costs at enterprise scale across model tiers, context lengths, agentic depth, and usage patterns.',
}

export default function InferenceCostModellerPage() {
  return <InferenceCostModeller />
}
