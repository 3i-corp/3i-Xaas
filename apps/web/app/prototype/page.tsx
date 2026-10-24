"use client";

import { useMemo, useState } from "react";

type ServiceKey = "commerce" | "wallet" | "identity" | "api" | "billing";
type MetricPoint = { month: string; activity: number; adoption: number; reliability: number };

const serviceNames: Record<ServiceKey, string> = {
  commerce: "Commerce",
  wallet: "III Wallet",
  identity: "Identity",
  api: "API Platform",
  billing: "Billing",
};

// Illustrative synthetic data only. Values are scenario assumptions, not observed production metrics.
const trends: Record<ServiceKey, MetricPoint[]> = {
  commerce: [
    { month: "May", activity: 4200, adoption: 34, reliability: 99.7 },
    { month: "Jun", activity: 4680, adoption: 37, reliability: 99.8 },
    { month: "Jul", activity: 5120, adoption: 41, reliability: 99.7 },
    { month: "Aug", activity: 5710, adoption: 45, reliability: 99.9 },
    { month: "Sep", activity: 6390, adoption: 49, reliability: 99.8 },
    { month: "Oct", activity: 7040, adoption: 54, reliability: 99.9 },
  ],
  wallet: [
    { month: "May", activity: 1100, adoption: 12, reliability: 99.1 },
    { month: "Jun", activity: 1390, adoption: 15, reliability: 99.2 },
    { month: "Jul", activity: 1760, adoption: 19, reliability: 99.4 },
    { month: "Aug", activity: 2180, adoption: 24, reliability: 99.3 },
    { month: "Sep", activity: 2670, adoption: 29, reliability: 99.5 },
    { month: "Oct", activity: 3260, adoption: 35, reliability: 99.6 },
  ],
  identity: [
    { month: "May", activity: 3100, adoption: 28, reliability: 99.8 },
    { month: "Jun", activity: 3260, adoption: 30, reliability: 99.8 },
    { month: "Jul", activity: 3480, adoption: 33, reliability: 99.9 },
    { month: "Aug", activity: 3710, adoption: 35, reliability: 99.8 },
    { month: "Sep", activity: 4050, adoption: 39, reliability: 99.9 },
    { month: "Oct", activity: 4390, adoption: 42, reliability: 99.9 },
  ],
  api: [
    { month: "May", activity: 18200, adoption: 44, reliability: 99.5 },
    { month: "Jun", activity: 20100, adoption: 47, reliability: 99.6 },
    { month: "Jul", activity: 22800, adoption: 51, reliability: 99.5 },
    { month: "Aug", activity: 24900, adoption: 56, reliability: 99.7 },
    { month: "Sep", activity: 28100, adoption: 61, reliability: 99.8 },
    { month: "Oct", activity: 31900, adoption: 66, reliability: 99.8 },
  ],
  billing: [
    { month: "May", activity: 760, adoption: 18, reliability: 99.6 },
    { month: "Jun", activity: 810, adoption: 20, reliability: 99.7 },
    { month: "Jul", activity: 910, adoption: 22, reliability: 99.7 },
    { month: "Aug", activity: 1030, adoption: 25, reliability: 99.8 },
    { month: "Sep", activity: 1190, adoption: 28, reliability: 99.8 },
    { month: "Oct", activity: 1380, adoption: 32, reliability: 99.9 },
  ],
};

const serviceCards: { key: ServiceKey; label: string; description: string; color: string }[] = [
  { key: "commerce", label: "Commerce", description: "Catalog & orders", color: "#2563eb" },
  { key: "wallet", label: "III Wallet", description: "Wallet journeys", color: "#7c3aed" },
  { key: "identity", label: "Identity", description: "Accounts & access", color: "#0891b2" },
  { key: "api", label: "API Platform", description: "API requests", color: "#0f766e" },
  { key: "billing", label: "Billing", description: "Invoices & cycles", color: "#c2410c" },
];

