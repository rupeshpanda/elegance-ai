import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { assembleContext } from '../../../lib/contextbridge/assembleContext'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function send(controller: ReadableStreamDefaultController, data: object) {
  const enc = new TextEncoder()
  controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))
}

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customer') ?? 'C001'

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ctx = assembleContext(customerId)

        send(controller, {
          stage: 'context',
          status: 'done',
          customer: ctx.customer,
          stats: ctx.stats,
        })

        // Stage 1 — SAP order analysis
        send(controller, { stage: 'sap', status: 'loading' })

        const sapRes = await client.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: `You are an enterprise AI analyzing SAP order data for churn risk signals.
Use the semantic dictionary to interpret signals correctly.
Respond with exactly 3–4 bullet points covering: order frequency trend, average value trend, category mix change, and the most important SAP-side observation.
Be concise, precise, and data-driven. No preamble.

SEMANTIC DICTIONARY:
${ctx.semanticContext}

SAP DATA:
${ctx.sapContext}`,
          }],
        })

        const sapAnalysis = (sapRes.content[0] as Anthropic.TextBlock).text
        send(controller, { stage: 'sap', status: 'done', content: sapAnalysis })

        // Stage 2 — CRM bridge and synthesis
        send(controller, { stage: 'crm', status: 'loading' })

        const crmRes = await client.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 900,
          messages: [{
            role: 'user',
            content: `You are an enterprise AI synthesising SAP and CRM signals into an executive churn-risk recommendation.

SEMANTIC DICTIONARY:
${ctx.semanticContext}

SAP ANALYSIS (already completed):
${sapAnalysis}

CRM DATA:
${ctx.crmContext}

Respond in exactly this format — no preamble:

**RISK LEVEL:** [Confirmed / Possible / Watch] — [one sentence citing specific signals from both systems]

**CRM SIGNALS:**
• [signal 1]
• [signal 2]
• [signal 3 if relevant]

**RECOMMENDED ACTIONS:**
1. [Action] — [who, what, when, why]
2. [Action] — [who, what, when, why]
3. [Action] — [who, what, when, why]`,
          }],
        })

        const synthesis = (crmRes.content[0] as Anthropic.TextBlock).text
        send(controller, { stage: 'crm', status: 'done', content: synthesis })
        send(controller, { stage: 'complete' })
      } catch (err) {
        send(controller, { stage: 'error', message: String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
