const modules = [
  {
    number: "01",
    name: "iii-Wallet",
    description: "Wallet and transaction services",
  },
  {
    number: "02",
    name: "3i-Delivery (Rider)",
    description: "Delivery operations and rider workflows",
  },
  {
    number: "03",
    name: "Triple-i Market Center",
    description: "Marketplace, merchants, products, and orders",
  },
  {
    number: "04",
    name: "Iii-Talk to see You",
    description: "Communication and social discovery",
  },
  {
    number: "05",
    name: "ERP / WebApp",
    description: "Business operations and future web applications",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 sm:px-10 lg:py-20">
      <header className="mb-14 border-b border-[var(--border)] pb-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          3i-XaaS
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Company Platform
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          A shared foundation for current platform development and future
          applications. Core services and product modules will be introduced
          incrementally.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          Foundation stage · Applications not yet deployed
        </div>
      </header>

      <section aria-labelledby="platform-modules-heading">
        <div className="mb-6">
          <h2 id="platform-modules-heading" className="text-2xl font-semibold">
            Planned product modules
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Roadmap overview only. These entries are not live applications.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {modules.map((module) => (
            <li
              key={module.number}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[var(--muted)]">
                  {module.number}
                </span>
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                  Planned
                </span>
              </div>
              <h3 className="text-lg font-semibold">{module.name}</h3>
              <p className="mt-2 leading-6 text-[var(--muted)]">
                {module.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-14 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        3i-XaaS Core Platform · Initial skeleton
      </footer>
    </main>
  );
}