function fmt(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function CoreSystemPrototype() {
  const [selected, setSelected] = useState<ServiceKey>("commerce");
  const [metric, setMetric] = useState<"activity" | "adoption">("activity");
  const points = trends[selected];
  const current = points[points.length - 1];
  const previous = points[points.length - 2];
  const delta = useMemo(
    () => ((current.activity - previous.activity) / previous.activity) * 100,
    [current.activity, previous.activity],
  );
  const max = Math.max(...points.map((point) => point[metric]));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">3icorp XaaS · Core System</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Service overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">A cross-service operating view for product activity, adoption and reliability.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">SYNTHETIC DATA</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">Scenario: May–Oct</span>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Prototype only.</strong> All values are simulated for workflow and layout validation. They are not sourced from live services, customers, payments, or the Production database. Growth patterns are scenario assumptions and must be recalibrated against approved, anonymized service data before operational use.
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Selected service · October activity</p>
            <p className="mt-2 text-3xl font-bold">{fmt(current.activity)}</p>
            <p className="mt-2 text-xs text-slate-500">{serviceNames[selected]} · synthetic service-specific units</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Service surfaces</p>
            <p className="mt-2 text-3xl font-bold">05</p>
            <p className="mt-2 text-xs text-slate-500">Commerce, Wallet, Identity, API, Billing</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Selected service reliability</p>
            <p className="mt-2 text-3xl font-bold">{current.reliability.toFixed(1)}%</p>
            <p className="mt-2 text-xs text-slate-500">Simulated monthly availability indicator</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Selected service activity change</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">+{delta.toFixed(1)}%</p>
            <p className="mt-2 text-xs text-slate-500">Illustrative month-over-month change</p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="px-2 text-sm font-bold text-slate-900">Service modules</h2>
            <div className="mt-3 space-y-2" role="group" aria-label="Select service">
              {serviceCards.map((service) => (
                <button
                  key={service.key}
                  type="button"
                  aria-pressed={selected === service.key}
                  onClick={() => setSelected(service.key)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected === service.key ? "border-indigo-300 bg-indigo-50" : "border-transparent hover:bg-slate-50"}`}
                >
                  <span className="h-3 w-3 rounded-full" aria-hidden="true" style={{ backgroundColor: service.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{service.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{service.description}</span>
                  </span>
                  <span className="text-slate-400" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">Module selection changes only the synthetic view. It does not call APIs or activate any service.</p>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Trend explorer</p>
                  <h2 className="mt-1 text-xl font-bold">{serviceNames[selected]}</h2>
                  <p className="mt-1 text-sm text-slate-500">Monthly synthetic scenario · May–October</p>
                </div>
                <div className="flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Select trend metric">
                  <button
                    type="button"
                    aria-pressed={metric === "activity"}
                    onClick={() => setMetric("activity")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${metric === "activity" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}
                  >Activity</button>
                  <button
                    type="button"
                    aria-pressed={metric === "adoption"}
                    onClick={() => setMetric("adoption")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${metric === "adoption" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}
                  >Adoption index</button>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-6 gap-3" role="img" aria-label={`${serviceNames[selected]} synthetic ${metric === "activity" ? "activity counts" : "adoption index percentages"} from May through October`}>
                {points.map((point) => {
                  const value = point[metric];
                  const height = Math.max(10, (value / max) * 170);
                  return <div key={point.month} className="flex min-w-0 flex-col items-center justify-end" aria-hidden="true">
                    <span className="mb-2 text-[10px] font-semibold text-slate-500 sm:text-xs">{metric === "activity" ? fmt(value) : `${value}%`}</span>
                    <div className="flex h-44 w-full items-end rounded-t-lg bg-slate-50">
                      <div className="w-full rounded-t-lg bg-indigo-600 transition-all" style={{ height: `${height}px` }} />
                    </div>
                    <span className="mt-3 text-xs text-slate-500">{point.month}</span>
                  </div>;
                })}
              </div>
              <table className="sr-only">
                <caption>{`${serviceNames[selected]} monthly synthetic ${metric === "activity" ? "activity counts" : "adoption index percentages"}, May through October`}</caption>
                <thead><tr><th scope="col">Month</th><th scope="col">{metric === "activity" ? "Activity count" : "Adoption index"}</th></tr></thead>
                <tbody>{points.map((point) => (
                  <tr key={`accessible-${point.month}`}>
                    <th scope="row">{point.month}</th>
                    <td>{metric === "activity" ? fmt(point.activity) : `${point.adoption}%`}</td>
                  </tr>
                ))}</tbody>
              </table>
              <p className="mt-5 text-xs leading-5 text-slate-500">Activity is a service-specific simulated count, not a cross-service comparable unit. Adoption index is a scenario percentage for prototype exploration only.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">Service snapshot</h2>
                  <p className="text-sm text-slate-500">Latest synthetic month, October</p>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">Read-only prototype</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <caption className="sr-only">October synthetic snapshot for each service</caption>
                  <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th scope="col" className="py-3 pr-4 font-semibold">Service</th><th scope="col" className="py-3 pr-4 font-semibold">Activity</th><th scope="col" className="py-3 pr-4 font-semibold">Adoption index</th><th scope="col" className="py-3 font-semibold">Reliability</th></tr></thead>
                  <tbody>{serviceCards.map((service) => {
                    const latest = trends[service.key][5];
                    return <tr key={service.key} className="border-b border-slate-100 last:border-0">
                      <th scope="row" className="py-3 pr-4 font-semibold">{service.label}</th>
                      <td className="py-3 pr-4 tabular-nums">{fmt(latest.activity)}</td>
                      <td className="py-3 pr-4 tabular-nums">{latest.adoption}%</td>
                      <td className="py-3 tabular-nums">{latest.reliability.toFixed(1)}%</td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            </section>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 py-5 text-xs leading-5 text-slate-500">
          Data lineage: hand-authored synthetic scenario assumptions. No external reference dataset or live service telemetry is connected in this prototype. Next validation gate: define metric contracts per service, source and freshness metadata, privacy-safe aggregation, and reconciliation rules before comparing with real service trends.
        </footer>
      </div>
    </main>
  );
}
