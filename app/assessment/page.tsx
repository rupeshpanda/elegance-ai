import type { Metadata } from 'next'
import AIReadinessAssessment from '../../components/AIReadinessAssessment'

export const metadata: Metadata = {
  title: 'Enterprise AI Readiness Assessment - Elegance AI',
  description:
    'Diagnose where your organisation stands on AI readiness across five dimensions: data infrastructure, integration architecture, governance and observability, talent and capability, and strategy and programme alignment.',
}

export default function AssessmentPage() {
  return <AIReadinessAssessment />
}
