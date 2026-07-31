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
          A2A and MCP: What Is Actually Different
        </h1>
        <p className="text-[1.05rem] text-muted leading-relaxed">
          People ask me a version of this question every few weeks. Is A2A just MCP for
          agents talking to each other? It is not, and the difference matters more than it
          sounds like it should. This lab is the simplest version I could build of what A2A
          actually solves. A buyer&rsquo;s procurement agent asking a supplier&rsquo;s
          fulfillment agent, a different company, a different codebase, a system I do not
          control, for a real answer. Here is what is actually happening underneath it.
        </p>
      </section>

      <hr className="border-border max-w-2xl mx-auto" />

      <div className="prose-article max-w-2xl mx-auto px-6">
        {/* What A2A actually is */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">What A2A actually is</h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            Strip away the protocol spec and A2A is a simple idea. Two AI agents, built by
            different teams, running on different infrastructure, need to talk to each other
            and get a real answer back, without either side handing the other direct access
            to its systems. That is the whole problem A2A exists to solve.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            In this lab, the buyer&rsquo;s agent does not get a database connection into the
            supplier&rsquo;s ERP or an API key with broad access. It asks a question, what is
            the status of PO 4500012345, the way you would ask a person at another company,
            not the way you would query a table. The supplier&rsquo;s agent decides what to
            do with that question, runs its own tools against its own data, and sends back a
            considered answer. Neither side has to trust the other&rsquo;s internals. They
            only have to agree on the protocol.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Three things have to exist for that to work. The supplier publishes a card
            describing what it can do, a business card with a job description attached, not
            a wall of API documentation. The exchange is a real conversation, not a single
            request and response, because a competent counterpart sometimes needs to say it
            needs more information, or that it is not authorized to answer, instead of just
            failing. And it all runs over infrastructure any enterprise already trusts, plain
            HTTP, JSON, because nobody is re-architecting their network for this.
          </p>
          <p className="text-base text-ink leading-relaxed">
            None of that is exotic. It is closer to how two companies agree to do business
            than it is to a technical breakthrough. That is exactly why it will spread faster
            than people expect.
          </p>
        </section>

        <hr className="border-border" />

        {/* A2A vs MCP */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">
            A2A versus MCP: the distinction that actually matters
          </h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            MCP and A2A get lumped together because they both showed up around the same time
            and both have the word agent somewhere in the pitch. They solve different
            problems.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            MCP is about an agent reaching into its own toolbox: a filesystem, a database, a
            search index, a calendar. It is the standard way to wire those tools in, so you
            are not writing a bespoke integration for every tool and every model. The agent
            and the tool sit on the same side of the fence. You own both. You decide what the
            agent can touch.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            A2A is categorically different. One autonomous system asks another autonomous
            system a question, and that second system has its own reasoning, its own data,
            and its own boundaries you do not get to see inside. That is not a tool call. A
            tool does not think about whether to answer you, or have a policy about what it
            is allowed to disclose. The supplier&rsquo;s agent in this lab does. It decides,
            it reasons, it can refuse.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Here is the way I would put it to a room full of architects. MCP gives your agent
            a longer arm. A2A gives your agent a phone number to someone else&rsquo;s agent.
            You use the first to make your own agent more capable. You use the second when
            the capability you need does not belong to you, and never will.
          </p>
          <p className="text-base text-ink leading-relaxed">
            Most real enterprise workflows need both, for different hops. Your procurement
            agent uses MCP to read your own SAP data. It uses A2A to ask a supplier&rsquo;s
            agent something your own systems have no way of knowing. Try to expose a
            supplier&rsquo;s fulfillment system as an MCP tool instead, and one of two things
            happens. Either the supplier declines, because no supplier hands over that kind
            of access, or you build an integration that quietly assumes a level of trust that
            does not exist between two separate companies.
          </p>
        </section>

        <hr className="border-border" />

        {/* Why it matters */}
        <section className="py-10">
          <h2 className="font-serif text-2xl text-navy mt-0 mb-4">
            Why this is about to matter a lot more
          </h2>
          <p className="text-base text-ink leading-relaxed mb-5">
            I have written elsewhere about headless architecture, the idea that enterprise
            systems are being forced to expose themselves as clean APIs because agents have
            no use for a UI. A2A is the next layer of that same shift, and most organisations
            have not clocked it yet.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            Every enterprise adopting agentic AI right now is building internal agents first.
            One team, one codebase, tools it controls, data it owns. That is the easy 80
            percent, and it is exactly where MCP and local sub-agents belong. But the value
            enterprises actually care about does not stop at their own walls. It is in the
            supplier who ships the part, the bank that clears the payment, the insurer that
            processes the claim. The moment your agent needs an answer that only exists
            inside somebody else&rsquo;s organisation, MCP has nothing to offer, because MCP
            assumes you already have access. A2A is built for exactly that boundary, the one
            place internal agent tooling structurally cannot reach.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            That is not a niche case. It is the actual shape of most enterprise work. Supply
            chains, financial transactions, claims processes, logistics handoffs are
            inter-company by definition. An enterprise that gets internal agents working but
            has no answer for cross-company agent communication has automated the easy part
            and left the hard, valuable, differentiated work exactly where it was, a person
            on the phone, or an EDI integration nobody has touched since 2011.
          </p>
          <p className="text-base text-ink leading-relaxed mb-5">
            The vendor angle is moving faster than most CIOs are tracking. SAP restricted
            agentic API consumption to its own endorsed pathways in April, and started
            enforcing it in June. Salesforce did close to the opposite that same month,
            opening its platform up explicitly for agent consumption. Whatever position any
            single vendor lands on, the direction is the same. Platform companies are being
            forced to decide how agents that do not belong to their own customer are allowed
            to talk to their systems, and A2A is the shape that decision keeps landing on,
            because it lets two organisations cooperate without either one giving up control
            of its own systems.
          </p>
          <p className="text-base text-ink leading-relaxed">
            None of this needs to be theoretical for you. This lab is a small, honest version
            of it, synthetic data, two Cloud Run services, no real company on either end. But
            the mechanics are the real mechanics. If you are going to be the person asked how
            your agent talks to a partner&rsquo;s agent, and if agentic AI keeps moving the
            way it has, someone will ask you that, this is what the answer looks like.
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
            Back to the interactive lab
          </Link>
          <a
            href="https://github.com/rupeshpanda/enterprise-a2a-po-status-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent border border-border rounded-lg px-4 py-2 no-underline"
          >
            View the source
          </a>
        </div>
      </section>
    </main>
  );
}
