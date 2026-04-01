import Link from "next/link";

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-bold">Declutter</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-24 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          Turn your inbox into
          <br />
          <span className="text-gray-400">a marketplace</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
          Connect your Gmail. We find everything you bought, price it using real
          market data, write the listing, and put it in front of buyers
          automatically.
        </p>
        <p className="mt-2 text-gray-400">You just tap approve.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-black px-8 py-3 text-lg font-medium text-white hover:bg-gray-800"
          >
            Start Selling
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            How It Works
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Free to list. We only make money when you do.
        </p>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center">
          <div>
            <p className="text-3xl font-bold">$5,300</p>
            <p className="mt-1 text-sm text-gray-500">
              Average unused goods per US household
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold">73%</p>
            <p className="mt-1 text-sm text-gray-500">
              Never sell anything due to friction
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold">0 min</p>
            <p className="mt-1 text-sm text-gray-500">
              Time to create a listing with Declutter
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-12 space-y-8">
          <Step
            number={1}
            title="Connect your Gmail"
            description="We scan for purchase receipts from Amazon, Best Buy, Target, Apple, and dozens more. Read-only access — we never send emails."
          />
          <Step
            number={2}
            title="Review your items"
            description="We extract every item you've bought, categorize it, and check if it's worth reselling. You see it all before anything goes live."
          />
          <Step
            number={3}
            title="Approve listings"
            description="We write the title, description, and suggest a price using real eBay market data. Edit anything or just hit approve."
          />
          <Step
            number={4}
            title="Buyers find you"
            description="Your listings are searchable by AI shopping agents. When someone makes an offer, you get an email. Accept, and you're connected to complete the sale."
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">
            Everything happens automatically
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Receipt scanning"
              description="Reads purchase confirmations from top retailers. Extracts item name, brand, model, price, and date."
            />
            <Feature
              title="Smart pricing"
              description="Checks current eBay market prices and applies depreciation curves by category. Fair prices, not guesses."
            />
            <Feature
              title="AI-written listings"
              description="Claude generates titles and descriptions that actually sell. Honest about condition, no fake hype."
            />
            <Feature
              title="Agent-powered buyers"
              description="OpenClaw AI agents can search your listings. 'Find me a KitchenAid under $100' — and yours shows up."
            />
            <Feature
              title="One-tap offers"
              description="Buyers make offers through their AI agent. You get an email. Reply 'accept' and you're done."
            />
            <Feature
              title="Secure payments"
              description="Stripe handles the money. Buyers pay, you get paid. No meeting strangers with cash."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to declutter?</h2>
        <p className="mt-4 text-gray-600">
          Most people have dozens of resalable items sitting in closets. Find
          out what yours are worth.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-lg bg-black px-8 py-3 text-lg font-medium text-white hover:bg-gray-800"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-400">
        <p>Declutter &mdash; Turn receipts into revenue.</p>
      </footer>
    </main>
  );
}
