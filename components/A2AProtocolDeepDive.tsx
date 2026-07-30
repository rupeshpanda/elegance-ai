import Link from "next/link";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
      {children}
    </span>
  );
}

export default function A2AProtocolDeepDive() {
  return (
    <main className="bg-bg text-ink min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3 text-sm text-muted flex items-center gap-2">
        <Link href="/" className="text-muted hover:text-ink no-underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/lab" className="text-muted hover:text-ink no-underline">
          Lab
        </Link>
        <span>/</span>
        <Link
          href="/lab/a2a-purchase-order-status"
          className="text-muted hover:text-ink no-underline"
        >
          Enterprise A2A: Purchase Order Status
        </Link>
        <span>/</span>
        <span className="text-ink">What A2A Actually Is</span>
      </div>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-14 pb-8">
        <SectionLabel>A2A, in plain terms</SectionLabel>
        <h1 className="font-serif text-[clamp(1.9rem,4.2vw,2.7rem)] text-navy leading-tight mb-4">
          What A2A actually is — and why it isn&rsquo;t MCP
        </h1>
        <p className="text-[1.05rem] text-muted leading-relaxed">
          Every few weeks someone asks me a version of the same question: &ldquo;isn&rsquo;t
          A2A just MCP for agents talking to each other?&rdquo; It isn&rsquo;t, and the
          difference matters more than it sounds like it should. This lab is the simplest
          version I could build of what A2A actually solves — a buyer&rsquo;s procurement
          agent asking a supplier&rsquo;s fulfillment agent, a different company, a different
          codebase, a system I don&rsquo;t control, for a real answer. Here&rsquo;s what&rsquo;s
          actually going on underneath it.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      <div className="prose-article max-w-2xl mx-auto px-6">
        {/* What A2A actually is */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">What A2A actually is</h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            Strip away the protocol spec and A2A is a fairly simple idea. Two AI agents,
            built by different teams, running on different infrastructure, need to talk to
            each other and get a real answer back — without either side handing the other
            direct access to its systems.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            That&rsquo;s it. That&rsquo;s the whole problem A2A exists to solve.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            In this lab, the buyer&rsquo;s agent doesn&rsquo;t get a database connection into
            the supplier&rsquo;s ERP. It doesn&rsquo;t get an API key with broad read access.
            It asks a question — &ldquo;what&rsquo;s the status of PO 4500012345?&rdquo; — the
            way you&rsquo;d ask a person at another company, not the way you&rsquo;d query a
            table. The supplier&rsquo;s agent decides what to do with that question, runs its
            own tools against its own data, and sends back a considered answer. Neither side
            has to trust the other&rsquo;s internals. They only have to agree on the protocol.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Practically, that means three things have to exist before any of this works. The
            supplier has to publish a card describing what it can do — think of it as a
            business card with a job description attached, not a wall of API documentation.
            The exchange has to be a real conversation, not a single request and response,
            because a competent counterpart sometimes needs to say &ldquo;I need more
            information&rdquo; or &ldquo;I&rsquo;m not authorized to tell you that&rdquo;
            instead of just failing. And the whole thing has to run over infrastructure any
            enterprise already trusts — plain HTTP, JSON — because nobody is re-architecting
            their network for this.
          </p>
          <p className="text-base text-ink leading-relaxed">
            None of that is exotic. It&rsquo;s closer to how two companies agree to do
            business than it is to a technical breakthrough. Which is exactly why it&rsquo;s
            going to spread faster than people expect.
          </p>
        </section>

        <hr className="border-border" />

        {/* A2A vs MCP */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">
            A2A vs. MCP — the distinction that actually matters
          </h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            MCP and A2A get lumped together because they both showed up in the same eighteen
            months and both have &ldquo;agent&rdquo; somewhere in the pitch. They solve
            different problems.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            MCP is about an agent reaching into its own toolbox. Give an agent access to a
            filesystem, a database, a search index, a calendar — MCP is the standard way to
            wire those tools in so you&rsquo;re not writing a bespoke integration for every
            tool and every model. The agent and the tool are on the same side of the fence.
            You own both. You decide what the agent can touch.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            A2A is about something categorically different: one autonomous system asking
            another autonomous system a question, where the second system has its own
            reasoning, its own data, and its own boundaries you don&rsquo;t get to see inside.
            That&rsquo;s not a tool call. A tool doesn&rsquo;t think about whether to answer
            you. A tool doesn&rsquo;t have a policy about what it&rsquo;s allowed to disclose.
            The supplier&rsquo;s agent in this lab does — it decides, it reasons, it can
            refuse.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Here&rsquo;s the way I&rsquo;d put it to a room full of architects: MCP gives your
            agent a longer arm. A2A gives your agent a phone number to someone else&rsquo;s
            agent. You use the first one to make your own agent more capable. You use the
            second one when the capability you need doesn&rsquo;t belong to you, and never
            will.
          </p>
          <p className="text-base text-ink leading-relaxed">
            Most real enterprise workflows need both, at the same time, for different hops.
            Your procurement agent uses MCP to read your own SAP data. It uses A2A to ask a
            supplier&rsquo;s agent something your own systems have no way of knowing.
            Confusing the two — trying to expose a supplier&rsquo;s fulfillment system as an
            MCP tool, for instance — means you either don&rsquo;t get it, because no supplier
            hands over that kind of access, or you build an integration that quietly assumes
            a level of trust that doesn&rsquo;t exist between two separate companies.
          </p>
        </section>

        <hr className="border-border" />

        {/* Why it matters */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">
            Why this is about to matter a lot more
          </h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            I&rsquo;ve written elsewhere about headless architecture — the idea that
            enterprise systems are being forced to expose themselves as clean APIs because
            agents have no use for a UI. A2A is the next layer of that same shift, and most
            organisations haven&rsquo;t clocked it yet.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Here&rsquo;s the pattern. Every enterprise adopting agentic AI right now is
            building internal agents first — one team, one codebase, tools it controls, data
            it owns. That&rsquo;s the easy 80%, and it&rsquo;s exactly where MCP and local
            sub-agents belong. But the value enterprises actually care about doesn&rsquo;t
            stop at their own walls. It&rsquo;s in the supplier who ships the part. The bank
            that clears the payment. The insurer that processes the claim. The logistics
            partner who has the container. The moment your agent needs an answer that only
            exists inside somebody else&rsquo;s organisation, MCP has nothing to offer you,
            because MCP assumes you already have access. A2A is built for exactly that
            boundary — the one place internal agent tooling structurally can&rsquo;t reach.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            That boundary is not a niche case. It&rsquo;s the actual shape of most enterprise
            work. Supply chains are inter-company by definition. So are most financial
            transactions, most claims processes, most logistics handoffs. An enterprise that
            gets internal agents working but has no answer for cross-company agent
            communication has automated the easy 80% and left the part that was always the
            hard, valuable, differentiated work exactly where it was — a person on the phone,
            or an EDI integration nobody&rsquo;s touched since 2011.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            I&rsquo;d also flag the vendor angle, because it&rsquo;s moving faster than most
            CIOs are tracking. SAP restricted agentic API consumption to its own endorsed
            pathways earlier this year. Salesforce did close to the opposite, opening its
            platform up explicitly for agent consumption. Whatever position any single vendor
            lands on, the direction is the same: platform companies are being forced to
            decide how agents — including agents that don&rsquo;t belong to their own
            customer — are allowed to talk to their systems. A2A, or something functionally
            like it, is the shape that conversation keeps landing on, because it&rsquo;s the
            only pattern that lets two organisations cooperate without either one giving up
            control of its own systems.
          </p>
          <p className="text-base text-ink leading-relaxed">
            None of this needs to be theoretical for you. This lab is a small, honest version
            of it — synthetic data, two Cloud Run services, no real company on either end. But
            the mechanics are the real mechanics. If you&rsquo;re the person in your
            organisation who&rsquo;s going to get asked &ldquo;how does our agent talk to a
            partner&rsquo;s agent&rdquo; sometime in the next two years — and if agentic AI
            keeps moving the way it has, someone is going to ask you that — this is what the
            answer looks like.
          </p>
        </section>
      </div>

      {/* Footer nav */}
      <section className="max-w-2xl mx-auto px-6 pt-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/lab/a2a-purchase-order-status#interactive-lab"
            className="text-sm font-semibold text-accent border border-border rounded-lg px-4 py-2 no-underline"
          >
            ← Back to the interactive lab
          </Link>
          <a
            href="https://github.com/rupeshpanda/enterprise-a2a-po-status-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent border border-border rounded-lg px-4 py-2 no-underline"
          >
            View the source →
          </a>
        </div>
      </section>
    </main>
  );
}
